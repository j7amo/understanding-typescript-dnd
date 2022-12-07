export enum ProjectStatus {
  Active,
  Finished,
}

export class Project {
  // here we are using the shortcut which helps us declare fields and instantiate them at the same time
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
