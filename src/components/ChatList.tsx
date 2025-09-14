import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import {
  createChat,
  deleteChat,
  setCurrentChat,
  setShowEmptyState,
} from '../store/chatsSlice';
import { deleteMessagesForChat } from '../store/messagesSlice';
import { setSqlOnlyView } from '../store/uiSlice';
import { navigateToChatId, navigateToChat } from '../utils/navigation';

interface ChatListProps {
  onChatSelect?: () => void;
}

export default function ChatList({ onChatSelect }: ChatListProps) {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const dispatch = useAppDispatch();
  const { byId: chatsById, allIds: chatIds } = useAppSelector(
    (state) => state.chats
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  const handleNewChat = () => {
    // Disable SQL-only view when creating new chat
    dispatch(setSqlOnlyView({ isActive: false }));
    const newChatId = dispatch(createChat()).payload.id;
    dispatch(setCurrentChat(newChatId));
    navigateToChatId(navigate, newChatId);
    onChatSelect?.();
  };

  const handleChatSelect = (selectedChatId: string) => {
    // Disable SQL-only view when selecting different chat
    dispatch(setSqlOnlyView({ isActive: false }));
    dispatch(setCurrentChat(selectedChatId));
    dispatch(setShowEmptyState(false));
    navigateToChatId(navigate, selectedChatId);
    onChatSelect?.();
  };

  const handleDeleteClick = (
    chatIdToDelete: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setChatToDelete(chatIdToDelete);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (chatToDelete) {
      const isDeletingCurrentChat = chatId === chatToDelete;
      const chatToDeleteData = chatsById[chatToDelete];
      const remainingChats = chatIds.filter((id) => id !== chatToDelete);

      // Delete messages associated with this chat
      if (chatToDeleteData?.messageIds?.length > 0) {
        dispatch(deleteMessagesForChat(chatToDeleteData.messageIds));
      }

      // Delete the chat
      dispatch(deleteChat(chatToDelete));

      // Handle navigation after deletion
      if (isDeletingCurrentChat) {
        if (remainingChats.length > 0) {
          // Navigate to the most recent remaining chat
          const newestChat = remainingChats[0];
          dispatch(setCurrentChat(newestChat));
          navigateToChatId(navigate, newestChat);
        } else {
          // No more chats - show empty state
          dispatch(setShowEmptyState(true));
          navigateToChat(navigate);
        }
      } else if (remainingChats.length === 0) {
        // If we deleted the last chat (but it wasn't current), still show empty state
        dispatch(setShowEmptyState(true));
        navigateToChat(navigate);
      }
    }
    setDeleteDialogOpen(false);
    setChatToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setChatToDelete(null);
  };

  // Sort chats by updatedAt (most recent first)
  const sortedChatIds = [...chatIds].sort((a, b) => {
    const chatA = chatsById[a];
    const chatB = chatsById[b];
    return (
      new Date(chatB.updatedAt).getTime() - new Date(chatA.updatedAt).getTime()
    );
  });

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewChat}
          sx={{ mb: 1 }}
        >
          New Chat
        </Button>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {sortedChatIds.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <ChatIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No chats yet. Create your first chat to get started!
            </Typography>
          </Box>
        ) : (
          <List dense>
            {sortedChatIds.map((id) => {
              const chat = chatsById[id];
              const isSelected = chatId === id;

              return (
                <ListItem key={id} disablePadding>
                  <ListItemButton
                    selected={isSelected}
                    onClick={() => handleChatSelect(id)}
                    sx={{
                      px: 2,
                      py: 1,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary={chat.title}
                      primaryTypographyProps={{
                        noWrap: true,
                        fontSize: '0.9rem',
                      }}
                      sx={{ pr: 1 }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => handleDeleteClick(id, e)}
                      sx={{
                        color: isSelected ? 'inherit' : 'text.secondary',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Chat</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this chat? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
