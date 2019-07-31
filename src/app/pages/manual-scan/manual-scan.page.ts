import {Component, OnInit, ViewChild} from '@angular/core';
import {
    GoogleMap,
    GoogleMaps,
    GoogleMapsAnimation,
    GoogleMapsEvent,
    Marker,
    MyLocation
} from "@ionic-native/google-maps";
import {LoadingController, Platform, ToastController} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {SCAN_EVENT} from "../../constants/scan-event.constants";
import {Geolocation} from '@ionic-native/geolocation/ngx'
import {PositionError} from "@ionic-native/geolocation";
import {TrGoogleMap} from "../../modules/google-map/google-map";
import {MarkerTransferService} from "../../services/marker-transferr.service";

@Component({
    selector: 'tr-manual-scan',
    templateUrl: './manual-scan.page.html',
    styleUrls: ['./manual-scan.page.scss'],
})
export class ManualScanPage implements OnInit {

    private myPoints = [];
    map: GoogleMap;
    loading: any;


    // eslint-disable-line no-undef
    item: any;
    pX: any; pY: any;
    accuracy: string;
    hiAccuracyP = false;
    error: any;
    getPositionProcess = false;
    timeBegin: any;
    timeSpent: string;
    signalPositionEvent = false;
    signalPositionError = false;
    signalWatcherError = false;
    errorMessageP: string;
    errorCodeP: number;

    @ViewChild('TrGoogleMap') private googleMap: TrGoogleMap;

    constructor(
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
        private platform: Platform,

        private router: Router,
        private route: ActivatedRoute,
        private _geolocation: Geolocation,
        private markerTransferService: MarkerTransferService,
    ) {

    }

    async ngOnInit() {
        await this.platform.ready();
    }



    getLocation() {
        if (this.getPositionProcess) {
            return;
        }
        this.timeBegin = Date.now();
        this._getLocation();
    }

    private _blinkSingleScan(eventType, time) {
        switch(eventType) {
            case SCAN_EVENT.SUCCESS: {
                this.signalPositionEvent = true
                setTimeout(() => this.signalPositionEvent = false, time);
            }; break;
            case SCAN_EVENT.ERROR: {
                this.signalPositionError = true
                setTimeout(() => this.signalWatcherError = false, time);
            }
        }
    }


    toggleP() {
        this.hiAccuracyP = !this.hiAccuracyP;
    }

    private setMarker(crd) {
        this.markerTransferService.setMarker({lat: crd.latitude, lng: crd.longitude})
    }

    private _getLocation() {
        const options = {
            enableHighAccuracy: this.hiAccuracyP,
            timeout: 5000,
            maximumAge: 0
        };
        this.getPositionProcess = true;

        this._geolocation.getCurrentPosition(options)
            .then(position => this._onSuccess(position))
            .catch(err => this._onError(err))
            .finally(() => {
                console.log('Finalyze  getCurrentPosition()');
                this.getPositionProcess = false;
            });
    }
    private _onSuccess(position) {
        this.signalPositionEvent = true;
        setTimeout(() => this.signalPositionEvent = false, 500);

        this.timeSpent = this.timeBegin ? `${(Date.now() - this.timeBegin) / 100} ms` : '';
        const crd = position.coords;
        if (crd) {
            this.pX = crd.latitude;
            this.pY = crd.longitude;
            this.accuracy = `${crd.accuracy.toFixed()}m`;

            this.setMarker(crd);

        } else {
            this.pX = '';
            this.pY = '';
            this.accuracy = '';
        }


        console.log('Your current position is:', position);
        // alert('Latitude: '          + position.coords.latitude          + '\n' +
        //     'Longitude: '         + position.coords.longitude         + '\n' +
        //     'Altitude: '          + position.coords.altitude          + '\n' +
        //     'Accuracy: '          + position.coords.accuracy          + '\n' +
        //     'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
        //     'Heading: '           + position.coords.heading           + '\n' +
        //     'Speed: '             + position.coords.speed             + '\n' +
        //     'Timestamp: '         + position.timestamp                + '\n');
    };
    private _onError(err: PositionError) {
        this.signalPositionError = true;
        this.pX = '';
        this.pY = '';
        this.accuracy = '';
        this.errorMessageP = err.message;
        this.errorCodeP = err.code;
        this.timeSpent = null;

        setTimeout(() => {
            this.errorMessageP = '';
            this.errorCodeP = 0;
        }, 2000);
        setTimeout(() => this.signalPositionError = false, 500);

        this.error = err;
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }



}
