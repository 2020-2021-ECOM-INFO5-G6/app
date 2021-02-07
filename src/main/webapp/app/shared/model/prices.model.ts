export interface IPrices {
  id?: number;
  noted?: number;
  nonNoted?: number;
}

export class Prices implements IPrices {
  constructor(public id?: number, public noted?: number, public nonNoted?: number) {}
}
