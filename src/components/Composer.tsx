import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store';
import { addUserMessage, addBotMessage } from '../store/messagesSlice';
import {
  setChatTitle,
  touchChatUpdated,
  addMessageToChat,
  createChat,
  setCurrentChat,
  setShowEmptyState,
} from '../store/chatsSlice';
import { useNavigate } from 'react-router-dom';
import {
  generateMockSql,
  inferTitleFromFirstMessage,
} from '../utils/mockHelpers';

interface ComposerProps {
  chatId: string | null;
  disabled: boolean;
}

export default function Composer({ chatId, disabled }: ComposerProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textFieldRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Always call useAppSelector - don't conditionally call hooks
  const chatsById = useAppSelector((state) => state.chats.byId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isLoading || disabled) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    // Determine the actual chatId to use
    let actualChatId = chatId;

    // Check if this will be the first message (before adding anything)
    let isFirstMessage = false;
    
    // If no chatId provided, create a new chat
    if (!actualChatId) {
      const newChatAction = dispatch(createChat());
      actualChatId = newChatAction.payload.id;
      dispatch(setCurrentChat(actualChatId));
      dispatch(setShowEmptyState(false)); // Hide empty state when creating a new chat
      navigate(`/chat/${actualChatId}`);
      isFirstMessage = true;
    } else {
      // Check if existing chat has no messages
      const existingChat = chatsById[actualChatId];
      isFirstMessage = existingChat ? existingChat.messageIds.length === 0 : false;
    }

    // Add user message
    const userMessageAction = dispatch(
      addUserMessage({
        chatId: actualChatId,
        text: userMessage,
      })
    );

    // Add message to chat
    dispatch(
      addMessageToChat({
        chatId: actualChatId,
        messageId: userMessageAction.payload.id,
      })
    );

    // Update chat title only if this is the first message in the chat
    if (isFirstMessage) {
      const title = inferTitleFromFirstMessage(userMessage);
      dispatch(setChatTitle({ chatId: actualChatId, title }));
    }

    // Simulate AI processing delay
    const delay = Math.random() * 500 + 700; // 700-1200ms

    setTimeout(() => {
      // Generate mock response
      const sql = generateMockSql(userMessage);

      // Add bot message
      const botMessageAction = dispatch(
        addBotMessage({
          chatId: actualChatId,
          text: `I understood your question as "${userMessage}"\nAfter analyzing the information, I made the following query:`,
          sql,
          datasetKey: 'printing2024',
        })
      );

      // Add message to chat
      dispatch(
        addMessageToChat({
          chatId: actualChatId,
          messageId: botMessageAction.payload.id,
        })
      );

      dispatch(touchChatUpdated(actualChatId));
      setIsLoading(false);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  // Auto-resize textarea
  useEffect(() => {
    const textField = textFieldRef.current;
    if (textField) {
      textField.style.height = 'auto';
      textField.style.height = Math.min(textField.scrollHeight, 120) + 'px';
    }
  }, [message]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        m: 2,
        borderRadius: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', gap: 1 }}
      >
        <TextField
          inputRef={textFieldRef}
          fullWidth
          multiline
          maxRows={5}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask me about your t-shirt printing data..."
          disabled={disabled || isLoading}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />
        <IconButton
          type="submit"
          color="primary"
          disabled={!message.trim() || disabled || isLoading}
          size="large"
          sx={{ alignSelf: 'flex-end' }}
        >
          {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Box>
    </Paper>
  );
}
