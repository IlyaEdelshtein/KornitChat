import { Box, Typography, Paper, Button } from '@mui/material';
import { Chat as ChatIcon, Add as AddIcon } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store';
import { createChat, setCurrentChat } from '../store/chatsSlice';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  showCreateButton?: boolean;
}

export default function EmptyState({
  showCreateButton = false,
}: EmptyStateProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const chatsCount = useAppSelector((state) => state.chats.allIds.length);

  const handleCreateChat = () => {
    const action = dispatch(createChat());
    const newChatId = action.payload.id;
    dispatch(setCurrentChat(newChatId));
    navigate(`/chat/${newChatId}`);
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
          {isFirstTime ? 'Welcome to AI Chat' : 'Start a Conversation'}
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
                sx={{ mt: 2 }}
              >
                Create Your First Chat
              </Button>
            )}
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Try asking: "Show me revenue by country" or "What are our
            top-selling products?"
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
