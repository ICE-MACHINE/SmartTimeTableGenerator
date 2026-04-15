export const setToken = (token: string) => {
  document.cookie = `session_token=${token}; path=/; max-age=86400; SameSite=Strict`;
};

export const getToken = (): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + 'session_token' + '=([^;]+)'));
  if (match) return match[2];
  return null;
};

export const removeToken = () => {
  document.cookie = 'session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};
