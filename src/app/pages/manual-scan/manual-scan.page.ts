import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GoogleMap,} from "@ionic-native/google-maps";
import {Platform,} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {Geolocation} from '@ionic-native/geolocation/ngx'
import {PositionError} from "@ionic-native/geolocation";
import {MarkerTransferService} from "../../services/marker-transferr.service";
import {TrBlinker} from "../../shared/tr-blinker/tr-blinker.";
import {from} from "rxjs/internal/observable/from";
import {delay, finalize, repeat, take} from "rxjs/operators";
import {throwError} from "rxjs";
import {tap} from "rxjs/internal/operators/tap";
import {catchError} from "rxjs/internal/operators/catchError";

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
    selector: 'tr-manual-scan',
    templateUrl: './manual-scan.page.html',
    styleUrls: ['./manual-scan.page.scss'],
})
export class ManualScanPage implements OnInit, OnDestroy {

    map: GoogleMap;
    loading: any;

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

    @ViewChild(TrBlinker) blinker: TrBlinker;

    constructor(
        private platform: Platform,
        private router: Router,
        private route: ActivatedRoute,
        private _geolocation: Geolocation,
        private markerTransferService: MarkerTransferService,
    ) {}

    async ngOnInit() {
        await this.platform.ready();
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

        from(this._geolocation.getCurrentPosition(options)).pipe(
                take(1),
                catchError((err) => throwError(err)),
                tap((position: Position) => {
                    console.log(position);
                    this._onSuccess(position);
                }),
                delay(this.delayValue),
                repeat(repeatedTimes),
                finalize(() => {
                    console.log("Finalize");
                    this.getPositionProcess = false;
                    this.timeSpent = timeBegin ? `${(Date.now() - timeBegin) / 100} ms` : '';
                    this.bestValueIndex = this._checkBestValue(this.points);
                    this.setMarker(this.points[this.bestValueIndex]);
                })
            ).subscribe({error: (err) => this._onError(err)});


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
        // this.timeSpent = null;

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
        this.markerTransferService.setMarker(null);
    }

    geoRequest() {
        // return from(this._geolocation.getCurrentPosition(options)
        //     .then(position => this._onSuccess(position))
        //     .catch(err => this._onError(err))
        //     .finally(() => {
        //         console.log('Finalize  getCurrentPosition()', i, this.rangeSelectedValue);
        //         if (this.rangeSelectedValue <= i+1) {
        //             this.getPositionProcess = false;
        //             this.timeSpent = this.timeBegin ? `${(Date.now() - this.timeBegin) / 100} ms` : '';
        //             this.bestValueIndex = this._checkBestValue(this.points);
        //             this.setMarker(this.points[this.bestValueIndex]);
        //         }
        //     });
    }
    // console.log('Your current position is:', position);
    // alert('Latitude: '          + position.coords.latitude          + '\n' +
    //     'Longitude: '         + position.coords.longitude         + '\n' +
    //     'Altitude: '          + position.coords.altitude          + '\n' +
    //     'Accuracy: '          + position.coords.accuracy          + '\n' +
    //     'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
    //     'Heading: '           + position.coords.heading           + '\n' +
    //     'Speed: '             + position.coords.speed             + '\n' +
    //     'Timestamp: '         + position.timestamp                + '\n');
}
