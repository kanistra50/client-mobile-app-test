import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GoogleMap,} from "@ionic-native/google-maps";
import {Platform,} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {Geolocation} from '@ionic-native/geolocation/ngx'
import {PositionError} from "@ionic-native/geolocation";
import {MarkerTransferService} from "../../services/marker-transferr.service";
import {TrBlinker} from "../../shared/tr-blinker/tr-blinker.";
import {from} from "rxjs/internal/observable/from";
import {delay, finalize, take, takeUntil} from "rxjs/operators";
import {Subject, throwError} from "rxjs";
import {tap} from "rxjs/internal/operators/tap";
import {catchError} from "rxjs/internal/operators/catchError";
import {switchMap} from "rxjs/internal/operators/switchMap";
import {AGeolocationCallsService} from "../../services/a-geolocation-calls.service";
import {FormBuilder, FormGroup} from "@angular/forms";

interface Position {
    coords: Coordinates;
    timestamp: number;
}

interface Coordinates {
    accuracy: number;
    latitude: number;
    longitude: number;
    altitudeAccuracy: null;
    heading: null;
    altitude: null;
    speed: null;
}

@Component({
    selector: 'tr-advanced-geolocation',
    templateUrl: './advanced-geolocation.page.html',
    styleUrls: ['./advanced-geolocation.page.scss'],
})
export class AdvancedGeolocationPage implements OnInit, OnDestroy {

    paramsForm: FormGroup;
    result: any;
    resultView: any;
    map: GoogleMap;
    loading: any;
    stopResult: any;
    // eslint-disable-line no-undef
    item: any;
    accuracy: string;
    hiAccuracy = false;
    error: any;
    getPositionProcess = false;
    timeSpent: string;
    signalPositionEvent = false;
    errorMessage: string;
    errorCode: number;

    rangeSelectedValue: number;
    delayValue: number;

    points = [];
    bestValueIndex = 0;
    private readonly _destroy$ = new Subject<void>();
    @ViewChild(TrBlinker) blinker: TrBlinker;

    constructor(
        private fb: FormBuilder,
        private aGeolocation: AGeolocationCallsService,
        private platform: Platform,
        private router: Router,
        private route: ActivatedRoute,
        private _geolocation: Geolocation,
        private markerTransferService: MarkerTransferService,
    ) {}

    async ngOnInit() {
        await this.platform.ready();
        await this._initForm();
    }

    private _initForm() {
        this.paramsForm = this.fb.group({
            minTime: [''],
            minDistance: [''],

        });

    }

    onStart() {
        console.log(this.aGeolocation);
        const params = {
            "minTime": this.delayValue,         // Min time interval between updates (ms)
            "minDistance": this.rangeSelectedValue * 1000,       // Min distance between updates (meters)
            "noWarn": true,         // Native location provider warnings
            "providers": this.hiAccuracy ? "some" : "gps",     // Return GPS, NETWORK and CELL locations
            "useCache": false,       // Return GPS and NETWORK cached locations
            "satelliteData": true, // Return of GPS satellite info
            "buffer": false,        // Buffer location data
            "bufferSize": 0,        // Max elements in buffer
            "signalStrength": true // Return cell signal strength data
        };

        if (this.aGeolocation[0] === undefined) {
            console.warn('Unreachable service AGeolocationCallsService');
            // return;
        }
        // Implement this in `deviceready` event callback
        this.aGeolocation.start(params).pipe(
            tap(res => {
                this.result = res;
                this.resultView = JSON.stringify(res);
            }),
            takeUntil(this._destroy$)
        ).subscribe();
    }

    onStop() {
        const params = {
            "minTime": this.delayValue,         // Min time interval between updates (ms)
            "minDistance": this.rangeSelectedValue * 1000,       // Min distance between updates (meters)
            "noWarn": true,         // Native location provider warnings
            "providers": this.hiAccuracy ? "some" : "gps",     // Return GPS, NETWORK and CELL locations
            "useCache": false,       // Return GPS and NETWORK cached locations
            "satelliteData": true, // Return of GPS satellite info
            "buffer": false,        // Buffer location data
            "bufferSize": 0,        // Max elements in buffer
            "signalStrength": true // Return cell signal strength data
        };
        if (this.aGeolocation[0] === undefined) {
            console.warn('Unreachable service AGeolocationCallsService');
            // return;
        }
        this.aGeolocation.stop(params).pipe(
            tap(res => this.stopResult = JSON.stringify(res)),
            take(1)
        ).subscribe();
    }

