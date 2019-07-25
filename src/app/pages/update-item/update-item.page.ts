import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ItemService} from '../../services/item.service';
import {Geolocation} from '@ionic-native/geolocation/ngx'
import {finalize, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {PositionError} from "@ionic-native/geolocation";

@Component({
    selector: 'app-update-item',
    templateUrl: './update-item.page.html',
    styleUrls: ['./update-item.page.scss'],
})
export class UpdateItemPage implements OnInit {
// eslint-disable-line no-undef
    item: any;
    edit_item_form: FormGroup;

    pX: any; pY: any;
    wX: any; wY: any;
    accuracy: any;
    hiAccuracyP = false;
    hiAccuracyW = false;
    accuracyW: any;
    error: any;
    getPositionProcess = false;
    watchPositionProcess = false;
    timeBegin: any;
    timeSpent: string;
    timeWatcherBegin: any;
    watcherPeriod: string;
    watchId: number;
    signalPositionEvent = false;
    signalPositionError = false;
    signalWatcherEvent = false;
    signalWatcherError = false;
    errorMessageP: string;
    errorCodeP: number;
    errorMessageW: string;
    errorCodeW: number;
    scanSuccedCounter = 0;
    scanErrorCounter = 0;

    private readonly _destroy$ = new Subject<void>();

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public formBuilder: FormBuilder,
        private itemService: ItemService,
        private _geolocation: Geolocation,
    ) {
    }

    ngOnInit() {
        this.route.params.subscribe(
            data => {
                this.item = this.itemService.getItemById(data.id)[0];
                //if item is undefined, go back to home
                if (!this.item) {
                    this.goBack();
                } else {
                    this.edit_item_form = this.formBuilder.group({
                        title: new FormControl(this.item.title, Validators.required),
                        description: new FormControl(this.item.description, Validators.required)
                    });
                }
            }
        )
    }

    getLocation() {
        if (this.getPositionProcess) {
            return;
        }
        this.timeBegin = Date.now();
        this._getLocation();
    }

    startWatcher() {
        if (this.watchPositionProcess) {
            return;
        }
        this.signalWatcherEvent = true
        setTimeout(() => this.signalWatcherEvent = false, 150);
        this._startWatcher();
    }

    clearWatcher() {
        this.watchPositionProcess = false;
        this.watchId = null;
        this.wX = '';
        this.wY = '';
        this.watcherPeriod = null;
        this.accuracyW = '';
        this._destroy$.next();
        this._destroy$.complete();
    }

    toggleP() {
        this.hiAccuracyP = !this.hiAccuracyP;
    }

    toggleW() {
        if(this.watchPositionProcess) {
            return;
        }
        this.hiAccuracyW = !this.hiAccuracyW;
    }

    goBack() {
        this.router.navigate(['/home']);
    }

    updateItem(value) {
        let newValues = {
            id: this.item.id,
            title: value.title,
            description: value.description
        };
        this.itemService.updateItem(newValues);
        this.goBack();
    }

    ngOnDestroy() {
        this._destroy$.next();
        this._destroy$.complete();
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
            this.accuracy = crd.accuracy;
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
        // alert('code: ' + err.code + '\n' +
        //     'message: ' + err.message + '\n');
    }

    private _startWatcher() {
        const options = {
            enableHighAccuracy: this.hiAccuracyW,
            timeout: 5000,
            maximumAge: 0
        };
        this.watchPositionProcess = true;

        this._geolocation.watchPosition(options).pipe(
            takeUntil(this._destroy$),
            finalize(() => {
                console.log('Finalyze Watcher');
                this.scanErrorCounter = 0;
                this.scanSuccedCounter = 0;
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
                this.accuracyW = crd.accuracy;
                this.watchId = position.timestamp;
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

    private _onWatcherError(err: PositionError) {
        this.scanErrorCounter+=1;
        this.wX = '';
        this.wY = '';
        this.accuracyW = '';
        this.watcherPeriod = null;
        this.errorMessageW = err.message;
        this.errorCodeW = err.code;
        setTimeout(() => {
            this.errorMessageW = '';
            this.errorCodeW = 0;
        }, 2000);
        this.signalWatcherError = true;
        setTimeout(() => this.signalWatcherError = false, 500);

        this.error = err;
        console.warn(`Watcher ERROR(${err.code}): ${err.message}`);
    }
}
