export class CourseInvalidError extends Error {
  constructor(message?: string) {
    super(message ?? `The course is invalid.`);
  }
}
