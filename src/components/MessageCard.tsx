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
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
  FileDownload,
  TableChart,
  BarChart,
  ViewList,
  ShowChart,
  SmartToy,
  Send,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store';
import {
  setMessageViewMode,
  setMessageFeedback,
  setMessageFeedbackComment,
  setMessageLike,
} from '../store/messagesSlice';
import {
  setExportBusy,
  openSnackbar,
  setFocusedSqlMessageId,
} from '../store/uiSlice';
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
  const { exportBusyMessageIds, focusedSqlMessageId } = useAppSelector(
    (state) => state.ui
  );
  const [exportMenuAnchor, setExportMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [xAxis, setXAxis] = useState<string>('date');
  const [yAxis, setYAxis] = useState<string>('revenue');
  const [feedbackComment, setFeedbackComment] = useState(
    message.feedbackComment || ''
  );

  const isExportBusy = exportBusyMessageIds.includes(message.id);
  const isFocusedForSql = focusedSqlMessageId === message.id;

  // Clear the focused SQL message ID after showing once
  React.useEffect(() => {
    if (isFocusedForSql && message.sql) {
      // Clear the focus after a short delay to allow the component to render
      const timer = setTimeout(() => {
        dispatch(setFocusedSqlMessageId(null));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isFocusedForSql, message.sql, dispatch]);

  const handleViewModeChange = (viewMode: 'table' | 'chart' | 'both') => {
    dispatch(setMessageViewMode({ messageId: message.id, viewMode }));
  };

  const handleFeedback = (feedback: 'like' | 'dislike') => {
    const newFeedback = message.feedback === feedback ? null : feedback;
    dispatch(
      setMessageFeedback({ messageId: message.id, feedback: newFeedback })
    );
    
    // Handle liked state for Verified Queries
    if (feedback === 'like') {
      // Toggle liked state when thumbs up is pressed
      const newLikedState = newFeedback === 'like';
      dispatch(setMessageLike({ messageId: message.id, liked: newLikedState }));
    } else if (feedback === 'dislike' && message.liked) {
      // Remove like when thumbs down is pressed (only if currently liked)
      dispatch(setMessageLike({ messageId: message.id, liked: false }));
    }
  };

  const handleFeedbackCommentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newComment = event.target.value;
    setFeedbackComment(newComment);
    dispatch(
      setMessageFeedbackComment({
        messageId: message.id,
        feedbackComment: newComment,
      })
    );
  };

  const handleSubmitFeedback = () => {
    // For now, just clear the input - later we'll add server logic
    setFeedbackComment('');
    dispatch(
      setMessageFeedbackComment({ messageId: message.id, feedbackComment: '' })
    );
  };

  const handleExportMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setExportMenuAnchor(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportMenuAnchor(null);
  };

  const handleChartTypeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newChartType: 'line' | 'bar'
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  const handleXAxisChange = (event: SelectChangeEvent<string>) => {
    setXAxis(event.target.value);
  };

  const handleYAxisChange = (event: SelectChangeEvent<string>) => {
    setYAxis(event.target.value);
  };

  // Available columns for axis selection
  const availableColumns = [
    { value: 'date', label: 'Date' },
    { value: 'product', label: 'Product' },
    { value: 'units', label: 'Units' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'country', label: 'Country' },
    { value: 'channel', label: 'Channel' },
  ];

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
      <Card
        sx={{
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
              : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
          border: `2px solid ${theme.palette.primary.main}`,
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 4px 20px rgba(59, 130, 246, 0.3)'
              : '0 4px 20px rgba(59, 130, 246, 0.2)',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <SmartToy
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
              Kornit AI Assistant
            </Typography>
          </Box>

          {/* Show only SQL title when focused */}
          {isFocusedForSql ? (
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: 'primary.main',
                fontWeight: 600,
              }}
            >
              SQL Query
            </Typography>
          ) : (
            <Typography
              variant="body1"
              sx={{
                mb: 2,
                color: theme.palette.mode === 'dark' ? '#e0f2fe' : '#0f172a',
                fontWeight: 500,
              }}
            >
              {message.text}
            </Typography>
          )}

          {message.sql && (
            <Paper
              sx={{
                p: 2,
                mb: 2,
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(0, 0, 0, 0.4)'
                    : 'rgba(255, 255, 255, 0.8)',
                border: `1px solid ${
                  isFocusedForSql
                    ? theme.palette.primary.main
                    : theme.palette.primary.light
                }`,
                borderRadius: 2,
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                overflowX: 'auto',
                backdropFilter: 'blur(5px)',
                boxShadow: isFocusedForSql
                  ? `0 0 0 2px ${theme.palette.primary.main}30`
                  : 'none',
              }}
            >
              <Typography
                variant="body2"
                component="pre"
                sx={{
                  margin: 0,
                  color: theme.palette.mode === 'dark' ? '#e0f2fe' : '#1e293b',
                }}
              >
                {message.sql}
              </Typography>
            </Paper>
          )}

          {/* Hide everything below when focused on SQL */}
          {!isFocusedForSql && (
            <>
              {/* View mode toggle */}
              <Box
                sx={{
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
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
                    variant={
                      message.viewMode === 'both' ? 'contained' : 'outlined'
                    }
                    onClick={() => handleViewModeChange('both')}
                  >
                    Both
                  </Button>
                </ButtonGroup>

                {/* Chart type toggle - only show when chart is visible */}
                {(message.viewMode === 'chart' ||
                  message.viewMode === 'both') && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Chart:
                    </Typography>
                    <ToggleButtonGroup
                      value={chartType}
                      exclusive
                      onChange={handleChartTypeChange}
                      size="small"
                    >
                      <ToggleButton value="line" aria-label="line chart">
                        <ShowChart />
                      </ToggleButton>
                      <ToggleButton value="bar" aria-label="bar chart">
                        <BarChart />
                      </ToggleButton>
                    </ToggleButtonGroup>

                    {/* X-Axis selector */}
                    <FormControl size="small" sx={{ minWidth: 80 }}>
                      <InputLabel id="x-axis-select-label">X-Axis</InputLabel>
                      <Select
                        labelId="x-axis-select-label"
                        value={xAxis}
                        onChange={handleXAxisChange}
                        label="X-Axis"
                        sx={{ fontSize: '0.875rem' }}
                      >
                        {availableColumns.map((column) => (
                          <MenuItem key={column.value} value={column.value}>
                            {column.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Y-Axis selector */}
                    <FormControl size="small" sx={{ minWidth: 80 }}>
                      <InputLabel id="y-axis-select-label">Y-Axis</InputLabel>
                      <Select
                        labelId="y-axis-select-label"
                        value={yAxis}
                        onChange={handleYAxisChange}
                        label="Y-Axis"
                        sx={{ fontSize: '0.875rem' }}
                      >
                        {availableColumns.map((column) => (
                          <MenuItem key={column.value} value={column.value}>
                            {column.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}
              </Box>

              {/* Result display */}
              {(message.viewMode === 'table' ||
                message.viewMode === 'both') && (
                <Paper
                  sx={{
                    mb: message.viewMode === 'both' ? 2 : 0,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    overflow: 'hidden',
                    boxShadow: `0 2px 8px ${
                      theme.palette.mode === 'dark'
                        ? 'rgba(0, 0, 0, 0.3)'
                        : 'rgba(0, 0, 0, 0.1)'
                    }`,
                  }}
                >
                  <ResultTable data={mockResult.rows} />
                </Paper>
              )}

              {(message.viewMode === 'chart' ||
                message.viewMode === 'both') && (
                <Paper
                  sx={{
                    p: 3,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: `0 2px 8px ${
                      theme.palette.mode === 'dark'
                        ? 'rgba(0, 0, 0, 0.3)'
                        : 'rgba(0, 0, 0, 0.1)'
                    }`,
                  }}
                >
                  <ResultChart data={mockResult.rows} chartType={chartType} />
                </Paper>
              )}

              {/* Actions */}
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  flexWrap: 'wrap',
                }}
              >
                <Tooltip title="Like response & add to Verified Queries">
                  <IconButton
                    size="small"
                    onClick={() => handleFeedback('like')}
                    color={message.feedback === 'like' ? 'primary' : 'default'}
                  >
                    <ThumbUp fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Was this response not helpful?">
                  <IconButton
                    size="small"
                    onClick={() => handleFeedback('dislike')}
                    color={message.feedback === 'dislike' ? 'error' : 'default'}
                  >
                    <ThumbDown fontSize="small" />
                  </IconButton>
                </Tooltip>

                <TextField
                  size="small"
                  placeholder="Rate response quality..."
                  value={feedbackComment}
                  onChange={handleFeedbackCommentChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={handleSubmitFeedback}
                          disabled={!feedbackComment.trim()}
                          sx={{
                            color: feedbackComment.trim()
                              ? 'primary.main'
                              : 'action.disabled',
                          }}
                        >
                          <Send fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    minWidth: 200,
                    maxWidth: 300,
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.875rem',
                      borderRadius: 1,
                    },
                  }}
                />

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
            </>
          )}
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
