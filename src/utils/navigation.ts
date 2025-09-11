// Navigation utilities that handle GitHub Pages vs localhost correctly
const isGitHubPages = (): boolean => {
  return window.location.hostname === 'ilyaedelshtein.github.io';
};

const getBasePath = (): string => {
  if (isGitHubPages()) {
    return '/KornitChat';
  }
  return '';
};

export const navigateToChat = (navigate: (path: string, options?: any) => void) => {
  const basePath = getBasePath();
  navigate(`${basePath}/chat`, { replace: true });
};

export const navigateToChatId = (navigate: (path: string, options?: any) => void, chatId: string) => {
  const basePath = getBasePath();
  navigate(`${basePath}/chat/${chatId}`);
};

export const getBaseName = (): string => {
  return getBasePath();
};
