import {
  Box,
  Chip,
  Fab,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { streamChat } from 'api/chat';
import IconifyIcon from 'components/base/IconifyIcon';
import { FormEvent, useEffect, useRef, useState } from 'react';

type ChatMessage = { id: string; sender: 'assistant' | 'user'; text: string; sources?: string[] };

const starterMessages: ChatMessage[] = [
  {
    id: 'welcome',
    sender: 'assistant',
    text: 'Hello! I am your Prestige Banking assistant. How can I help today?',
  },
];
const quickPrompts = ['Account help', 'Transfers', 'Cards'];

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isStreaming]);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isStreaming) return;

    const assistantId = crypto.randomUUID();
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), sender: 'user', text },
      { id: assistantId, sender: 'assistant', text: '' },
    ]);
    setDraft('');
    setStreamError(null);
    setIsStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamChat(
        text,
        conversationId,
        {
          onMetadata: (metadata) => setConversationId(metadata.conversationId),
          onToken: (token) =>
            setMessages((current) =>
              current.map((item) =>
                item.id === assistantId ? { ...item, text: item.text + token } : item,
              ),
            ),
          onComplete: (metadata) => {
            setConversationId(metadata.conversationId);
            setMessages((current) =>
              current.map((item) =>
                item.id === assistantId ? { ...item, sources: metadata.sources } : item,
              ),
            );
          },
          onError: (message) => {
            setStreamError(message);
            setMessages((current) =>
              current.map((item) =>
                item.id === assistantId && !item.text ? { ...item, text: message } : item,
              ),
            );
          },
        },
        controller.signal,
      );
    } catch (error) {
      if (!controller.signal.aborted) {
        const message =
          error instanceof Error
            ? error.message
            : 'The banking assistant is temporarily unavailable.';
        setStreamError(message);
        setMessages((current) =>
          current.map((item) =>
            item.id === assistantId && !item.text ? { ...item, text: message } : item,
          ),
        );
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setIsStreaming(false);
    }
  };

  return (
    <>
      {open && (
        <Box
          role="dialog"
          aria-label="Prestige Banking assistant"
          sx={{
            position: 'fixed',
            right: { xs: 12, sm: 24 },
            bottom: { xs: 82, sm: 96 },
            zIndex: 1300,
            width: { xs: 'calc(100vw - 24px)', sm: 380 },
            height: { xs: 'min(560px, calc(100vh - 112px))', sm: 520 },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 3,
            bgcolor: '#F8FAF9',
            border: '1px solid rgba(19,74,56,.14)',
            boxShadow: '0 24px 70px rgba(6,35,27,.24)',
            animation: 'chatPanelEnter 240ms cubic-bezier(.2,.8,.2,1) both',
            '@keyframes chatPanelEnter': {
              from: { opacity: 0, transform: 'translate3d(0,16px,0) scale(.97)' },
              to: { opacity: 1, transform: 'none' },
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 2.25, py: 1.75, color: '#F2F8F4', bgcolor: '#102C23' }}
          >
            <Stack direction="row" alignItems="center" gap={1.25}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '50%',
                  color: '#123328',
                  bgcolor: '#9BE6C9',
                }}
              >
                <IconifyIcon icon="solar:chat-round-dots-bold" width={21} />
              </Box>
              <Box>
                <Typography fontWeight={700}>Prestige Assistant</Typography>
                <Stack direction="row" alignItems="center" gap={0.6}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#9BE6C9' }} />
                  <Typography variant="caption" sx={{ color: '#B9C9C1' }}>
                    {isStreaming ? 'Replying...' : 'Online'}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <IconButton
              aria-label="Close assistant"
              onClick={() => setOpen(false)}
              sx={{ color: '#DDE9E3' }}
            >
              <IconifyIcon icon="solar:close-circle-linear" width={23} />
            </IconButton>
          </Stack>
          <Stack gap={1.5} sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2.25, bgcolor: '#F1F5F3' }}>
            <Typography variant="caption" textAlign="center" sx={{ color: 'text.secondary' }}>
              Chat history is stored only in this page session.
            </Typography>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '84%',
                  px: 1.75,
                  py: 1.25,
                  borderRadius:
                    message.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  color: message.sender === 'user' ? '#F5FAF7' : '#263A32',
                  bgcolor: message.sender === 'user' ? '#176D50' : '#FFFFFF',
                  border: message.sender === 'user' ? 0 : '1px solid #DDE7E2',
                  boxShadow: message.sender === 'user' ? 'none' : '0 5px 18px rgba(18,57,44,.06)',
                }}
              >
                <Typography variant="body2" sx={{ lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                  {message.text || '...'}
                </Typography>
                {message.sources && message.sources.length > 0 && (
                  <Stack direction="row" gap={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                    {message.sources.map((source) => (
                      <Chip
                        key={source}
                        label={source}
                        size="small"
                        sx={{ height: 22, fontSize: 11 }}
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            ))}
            {streamError && (
              <Typography variant="caption" sx={{ color: 'error.main', textAlign: 'center' }}>
                {streamError}
              </Typography>
            )}
            {messages.length === 1 && (
              <Stack direction="row" gap={0.75} flexWrap="wrap" useFlexGap>
                {quickPrompts.map((prompt) => (
                  <Chip
                    key={prompt}
                    label={prompt}
                    size="small"
                    onClick={() => setDraft(prompt)}
                    sx={{ bgcolor: '#E2EEE8', color: '#245A46', fontWeight: 600 }}
                  />
                ))}
              </Stack>
            )}
            <div ref={messagesEndRef} />
          </Stack>
          <Box component="form" onSubmit={sendMessage} sx={{ p: 1.5, bgcolor: '#FFFFFF' }}>
            <TextField
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type your message..."
              fullWidth
              size="small"
              inputProps={{ 'aria-label': 'Chat message' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      aria-label="Send message"
                      disabled={!draft.trim() || isStreaming}
                      sx={{ color: '#176D50' }}
                    >
                      <IconifyIcon icon="solar:plain-bold" width={21} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.5,
                  bgcolor: '#F5F8F6',
                  '& fieldset': { borderColor: '#D8E4DE' },
                },
              }}
            />
          </Box>
        </Box>
      )}
      <Fab
        aria-label={open ? 'Close Prestige assistant' : 'Open Prestige assistant'}
        onClick={() => setOpen((value) => !value)}
        sx={{
          position: 'fixed',
          right: { xs: 16, sm: 28 },
          bottom: { xs: 16, sm: 24 },
          zIndex: 1301,
          width: 58,
          height: 58,
          color: '#102C23',
          bgcolor: '#9BE6C9',
          border: '1px solid rgba(16,44,35,.14)',
          boxShadow: '0 14px 34px rgba(15,68,51,.3)',
          '&:hover': { bgcolor: '#B9F0DA', transform: 'translateY(-2px)' },
          transition: 'transform 180ms ease, background-color 180ms ease',
        }}
      >
        <IconifyIcon
          icon={open ? 'solar:close-circle-linear' : 'solar:chat-round-dots-bold'}
          width={27}
        />
      </Fab>
    </>
  );
};

export default ChatbotWidget;
