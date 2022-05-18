export class ModuleInvalidError extends Error {
  constructor(message?: string) {
    super(message ?? `The module is invalid.`);
  }
}
