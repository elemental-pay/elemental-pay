export enum ErrorCodes {
  NOT_FOUND = 'NOT_FOUND',
  MISC_ERROR = 'MISC_ERROR',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  DELETE_ERROR = 'DELETE_ERROR',
};

export class APIError extends Error {
  readonly name;
  readonly extensions;

  constructor(message: string, code: string, extensions?: { [key: string]: any }) {
    super(message);

    if (extensions) {
      Object.keys(extensions)
        .filter(keyName => keyName !== 'message' && keyName !== 'extensions')
        .forEach(key => {
          this[key] = extensions[key];
        });
    }

    if (!this.name) {
      Object.defineProperty(this, 'name', { value: 'APIError' });
    }

    const userProvidedExtensions = (extensions && extensions.extensions) || null;

    this.extensions = { ...extensions, ...userProvidedExtensions, code };
  }
}