    onKill() {
        const params = {
            "minTime": this.delayValue,         // Min time interval between updates (ms)
            "minDistance": this.rangeSelectedValue * 1000,       // Min distance between updates (meters)
            "noWarn": true,         // Native location provider warnings
            "providers": this.hiAccuracy ? "some" : "gps",     // Return GPS, NETWORK and CELL locations
            "useCache": false,       // Return GPS and NETWORK cached locations
            "satelliteData": true, // Return of GPS satellite info
            "buffer": false,        // Buffer location data
            "bufferSize": 0,        // Max elements in buffer
            "signalStrength": true // Return cell signal strength data
        };
        if (this.aGeolocation[0] === undefined) {
            console.warn('Unreachable service AGeolocationCallsService');
            // return;
        }
        this.aGeolocation.kill(params).pipe(
            tap(res => this.stopResult = JSON.stringify(res)),
            take(1)
        ).subscribe();
    }

    getLocation() {
        if (this.getPositionProcess) {
            return;
        }
        this._getLocation();
    }

    toggle() {
        this.hiAccuracy = !this.hiAccuracy;
    }

    private setMarker(crd) {
        this.markerTransferService.setMarker({lat: crd.lat, lng: crd.lng})
    }

    private _getLocation() {
        const timeBegin = Date.now();
        const options = {
            enableHighAccuracy: this.hiAccuracy,
            timeout: 5000,
            maximumAge: 0
        };
        this.getPositionProcess = true;

        this.points = [];
        const repeatedTimes = this.rangeSelectedValue;

        const gen$ = new Subject<any>();

        gen$.pipe(
            delay(this.delayValue),
            switchMap(() => location$),
            take(repeatedTimes - 1),
            finalize(() => {
                gen$.complete();
                this.getPositionProcess = false;
                this.timeSpent = timeBegin ? `${(Date.now() - timeBegin) / 1000} sec` : '';
                this.bestValueIndex = this._checkBestValue(this.points);
                this.setMarker(this.points[this.bestValueIndex]);
            })
        ).subscribe({error: (err) => {
            this._onError(err);
            console.log('gen$.pipe(...........');
            }});

        const location$ = from(this._geolocation.getCurrentPosition(options)).pipe(
            catchError((err) => throwError(err)),
            tap((position: Position) => {
                this._onSuccess(position);
                console.log('location$', position)}),
            take(1),
            finalize(() => {
                repeatedTimes > 0 ? gen$.next() : gen$.complete();
                console.log('next() and final single');
            })
        );

        location$.subscribe({error: (err) => {
                this._onError(err);
                console.log('location$.subscribe(...........');
            }});
    }


    private _checkBestValue(points: any): number {
        const temp = points.sort((a, b) => parseFloat(a['accuracy']) - parseFloat(b['accuracy']));
        return points.indexOf(temp[0]);
    }

    private _onSuccess(position: Position) {

        this.blinker.blink();

        const crd: Coordinates = position.coords;

        if (crd) {
            const accu: string = crd.accuracy.toFixed();
            this.accuracy = `${accu}m`;

            this.points.push({
                accuracy: Number(accu),
                lat: crd.latitude,
                lng: crd.longitude
            });
        }
    };

    private _onError(err: PositionError) {

        this.blinker.blinkError();

        this.errorMessage = err.message;
        this.errorCode = err.code;

        setTimeout(() => {
            this.errorMessage = '';
            this.errorCode = 0;
        }, 2000);

        this.error = err;
        console.warn(`ERROR(${err.code}): ${err.message}`);
    };

    onRangeSelected(rangeSelectedValue) {
        this.rangeSelectedValue = rangeSelectedValue;
    }

    onRangeDelaySelected(delayValue) {
        this.delayValue = delayValue;
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
        // this.markerTransferService.setMarker(null);
    }

    // alert('Latitude: '          + position.coords.latitude          + '\n' +
    //     'Longitude: '         + position.coords.longitude         + '\n' +
    //     'Altitude: '          + position.coords.altitude          + '\n' +
    //     'Accuracy: '          + position.coords.accuracy          + '\n' +
    //     'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
    //     'Heading: '           + position.coords.heading           + '\n' +
    //     'Speed: '             + position.coords.speed             + '\n' +
    //     'Timestamp: '         + position.timestamp                + '\n');
}
