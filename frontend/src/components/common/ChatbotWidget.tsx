import {
  Box,
  Button,
  Chip,
  Fab,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
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
const quickPrompts = [
  'How can I view my accounts?',
  'How do I check a transfer status?',
  'How can I keep my account secure?',
];
const cleanChatText = (text: string) => text.replace(/\*\*/g, '');
const customerLanguageInstruction =
  '\n\nAnswer for a banking customer in plain, reassuring language. Describe only actions they can take in the banking app. Do not mention developer or implementation details, including APIs, endpoints, request payloads, headers, or idempotency keys. If the available information cannot support a customer-friendly answer, direct them to bank support.';
const customerFriendlyQuestion = (question: string) =>
  `${question.slice(0, 2_000 - customerLanguageInstruction.length)}${customerLanguageInstruction}`;

const ChatbotWidget = () => {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
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

  const sendMessage = async (text: string) => {
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
        customerFriendlyQuestion(text),
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

  const submitMessage = (event: FormEvent) => {
    event.preventDefault();
    void sendMessage(draft.trim());
  };

  const startNewChat = () => {
    if (isStreaming) return;
    setMessages(starterMessages);
    setConversationId(null);
    setDraft('');
    setStreamError(null);
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
            top: { xs: 72, sm: 88 },
            bottom: { xs: 82, sm: 96 },
            zIndex: 1300,
            width: { xs: 'calc(100vw - 24px)', sm: 400 },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: 3,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: darkMode ? '0 24px 70px rgba(0,0,0,.52)' : '0 24px 70px rgba(6,35,27,.24)',
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
            sx={{ px: 2, py: 1.35, color: '#F2F8F4', bgcolor: '#102C23' }}
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
            <Stack direction="row" gap={0.25}>
              <Button
                size="small"
                startIcon={<IconifyIcon icon="solar:refresh-circle-linear" width={18} />}
                disabled={isStreaming}
                onClick={startNewChat}
                sx={{
                  minWidth: 0,
                  px: 0.75,
                  color: '#DDE9E3',
                  '&.Mui-disabled': { color: '#71877E' },
                }}
              >
                New chat
              </Button>
            </Stack>
          </Stack>
          <Stack
            gap={1.5}
            sx={{
              flex: 1,
              overflowY: 'auto',
              px: 2,
              py: 2.25,
              bgcolor: 'background.default',
            }}
          >
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
                  color: message.sender === 'user' ? '#F5FAF7' : 'text.primary',
                  bgcolor: message.sender === 'user' ? '#176D50' : 'background.paper',
                  border: message.sender === 'user' ? 0 : '1px solid',
                  borderColor: message.sender === 'user' ? 'transparent' : 'divider',
                  boxShadow:
                    message.sender === 'user'
                      ? 'none'
                      : darkMode
                        ? '0 5px 18px rgba(0,0,0,.22)'
                        : '0 5px 18px rgba(18,57,44,.06)',
                }}
              >
                <Typography variant="body2" sx={{ lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                  {cleanChatText(message.text) || '...'}
                </Typography>
                {message.sources && message.sources.length > 0 && (
                  <Stack direction="row" gap={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                    {message.sources.map((source) => (
                      <Chip
                        key={source}
                        label={source}
                        size="small"
                        clickable
                        disabled={isStreaming}
                        onClick={() => void sendMessage(`Tell me more about ${source}.`)}
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
                    clickable
                    disabled={isStreaming}
                    onClick={() => void sendMessage(prompt)}
                    sx={{
                      bgcolor: darkMode ? '#173D2F' : '#E2EEE8',
                      color: darkMode ? '#BDEFD8' : '#245A46',
                      border: '1px solid',
                      borderColor: darkMode ? 'rgba(155,230,201,.18)' : 'transparent',
                      fontWeight: 600,
                    }}
                  />
                ))}
              </Stack>
            )}
            <div ref={messagesEndRef} />
          </Stack>
          <Box
            component="form"
            onSubmit={submitMessage}
            sx={{
              p: 1.5,
              bgcolor: 'background.paper',
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <TextField
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type your message..."
              fullWidth
              size="small"
              inputProps={{ 'aria-label': 'Chat message', maxLength: 1_600 }}
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
                  color: 'text.primary',
                  bgcolor: darkMode ? '#0B1813' : '#F5F8F6',
                  '& fieldset': { borderColor: 'divider' },
                  '&:hover fieldset': { borderColor: 'primary.main' },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'text.secondary',
                  opacity: 1,
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
