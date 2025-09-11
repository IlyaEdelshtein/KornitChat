import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  Chip,
  Paper,
  useTheme,
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
  FileDownload,
  TableChart,
  BarChart,
  ViewList,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store';
import { setMessageViewMode, setMessageFeedback } from '../store/messagesSlice';
import { setExportBusy, openSnackbar } from '../store/uiSlice';
import { Message } from '../types';
import { getMockResult } from '../utils/mockHelpers';
import { downloadCsv, downloadXlsx } from '../utils/exportUtils';
import ResultTable from './ResultTable';
import ResultChart from './ResultChart';

interface MessageCardProps {
  message: Message;
}

export default function MessageCard({ message }: MessageCardProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { exportBusyMessageIds } = useAppSelector((state) => state.ui);
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(
    null
  );

  const isExportBusy = exportBusyMessageIds.includes(message.id);

  const handleViewModeChange = (viewMode: 'table' | 'chart' | 'both') => {
    dispatch(setMessageViewMode({ messageId: message.id, viewMode }));
  };

  const handleFeedback = (feedback: 'like' | 'dislike') => {
    const newFeedback = message.feedback === feedback ? null : feedback;
    dispatch(
      setMessageFeedback({ messageId: message.id, feedback: newFeedback })
    );
  };

  const handleExportMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  const handleExport = async (format: 'csv' | 'xlsx') => {
    if (!message.datasetKey || isExportBusy) return;

    handleExportMenuClose();

    // Set busy state
    dispatch(setExportBusy({ messageId: message.id, busy: true }));
    dispatch(openSnackbar('Download started...'));

    try {
      // Get the data for this message
      const result = getMockResult(''); // We'd need to store the original query
      const filename = `chat-export-${new Date().getTime()}`;

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (format === 'csv') {
        downloadCsv(result.rows, `${filename}.csv`);
      } else {
        downloadXlsx(result.rows, 'Data', `${filename}.xlsx`);
      }

      // Show completion message after additional delay
      setTimeout(() => {
        dispatch(openSnackbar('Download completed!'));
      }, 3000);
    } catch (error) {
      dispatch(openSnackbar('Download failed. Please try again.'));
    } finally {
      // Re-enable export after total 5 seconds
      setTimeout(() => {
        dispatch(setExportBusy({ messageId: message.id, busy: false }));
      }, 5000);
    }
  };

  if (message.role === 'user') {
    return (
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Card
          sx={{
            maxWidth: '70%',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="body1">{message.text}</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Bot message
  const mockResult = getMockResult(''); // We'd pass the original query here

  return (
    <Box sx={{ mb: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {message.text}
          </Typography>

          {message.sql && (
            <Paper
              sx={{
                p: 2,
                mb: 2,
                backgroundColor:
                  theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                overflowX: 'auto',
              }}
            >
              <Typography variant="body2" component="pre" sx={{ margin: 0 }}>
                {message.sql}
              </Typography>
            </Paper>
          )}

          {/* View mode toggle */}
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              View:
            </Typography>
            <ButtonGroup size="small" variant="outlined">
              <Button
                startIcon={<TableChart />}
                variant={
                  message.viewMode === 'table' ? 'contained' : 'outlined'
                }
                onClick={() => handleViewModeChange('table')}
              >
                Table
              </Button>
              <Button
                startIcon={<BarChart />}
                variant={
                  message.viewMode === 'chart' ? 'contained' : 'outlined'
                }
                onClick={() => handleViewModeChange('chart')}
              >
                Chart
              </Button>
              <Button
                startIcon={<ViewList />}
                variant={message.viewMode === 'both' ? 'contained' : 'outlined'}
                onClick={() => handleViewModeChange('both')}
              >
                Both
              </Button>
            </ButtonGroup>
          </Box>

          {/* Result display */}
          {(message.viewMode === 'table' || message.viewMode === 'both') && (
            <Box sx={{ mb: message.viewMode === 'both' ? 2 : 0 }}>
              <ResultTable data={mockResult.rows} />
            </Box>
          )}

          {(message.viewMode === 'chart' || message.viewMode === 'both') && (
            <Box>
              <ResultChart data={mockResult.rows} />
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => handleFeedback('like')}
              color={message.feedback === 'like' ? 'primary' : 'default'}
            >
              <ThumbUp fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleFeedback('dislike')}
              color={message.feedback === 'dislike' ? 'error' : 'default'}
            >
              <ThumbDown fontSize="small" />
            </IconButton>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              size="small"
              startIcon={<FileDownload />}
              onClick={handleExportMenuOpen}
              disabled={isExportBusy}
            >
              Export
            </Button>

            {isExportBusy && (
              <Chip
                label="Processing..."
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Export menu */}
      <Menu
        anchorEl={exportMenuAnchor}
        open={Boolean(exportMenuAnchor)}
        onClose={handleExportMenuClose}
      >
        <MenuItem onClick={() => handleExport('csv')}>Download CSV</MenuItem>
        <MenuItem onClick={() => handleExport('xlsx')}>Download Excel</MenuItem>
      </Menu>
    </Box>
  );
}
