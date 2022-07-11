export const makeError = (args = {}, error?) => ({
  success: false,
  message: (error && error.message) || 'Error',
  code: 500,
  ...args,
});
