export class Element {
  constructor(
    public id: string,
    public name: string,
    public slug: string,
    public description: string,
    public userId: string,
    public thumbnail: string,
    public type: string,
    public draft: boolean,
    public visibility: string,
    public order: number
  ) {}
}
