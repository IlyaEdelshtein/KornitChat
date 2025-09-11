export interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  sql?: string;
  viewMode?: 'table' | 'chart' | 'both';
  datasetKey?: string;
  feedback?: 'like' | 'dislike' | null;
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
