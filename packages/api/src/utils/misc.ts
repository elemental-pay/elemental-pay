export const objNotNull = (obj) => typeof obj === 'object' && obj !== null && Object.keys(obj).length > 0;

export const getIpFromReq = (req): string | null => {
  const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;;
  if (!ip) {
    return null;
  }

  return ip;
}