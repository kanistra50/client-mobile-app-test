import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {TrGoogleMap} from './google-map';


@NgModule({
    imports: [
        CommonModule,
        IonicModule,
    ],
    declarations: [TrGoogleMap],
    exports: [TrGoogleMap],
})
export class GoogleMapModule {
}
