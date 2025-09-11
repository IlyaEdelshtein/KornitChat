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
} from '../store/chatsSlice';
import {
  generateMockSql,
  inferTitleFromFirstMessage,
} from '../utils/mockHelpers';

interface ComposerProps {
  chatId: string;
  disabled: boolean;
}

export default function Composer({ chatId, disabled }: ComposerProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textFieldRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useAppDispatch();
  const currentChat = useAppSelector((state) => state.chats.byId[chatId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isLoading || disabled) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    // Add user message
    const userMessageAction = dispatch(
      addUserMessage({
        chatId,
        text: userMessage,
      })
    );

    // Add message to chat
    dispatch(
      addMessageToChat({
        chatId,
        messageId: userMessageAction.payload.id,
      })
    );

    // Update chat title only if this is the first message in the chat
    if (currentChat && currentChat.messageIds.length === 1) {
      const title = inferTitleFromFirstMessage(userMessage);
      dispatch(setChatTitle({ chatId, title }));
    }

    // Simulate AI processing delay
    const delay = Math.random() * 500 + 700; // 700-1200ms

    setTimeout(() => {
      // Generate mock response
      const sql = generateMockSql(userMessage);

      // Add bot message
      const botMessageAction = dispatch(
        addBotMessage({
          chatId,
          text: `I understood your question as "${userMessage}"\nAfter analyzing the information, I made the following query:`,
          sql,
          datasetKey: 'printing2024',
        })
      );

      // Add message to chat
      dispatch(
        addMessageToChat({
          chatId,
          messageId: botMessageAction.payload.id,
        })
      );

      dispatch(touchChatUpdated(chatId));
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
