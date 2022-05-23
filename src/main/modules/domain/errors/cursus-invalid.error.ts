export class CursusInvalidError extends Error {
  constructor(message?: string) {
    super(message ?? `The cursus is invalid.`);
  }
}
