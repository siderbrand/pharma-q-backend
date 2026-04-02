export class Patient {
  constructor(
    public readonly name: string,
    public readonly document: string,
    public readonly preferencial: boolean,
  ) {}
}