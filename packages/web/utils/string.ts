export const toBase64 = (text) => {
  if (typeof window === 'undefined') {
    return Buffer.from(text).toString('base64')
  } else {
    return btoa(text);
  }
};

export const fromBase64 = (text) => {
  if (typeof window === 'undefined') {
    return Buffer.from(text, 'base64');
  } else {
    return atob(text);
  }
};
