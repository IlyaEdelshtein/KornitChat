import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { setCurrentChat } from '../store/chatsSlice';
import MessageCard from './MessageCard';
import Composer from './Composer';
import EmptyState from './EmptyState';

export default function ChatView() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { byId: chatsById, currentChatId } = useAppSelector(
    (state) => state.chats
  );
  const { byId: messagesById } = useAppSelector((state) => state.messages);

  const currentChat = chatId ? chatsById[chatId] : null;
  const messages =
    currentChat?.messageIds.map((id) => messagesById[id]).filter(Boolean) || [];

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Handle chat navigation
  useEffect(() => {
    if (!chatId) {
      // No specific chat in URL
      // After login, currentChatId is null, so we should show empty state
      // Don't automatically navigate to existing chats
      return;
    }

    if (!currentChat) {
      // Chat doesn't exist, but we have a chatId in URL
      // This might happen if the chat was just deleted
      // Let's check if there are any chats available
      const availableChatIds = Object.keys(chatsById);
      if (availableChatIds.length > 0) {
        // Navigate to the first available chat
        const firstAvailableChat = availableChatIds[0];
        dispatch(setCurrentChat(firstAvailableChat));
        navigate(`/chat/${firstAvailableChat}`, { replace: true });
      } else {
        // No chats available, navigate to base chat route
        navigate('/chat', { replace: true });
      }
      return;
    }

    // Set current chat if it's different
    if (currentChatId !== chatId) {
      dispatch(setCurrentChat(chatId));
    }
  }, [chatId, currentChat, currentChatId, chatsById, dispatch, navigate]);

  // If no chats exist at all, show empty state without composer
  if (Object.keys(chatsById).length === 0) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <EmptyState showCreateButton={true} />
        </Box>
      </Box>
    );
  }

  if (!currentChat) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {messages.length === 0 ? (
          <EmptyState showCreateButton={false} />
        ) : (
          <>
            {messages.map((message) => (
              <MessageCard key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>
      <Composer chatId={currentChat.id} disabled={false} />
    </Box>
  );
}
