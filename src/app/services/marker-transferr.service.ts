import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

export interface Marker {
  lat: number;
  lng: number;
}

@Injectable()
export class MarkerTransferService {

  private readonly _userName$ = new BehaviorSubject<Marker>(null);

  constructor() {}

  get userName$(): Observable<Marker> {
    return this._userName$.asObservable();
  }

  setMarker(marker: Marker): void {
    this._userName$.next(marker);
  }


  clearMarkers() {
    this._userName$.next(null);
  }

}
