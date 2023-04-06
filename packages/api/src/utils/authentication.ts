
export const extractBearerToken = (headers: { authorization?: string }) =>
  headers?.authorization?.replace(/^\s*Bearer\s*/, '');
