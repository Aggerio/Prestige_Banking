import { getAccessToken, refreshAccessToken } from 'api/client';

export type ChatStreamMetadata = { conversationId: string; sources: string[] };

export type ChatStreamHandlers = {
  onMetadata: (metadata: ChatStreamMetadata) => void;
  onToken: (token: string) => void;
  onComplete: (metadata: ChatStreamMetadata) => void;
  onError: (message: string) => void;
};

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const parseEventData = (frame: string) =>
  frame
    .split(/\r?\n/)
    .filter((line) => line.startsWith('data:'))
    // Keep the entire token after `data:`. The backend streams token-leading
    // whitespace as part of the value, and stripping it joins words together.
    .map((line) => line.slice(5))
    .join('\n');

const requestStream = (
  accessToken: string,
  message: string,
  conversationId: string | null,
  signal: AbortSignal,
) =>
  fetch(`${baseUrl}/api/v1/chat/stream`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    signal,
    body: JSON.stringify({ message, ...(conversationId ? { conversationId } : {}) }),
  });

export const streamChat = async (
  message: string,
  conversationId: string | null,
  handlers: ChatStreamHandlers,
  signal: AbortSignal,
) => {
  let accessToken = getAccessToken() || (await refreshAccessToken());
  if (!accessToken) throw new Error('Please sign in to use the banking assistant.');

  let response = await requestStream(accessToken, message, conversationId, signal);
  if (response.status === 401) {
    accessToken = await refreshAccessToken();
    if (!accessToken) throw new Error('Please sign in to use the banking assistant.');
    response = await requestStream(accessToken, message, conversationId, signal);
  }
  if (!response.ok || !response.body)
    throw new Error('The banking assistant is temporarily unavailable.');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (!signal.aborted) {
    const next = await reader.read();
    if (next.done) break;
    buffer += decoder.decode(next.value, { stream: true });
    const frames = buffer.split(/\r?\n\r?\n/);
    buffer = frames.pop() || '';
    for (const frame of frames) {
      const event = frame.match(/^event:\s*(.+)$/m)?.[1]?.trim();
      const data = parseEventData(frame);
      if (!event || !data) continue;
      if (event === 'token') handlers.onToken(data);
      if (event === 'metadata') handlers.onMetadata(JSON.parse(data) as ChatStreamMetadata);
      if (event === 'complete') handlers.onComplete(JSON.parse(data) as ChatStreamMetadata);
      if (event === 'error')
        handlers.onError(
          (JSON.parse(data) as { message?: string }).message ||
            'The banking assistant is temporarily unavailable.',
        );
    }
  }
};
