export class PasswordInvalidError extends Error {
  constructor(message?: string) {
    super(message ?? `The password is invalid.`);
  }
}
