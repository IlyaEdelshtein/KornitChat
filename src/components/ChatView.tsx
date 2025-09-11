import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { setCurrentChat, setShowEmptyState } from '../store/chatsSlice';
import MessageCard from './MessageCard';
import Composer from './Composer';
import EmptyState from './EmptyState';

export default function ChatView() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { byId: chatsById, currentChatId, showEmptyState } = useAppSelector(
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
    // If no chats exist at all, show empty state
    if (Object.keys(chatsById).length === 0) {
      dispatch(setShowEmptyState(true));
      if (chatId) {
        navigate('/chat', { replace: true });
      }
      return;
    }

    if (!chatId) {
      // No specific chat in URL - stay on EmptyState if showEmptyState is true
      return;
    }

    // If showEmptyState is true, navigate back to base route
    if (showEmptyState) {
      navigate('/chat', { replace: true });
      return;
    }

    // If chat doesn't exist (e.g., invalid ID from URL), redirect to EmptyState
    if (!currentChat) {
      dispatch(setShowEmptyState(true));
      navigate('/chat', { replace: true });
      return;
    }

    // Set current chat if it's different
    if (currentChatId !== chatId) {
      dispatch(setCurrentChat(chatId));
    }
  }, [chatId, currentChat, currentChatId, chatsById, dispatch, navigate, showEmptyState]);

  // Show empty state if no chats exist OR if showEmptyState is true
  if (Object.keys(chatsById).length === 0 || showEmptyState) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <EmptyState showCreateButton={true} />
        </Box>
        <Composer chatId={null} disabled={false} />
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
