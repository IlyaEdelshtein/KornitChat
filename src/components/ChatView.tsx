import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { setShowEmptyState } from '../store/chatsSlice';
import MessageCard from './MessageCard';
import Composer from './Composer';
import EmptyState from './EmptyState';

export default function ChatView() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { byId: chatsById, showEmptyState } = useAppSelector(
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

    // If user navigated directly to a chat URL (e.g., after refresh), always show EmptyState
    if (chatId) {
      dispatch(setShowEmptyState(true));
      navigate('/chat', { replace: true });
      return;
    }

    // No specific chat in URL - stay on EmptyState if showEmptyState is true
    if (!chatId) {
      return;
    }
  }, [chatId, chatsById, dispatch, navigate]);

  // Show empty state if no chats exist OR if showEmptyState is true OR if no chatId (main page)
  if (Object.keys(chatsById).length === 0 || showEmptyState || !chatId) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <EmptyState showCreateButton={true} />
        </Box>
        <Composer chatId={null} disabled={false} />
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
      <Composer chatId={currentChat?.id || null} disabled={false} />
    </Box>
  );
}
