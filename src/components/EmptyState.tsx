import { Box, Typography, Paper, Button, TextField, IconButton } from '@mui/material';
import { Chat as ChatIcon, Add as AddIcon, Send as SendIcon } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store';
import { createChat, setCurrentChat } from '../store/chatsSlice';
import { addUserMessage, addBotMessage } from '../store/messagesSlice';
import { addMessageToChat, setChatTitle } from '../store/chatsSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { generateMockSql, inferTitleFromFirstMessage } from '../utils/mockHelpers';

interface EmptyStateProps {
  showCreateButton?: boolean;
}

export default function EmptyState({
  showCreateButton = false,
}: EmptyStateProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { allIds, showEmptyState } = useAppSelector((state) => state.chats);
  const chatsCount = allIds.length;
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateChat = () => {
    const action = dispatch(createChat());
    const newChatId = action.payload.id;
    dispatch(setCurrentChat(newChatId));
    navigate(`/chat/${newChatId}`);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    // Create new chat first
    const newChatAction = dispatch(createChat());
    const newChatId = newChatAction.payload.id;

    // Add user message
    const userMessageAction = dispatch(
      addUserMessage({
        chatId: newChatId,
        text: userMessage,
      })
    );

    // Add message to chat
    dispatch(
      addMessageToChat({
        chatId: newChatId,
        messageId: userMessageAction.payload.id,
      })
    );

    // Set chat title
    const title = inferTitleFromFirstMessage(userMessage);
    dispatch(setChatTitle({ chatId: newChatId, title }));

    // Navigate to new chat
    dispatch(setCurrentChat(newChatId));
    navigate(`/chat/${newChatId}`);

    // Generate bot response
    const delay = Math.random() * 500 + 700;
    setTimeout(() => {
      const sql = generateMockSql(userMessage);
      const botMessageAction = dispatch(
        addBotMessage({
          chatId: newChatId,
          text: `I understood your question as "${userMessage}"\nAfter analyzing the information, I made the following query:`,
          sql,
          datasetKey: 'printing2024',
        })
      );

      dispatch(
        addMessageToChat({
          chatId: newChatId,
          messageId: botMessageAction.payload.id,
        })
      );

      setIsLoading(false);
    }, delay);
  };

  const isFirstTime = chatsCount === 0;
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          backgroundColor: 'transparent',
          maxWidth: 400,
        }}
      >
        <ChatIcon
          sx={{
            fontSize: 64,
            color: 'primary.main',
            mb: 2,
          }}
        />
        <Typography variant="h5" gutterBottom color="text.primary">
          {isFirstTime ? 'Welcome to Kornit Chat' : 'Start a Conversation'}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {isFirstTime
            ? 'Create your first chat to start analyzing your t-shirt printing data. I can help you with sales reports, revenue analysis, and product insights.'
            : 'Ask me anything about your t-shirt printing data. I can help you analyze sales, revenue, product performance, and more.'}
        </Typography>
        {isFirstTime ? (
          <>
            <Typography variant="body2" color="text.secondary" paragraph>
              Click "New Chat" in the sidebar to get started!
            </Typography>
            {showCreateButton && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateChat}
                sx={{ mt: 2, mb: 2 }}
              >
                Create Your First Chat
              </Button>
            )}
          </>
        ) : (
          <Typography variant="body2" color="text.secondary" paragraph>
            Try asking: "Show me revenue by country" or "What are our
            top-selling products?"
          </Typography>
        )}

        {/* Quick start message input */}
        <Box
          component="form"
          onSubmit={handleSendMessage}
          sx={{
            display: 'flex',
            gap: 1,
            mt: 3,
            p: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            backgroundColor: 'background.paper',
          }}
        >
          <TextField
            fullWidth
            placeholder="Ask me about your t-shirt printing data..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={!message.trim() || isLoading}
            sx={{ alignSelf: 'center' }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}
