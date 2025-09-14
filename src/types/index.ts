export interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  sql?: string;
  viewMode?: 'table' | 'chart' | 'both' | 'sql';
  datasetKey?: string;
  feedback?: 'like' | 'dislike' | null;
  feedbackComment?: string;
  liked?: boolean;
  createdAt: string;
}

export interface Chat {
  id: string;
  title: string;
  messageIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatsState {
  byId: Record<string, Chat>;
  allIds: string[];
  currentChatId: string | null;
  showEmptyState: boolean;
}

export interface MessagesState {
  byId: Record<string, Message>;
  allIds: string[];
}

export interface UIState {
  exportBusyMessageIds: string[];
  themeMode: 'light' | 'dark';
  snackbar: {
    open: boolean;
    message: string;
  };
  isTyping: boolean;
  focusedSqlMessageId: string | null;
  sqlOnlyView: {
    isActive: boolean;
    messageId: string | null;
    userQuestion: string | null;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
  } | null;
  error: string | null;
}

export interface RootState {
  chats: ChatsState;
  messages: MessagesState;
  ui: UIState;
  auth: AuthState;
}
