import client, { getAccessToken, refreshAccessToken } from 'api/client';

export type Notification = {
  id: number;
  type: string;
  role: string;
  title: string;
  body: string;
  amount: number;
  transferReference: string;
  createdAt: string;
  readAt: string | null;
};
export type NotificationPage = { items: Notification[]; unreadCount: number; hasMore: boolean };
export const getNotifications = (before?: string) =>
  client.get<NotificationPage>('/api/v1/notifications', {
    params: { limit: 20, ...(before ? { before } : {}) },
  });
export const markNotificationRead = (id: number) =>
  client.patch<Notification>(`/api/v1/notifications/${id}/read`);

export const streamNotifications = async (
  onMessage: (item: Notification) => void,
  signal: AbortSignal,
) => {
  let accessToken = getAccessToken() || (await refreshAccessToken());
  if (!accessToken) throw new Error('Not authenticated');
  let response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1/notifications/stream`,
    {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'text/event-stream' },
      credentials: 'include',
      signal,
    },
  );
  if (response.status === 401) {
    accessToken = await refreshAccessToken();
    if (!accessToken) throw new Error('Not authenticated');
    response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/v1/notifications/stream`,
      {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: 'text/event-stream' },
        credentials: 'include',
        signal,
      },
    );
  }
  if (!response.ok || !response.body) throw new Error('Notification stream unavailable');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (!signal.aborted) {
    const next = await reader.read();
    if (next.done) break;
    buffer += decoder.decode(next.value, { stream: true });
    let boundary: number;
    while ((boundary = buffer.indexOf('\n\n')) >= 0) {
      const frame = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      const data = frame
        .split('\n')
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trim())
        .join('');
      if (data) onMessage(JSON.parse(data) as Notification);
    }
  }
};
