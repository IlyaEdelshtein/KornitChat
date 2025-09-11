// Navigation utilities that handle basename correctly for both dev and production
// Since we now use empty basename in Router and let Vite handle base path,
// we should use relative paths for navigation

export const navigateToChat = (navigate: (path: string, options?: any) => void) => {
  navigate('/chat', { replace: true });
};

export const navigateToChatId = (navigate: (path: string, options?: any) => void, chatId: string) => {
  navigate(`/chat/${chatId}`, { replace: true });
};
