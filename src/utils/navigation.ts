// Navigation utilities that handle GitHub Pages vs localhost correctly
const isGitHubPages = (): boolean => {
  return window.location.hostname === 'ilyaedelshtein.github.io';
};

// For React Router basename
export const getBaseName = (): string => {
  if (isGitHubPages()) {
    return '/KornitChat';
  }
  return '';
};

// For navigation within the app - always use relative paths
// React Router will handle the basename automatically
export const navigateToChat = (navigate: (path: string, options?: any) => void) => {
  navigate('/chat', { replace: true });
};

export const navigateToChatId = (navigate: (path: string, options?: any) => void, chatId: string) => {
  navigate(`/chat/${chatId}`);
};
