import React from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  DataObject as SqlIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../store';
import dayjs from 'dayjs';

export default function QueryVerification() {
  const theme = useTheme();
  const { byId: messagesById } = useAppSelector((state) => state.messages);
  const { currentChatId, byId: chatsById } = useAppSelector(
    (state) => state.chats
  );

  const handleCopyQuery = async (sql: string) => {
    try {
      await navigator.clipboard.writeText(sql);
      // You could add a success notification here if needed
    } catch (err) {
      console.error('Failed to copy query:', err);
    }
  };

  // Get all bot messages with SQL queries from the current chat
  const sqlQueries = React.useMemo(() => {
    if (!currentChatId) return [];

    const currentChat = chatsById[currentChatId];

    if (!currentChat) return [];

    // Get messages only from the current chat
    const currentChatMessages = currentChat.messageIds
      .map((id) => messagesById[id])
      .filter(Boolean)
      .filter((message) => message.role === 'bot' && message.sql)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return currentChatMessages;
  }, [messagesById, currentChatId, chatsById]);

  if (sqlQueries.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SqlIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6" color="text.secondary">
            Verified Query
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center' }}
        >
          No SQL queries yet. Start a conversation to see query history.
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
          <SqlIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" color="primary.main">
            Verified Query
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          SQL queries from chat responses
        </Typography>
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
        {sqlQueries.map((message, index) => (
          <Box key={message.id} sx={{ mb: 1 }}>
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
                    Query #{sqlQueries.length - index}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      ml: 1,
                    }}
                  >
                    {dayjs(message.createdAt).format('HH:mm')}
                  </Typography>
                </Box>
                <Tooltip title="Copy query">
                  <IconButton
                    size="small"
                    onClick={() => handleCopyQuery(message.sql!)}
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
                component="pre"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                  color: theme.palette.mode === 'dark' ? '#e0f2fe' : '#1e293b',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  lineHeight: 1.4,
                  maxHeight: '100px',
                  overflow: 'hidden',
                }}
              >
                {message.sql}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
