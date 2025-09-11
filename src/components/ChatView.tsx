import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { setShowEmptyState } from '../store/chatsSlice';
import { navigateToChat } from '../utils/navigation';
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
        navigateToChat(navigate);
      }
      return;
    }

    // If chatId exists and chat is found, hide empty state to show the chat
    if (chatId && chatsById[chatId]) {
      dispatch(setShowEmptyState(false));
      return;
    }

    // If chatId exists but chat is not found, redirect to main page
    if (chatId && !chatsById[chatId]) {
      dispatch(setShowEmptyState(true));
      navigateToChat(navigate);
      return;
    }

    // No specific chat in URL - stay on current state
  }, [chatId, chatsById, dispatch, navigate]);

  // Show empty state if no chats exist OR if showEmptyState is true AND no specific chat is selected
  if (Object.keys(chatsById).length === 0 || (showEmptyState && !chatId)) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          <EmptyState showCreateButton={true} />
        </Box>
        <Composer chatId={null} disabled={false} />
      </Box>
    );
  }

  // If we have a chatId but no valid chat, show empty state
  if (chatId && !currentChat) {
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
