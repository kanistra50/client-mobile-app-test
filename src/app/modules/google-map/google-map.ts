import {Component, OnDestroy, OnInit} from '@angular/core';
import {
    GoogleMap,
    GoogleMaps,
    GoogleMapsEvent, LatLng,
    Marker,
    MyLocation
} from "@ionic-native/google-maps";
import {LoadingController, Platform, ToastController} from "@ionic/angular";
import {IdGeneratorService} from "../../services/idGenerator.service";
import {MarkerTransferService} from "../../services/marker-transferr.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {from} from "rxjs/internal/observable/from";

@Component({
    selector: 'tr-google-map',
    templateUrl: './google-map.html',
    styleUrls: ['./google-map.scss'],
})
export class TrGoogleMap implements OnInit, OnDestroy {
    mapId: string;
    map: GoogleMap;
    loading: any;
    private readonly _destroy$ = new Subject<void>();
    private readonly _stopRaunner$ = new Subject<void>();

    constructor(
        private idGeneratorService: IdGeneratorService,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
        private platform: Platform,
        private markerTransferService: MarkerTransferService,
    ) {
        this.mapId = this.idGeneratorService.getItems();
    }


    async ngOnInit() {
        // Since ngOnInit() is executed before `deviceready` event,
        // you have to wait the event.
        await this.platform.ready();
        await this._createMap();
        await this._loadMap();
        this.markerTransferService.userName$
            .pipe(takeUntil(this._destroy$))
            .subscribe(
                (point: LatLng) => {
                    if (point) {
                        this.setMarker(point);
                    }
                }
            );
    }

    async _createMap() {
        this.map = GoogleMaps.create('map', {
            camera: {
                target: {
                    lat: 43.0741704,
                    lng: -89.3809802
                },
                zoom: 18,
                tilt: 30
            }
        });
    }

    async _loadMap() {

        this._loadingPresent();

        from(this.map.getMyLocation()).pipe().subscribe()
        // Get the location of you
        this.map.getMyLocation().then((location: MyLocation) => {
            this._loadingDismiss();
            console.log(JSON.stringify(location, null, 2));

            // Move the map camera to the location with animation
            this.map.animateCamera({
                target: location.latLng,
                zoom: 20,
                tilt: 30
            });
        }) .catch(err => {
            this._loadingDismiss();
            this.showToast(err.error_message);
        });

        this.map.clear();
    }


    private async _loadingPresent() {
        this.loading = await this.loadingCtrl.create({
            message: '...loading'
        });
        await this.loading.present();
        setTimeout(() => this._loadingDismiss(), 5000);
    }


    private _loadingDismiss() {
        this.loading.dismiss();
    }

    setMarker(point: LatLng) {
        // Move the map camera to the location with animation
        this.map.animateCamera({
            target: point,
            zoom: 20,
            tilt: 30
        });


        let marker: Marker = this.map.addMarkerSync({
            position: point,
            flat: true,
            label: 'A',
            icon: '#009933',
            //         // path: this.map.SymbolPath.CIRCLE,
            //         scale: 24,
            //         strokeWeight: 2,
            //         fillColor: '#009933',
            //         fillOpacity: 0.001,
            //         // anchor: new google.maps.Point(0, 0)
            //     }
        });
        //
        // add a marker
        // let marker: Marker = this.map.addMarkerSync({
        //     title: '',
        //     snippet: '',
        //     position: point,
        //     animation: GoogleMapsAnimation.BOUNCE
        // });

        // show the infoWindow
        marker.showInfoWindow();

        // If clicked it, display the alert
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
            this.showToast('clicked!');
        });
    }

    async showToast(message: string) {
        let toast = await this.toastCtrl.create({
            message: message,
            duration: 500,
            position: 'middle'
        });

        toast.present();
    }

    ngOnDestroy(): void {
        if (this.loading) {
            this._loadingDismiss();
        };
        this.map.clear();
        this._destroy$.next();
        this._destroy$.complete();
    }

    // async onButtonClick() {
    //     // this.map.clear();
    //
    //     this.loading = await this.loadingCtrl.create({
    //         message: 'Please wait...'
    //     });
    //     await this.loading.present();
    //
    //     // Get the location of you
    //     this.map.getMyLocation().then((location: MyLocation) => {
    //         this.loading.dismiss();
    //         console.log(JSON.stringify(location, null ,2));
    //
    //         // Move the map camera to the location with animation
    //         this.map.animateCamera({
    //             target: location.latLng,
    //             zoom: 17,
    //             tilt: 30
    //         });
    //
    //         // add a marker
    //         let marker: Marker = this.map.addMarkerSync({
    //             title: '@ionic-native/google-maps plugin!',
    //             snippet: 'This plugin is awesome!',
    //             position: location.latLng,
    //             animation: GoogleMapsAnimation.BOUNCE
    //         });
    //
    //         // show the infoWindow
    //         marker.showInfoWindow();
    //
    //         // If clicked it, display the alert
    //         marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
    //             this.showToast('clicked!');
    //         });
    //     })
    //         .catch(err => {
    //             this.loading.dismiss();
    //             this.showToast(err.error_message);
    //         });
    // }


}
