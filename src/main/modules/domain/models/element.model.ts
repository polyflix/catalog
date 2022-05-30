export class Element {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly slug: string,
    readonly description: string,
    readonly userId: string,
    readonly thumbnail: string,
    readonly type: string,
    readonly draft: boolean,
    readonly visibility: string
  ) {}
}
