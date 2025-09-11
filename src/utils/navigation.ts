// Navigation utilities that handle basename correctly for both dev and production
export const getBasePath = (): string => {
  // In development, no base path needed
  if (window.location.hostname === 'localhost') {
    return '';
  }
  
  // In production (GitHub Pages), use the repository name
  return '/KornitChat';
};

export const navigateToChat = (navigate: (path: string, options?: any) => void) => {
  const basePath = getBasePath();
  const chatPath = basePath ? `${basePath}/chat` : '/chat';
  navigate(chatPath, { replace: true });
};

export const navigateToChatId = (navigate: (path: string, options?: any) => void, chatId: string) => {
  const basePath = getBasePath();
  const chatPath = basePath ? `${basePath}/chat/${chatId}` : `/chat/${chatId}`;
  navigate(chatPath, { replace: true });
};
