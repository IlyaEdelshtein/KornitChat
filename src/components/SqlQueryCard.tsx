
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  useTheme,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  DataObject as SqlIcon,
  ContentCopy as CopyIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Message } from '../types';
import dayjs from 'dayjs';

interface SqlQueryCardProps {
  message: Message;
  userQuestion: string;
  onClose: () => void;
}

export default function SqlQueryCard({ message, userQuestion, onClose }: SqlQueryCardProps) {
  const theme = useTheme();

  const handleCopyQuery = async (sql: string) => {
    try {
      await navigator.clipboard.writeText(sql);
      // You could add a success notification here if needed
    } catch (err) {
      console.error('Failed to copy query:', err);
    }
  };

  if (!message.sql) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Card
        sx={{
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
              : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          border: `2px solid ${theme.palette.primary.main}`,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 4px 20px rgba(59, 130, 246, 0.4)'
              : '0 4px 20px rgba(59, 130, 246, 0.3)',
        }}
      >
        <CardContent>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SqlIcon
                sx={{
                  color: theme.palette.primary.main,
                  mr: 1,
                  fontSize: '1.2rem',
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Generated SQL Query
              </Typography>
            </Box>
            <Tooltip title="Close SQL view">
              <IconButton
                size="small"
                onClick={onClose}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* User Question */}
          <Paper
            sx={{
              p: 2,
              mb: 3,
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? 'rgba(59, 130, 246, 0.1)'
                  : 'rgba(59, 130, 246, 0.05)',
              border: `1px solid ${theme.palette.primary.light}`,
              borderRadius: 2,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: 'primary.main',
                fontWeight: 600,
                mb: 1,
              }}
            >
              Original Question:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.mode === 'dark' ? '#e0f2fe' : '#1e293b',
                fontStyle: 'italic',
              }}
            >
              "{userQuestion}"
            </Typography>
          </Paper>

          {/* SQL Query */}
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                }}
              >
                SQL Query
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  {dayjs(message.createdAt).format('MMM DD, HH:mm')}
                </Typography>
                <Tooltip title="Copy SQL query">
                  <IconButton
                    size="small"
                    onClick={() => handleCopyQuery(message.sql!)}
                    sx={{
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? 'rgba(59, 130, 246, 0.15)'
                            : 'rgba(59, 130, 246, 0.1)',
                      },
                    }}
                  >
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            <Paper
              sx={{
                p: 3,
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(0, 0, 0, 0.6)'
                    : 'rgba(255, 255, 255, 0.9)',
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: 2,
                fontFamily: 'monospace',
                fontSize: '0.95rem',
                overflowX: 'auto',
                backdropFilter: 'blur(10px)',
                boxShadow: `inset 0 2px 8px ${
                  theme.palette.mode === 'dark'
                    ? 'rgba(0, 0, 0, 0.3)'
                    : 'rgba(0, 0, 0, 0.1)'
                }`,
              }}
            >
              <Typography
                variant="body2"
                component="pre"
                sx={{
                  margin: 0,
                  color: theme.palette.mode === 'dark' ? '#e0f2fe' : '#1e293b',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {message.sql}
              </Typography>
            </Paper>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}