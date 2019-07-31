import {Component, OnDestroy} from '@angular/core';
import {Subject} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {ItemService} from "../../services/item.service";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {SCAN_EVENT} from "../../constants/scan-event.constants";
import {PositionError} from "@ionic-native/geolocation";
import {finalize, take, takeUntil} from "rxjs/operators";
import {MarkerTransferService} from "../../services/marker-transferr.service";

@Component({
    selector: 'tr-auto-scan',
    templateUrl: './auto-scan.page.html',
    styleUrls: ['./auto-scan.page.scss'],
})
export class AutoScanPage implements OnDestroy {
    item: any;
    wX: any; wY: any;
    accuracy: string;
    hiAccuracyW = false;
    accuracyW: any;
    error: any;
    watchPositionProcess = false;
    timeWatcherBegin: any;
    watcherPeriod: string;
    watchId: number;
    signalWatcherEvent = false;
    signalWatcherError = false;
    errorMessageW: string;
    errorCodeW: number;
    scanSuccedCounter = 0;
    scanErrorCounter = 0;
    scanQuantaty: number;

    private readonly _destroy$ = new Subject<void>();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private itemService: ItemService,
        private _geolocation: Geolocation,
        private markerTransferService: MarkerTransferService,
    ) {
    }

    startWatcher() {
        if (this.watchPositionProcess) {
            return;
        };
        this._blinkWatcher(SCAN_EVENT.SUCCESS, 150);
        this._startWatcher();
    }

    private setMarker(crd) {
        this.markerTransferService.setMarker({lat: crd.latitude, lng: crd.longitude})
    }

    private _blinkWatcher(eventType, time) {
        switch(eventType) {
            case SCAN_EVENT.SUCCESS: {
                this.signalWatcherEvent = true
                setTimeout(() => this.signalWatcherEvent = false, time);
            }; break;
            case SCAN_EVENT.ERROR: {
                this.signalWatcherError = true
                setTimeout(() => this.signalWatcherError = false, time);
            }
        }
    }

    clearWatcher() {
        this.scanQuantaty = 1;
        this.watchId = null;
        this.wX = '';
        this.wY = '';
        this.watcherPeriod = null;
        this.accuracyW = '';
        this._destroy$.next();
        this._destroy$.complete();
    }

    toggleW() {
        if(this.watchPositionProcess) {
            return;
        }
        this.hiAccuracyW = !this.hiAccuracyW;
    }

    private _startWatcher() {
        const options = {
            enableHighAccuracy: this.hiAccuracyW,
            timeout: 5000,
            maximumAge: 0
        };
        this.watchPositionProcess = true;
        this.scanQuantaty = 10;
        this.scanErrorCounter = 0;
        this.scanSuccedCounter = 0;
        this._geolocation.watchPosition(options).pipe(
            take(this.scanQuantaty),
            takeUntil(this._destroy$),
            finalize(() => {
                console.log('Finalyze Watcher');
                this.watchPositionProcess = false
            })
        ).subscribe(
            position => this._onWatcherEvent(position),
            err => this._onWatcherError(err)
        );
    }

    private _onWatcherEvent(position: any) {

        if (position && position.coords) {
            console.log('_onWatcherEvent', position);
            this.scanSuccedCounter+=1;
            this.signalWatcherEvent = true;

            const crd = position.coords;
            if (crd) {
                this.wX = crd.latitude;
                this.wY = crd.longitude;
                this.accuracyW =`${crd.accuracy.toFixed()}m`;
                this.watchId = position.timestamp;

                this.setMarker(crd);
            } else {
                this.wX = '';
                this.wY = '';
                this.accuracyW = '';
            }

            this.watcherPeriod = this.timeWatcherBegin ? `${(Date.now() - this.timeWatcherBegin) / 100} ms` : '';
            this.timeWatcherBegin = Date.now();
            console.log('Your current position is:', position);
            setTimeout(() => this.signalWatcherEvent = false, 500);
        }
        if (position && position.code) {
            this._onWatcherError(position);
        }

    }

    private _onWatcherError(err: PositionError): void {
        this.scanErrorCounter+=1;
        this.wX = '';
        this.wY = '';
        this.accuracyW = '';
        this.watcherPeriod = null;
        this.errorMessageW = err.message;
        this.errorCodeW = err.code;
        this.error = err;
        console.warn(`Watcher ERROR(${err.code}): ${err.message}`);
        setTimeout(() => {
            this.errorMessageW = '';
            this.errorCodeW = 0;
        }, 2000);
        this.signalWatcherError = true;
        setTimeout(() => this.signalWatcherError = false, 500);
    }
    ngOnDestroy() {
        this.markerTransferService.setMarker(null);
        this._destroy$.next();
        this._destroy$.complete();
    }
}
