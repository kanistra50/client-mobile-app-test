import {Injectable} from '@angular/core';

@Injectable()
export class IdGeneratorService {

  constructor() { }

  getItems(): string {
    return (Date.now() + Math.random()* 1000).toFixed();
  }
}
