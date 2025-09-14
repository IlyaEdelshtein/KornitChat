import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  Divider,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  QuestionAnswer as QuestionIcon,
  ContentCopy as CopyIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { setSqlOnlyView } from '../store/uiSlice';
import { navigateToChatId } from '../utils/navigation';
import dayjs from 'dayjs';

export default function QueryVerification() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const { byId: messagesById } = useAppSelector((state) => state.messages);
  const { byId: chatsById } = useAppSelector((state) => state.chats);

  const handleCopyQuery = async (sql: string) => {
    try {
      await navigator.clipboard.writeText(sql);
      // You could add a success notification here if needed
    } catch (err) {
      console.error('Failed to copy query:', err);
    }
  };

  const handleQuestionClick = (
    chatId: string,
    botMessageId: string,
    userQuestion: string
  ) => {
    // Always activate SQL-only view mode (even if already active)
    dispatch(
      setSqlOnlyView({
        isActive: true,
        messageId: botMessageId,
        userQuestion: userQuestion,
      })
    );
    // Navigate to the chat
    navigateToChatId(navigate, chatId);
  };

  // Check if we have any liked queries at all (before filtering)
  const allVerifiedQueries = React.useMemo(() => {
    // Get all chats and find liked bot messages with SQL
    const allChats = Object.values(chatsById);

    const pairs: Array<{ userMessage: any; botMessage: any; chatId: string }> =
      [];

    // For each chat, find user-bot message pairs where bot message is liked
    allChats.forEach((chat) => {
      const chatMessages = chat.messageIds
        .map((id) => messagesById[id])
        .filter(Boolean)
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

      for (let i = 0; i < chatMessages.length - 1; i++) {
        const userMessage = chatMessages[i];
        const botMessage = chatMessages[i + 1];
        if (
          userMessage.role === 'user' &&
          botMessage.role === 'bot' &&
          botMessage.sql &&
          botMessage.liked
        ) {
          pairs.push({
            userMessage,
            botMessage,
            chatId: chat.id,
          });
        }
      }
    });

    // Sort by creation date (newest first)
    return pairs.sort(
      (a, b) =>
        new Date(b.botMessage.createdAt).getTime() -
        new Date(a.botMessage.createdAt).getTime()
    );
  }, [messagesById, chatsById]);

  // Get filtered liked queries based on search
  const verifiedQueries = React.useMemo(() => {
    // Filter by search query (case insensitive)
    return searchQuery.trim() === ''
      ? allVerifiedQueries
      : allVerifiedQueries.filter((pair) =>
          pair.userMessage.text
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
  }, [allVerifiedQueries, searchQuery]);

  if (allVerifiedQueries.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <QuestionIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6" color="text.secondary">
            Verified Queries
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          No liked questions yet. Like responses using the 👍 button to add them
          here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, pb: 1, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <QuestionIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" color="primary.main">
            Verified Queries
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Liked questions from all your conversations
        </Typography>

        {/* Search field */}
        <TextField
          size="small"
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setSearchQuery('');
            }
          }}
          variant="outlined"
          fullWidth
          sx={{
            mt: 2,
            '& .MuiOutlinedInput-root': {
              fontSize: '0.875rem',
              borderRadius: 1,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchQuery('')}
                  sx={{ p: 0.5 }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Divider sx={{ flexShrink: 0 }} />

      {/* Scrollable content */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          px: 1,
          py: 1,
        }}
      >
        {verifiedQueries.length === 0 && searchQuery.trim() !== '' ? (
          // Show "no search results" message
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No questions found matching "{searchQuery}"
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: 'block' }}
            >
              Try a different search term
            </Typography>
          </Box>
        ) : (
          verifiedQueries.map((pair, index) => (
            <Box key={pair.userMessage.id} sx={{ mb: 1 }}>
              <Paper
                sx={{
                  width: '100%',
                  p: 1.5,
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(25, 118, 210, 0.08)'
                      : 'rgba(25, 118, 210, 0.04)',
                  border: `1px solid ${theme.palette.primary.light}`,
                  borderRadius: 1,
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(25, 118, 210, 0.12)'
                        : 'rgba(25, 118, 210, 0.08)',
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 2px 8px ${
                      theme.palette.mode === 'dark'
                        ? 'rgba(25, 118, 210, 0.2)'
                        : 'rgba(25, 118, 210, 0.15)'
                    }`,
                  },
                }}
                onClick={() =>
                  handleQuestionClick(
                    pair.chatId,
                    pair.botMessage.id,
                    pair.userMessage.text
                  )
                }
              >
                <Box
                  sx={{
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      Question #{verifiedQueries.length - index}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        ml: 1,
                      }}
                    >
                      {dayjs(pair.userMessage.createdAt).format('HH:mm')}
                    </Typography>
                  </Box>
                  <Tooltip title="Copy SQL query">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyQuery(pair.botMessage.sql!);
                      }}
                      sx={{
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor:
                            theme.palette.mode === 'dark'
                              ? 'rgba(25, 118, 210, 0.15)'
                              : 'rgba(25, 118, 210, 0.1)',
                        },
                      }}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color:
                      theme.palette.mode === 'dark' ? '#e0f2fe' : '#1e293b',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: 1.4,
                    maxHeight: '60px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {pair.userMessage.text}
                </Typography>
              </Paper>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
