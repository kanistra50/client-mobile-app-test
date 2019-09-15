import {NgModule} from '@angular/core';
import {IonicModule} from '@ionic/angular';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule} from "@angular/forms";

import {AdvancedGeolocationPage} from './advanced-geolocation.page';
import {SharedModule} from "../../shared/shared.module";
import {GoogleMapModule} from "../../modules/google-map/google-map.module";
import {MarkerTransferService} from "../../services/marker-transferr.service";
import {TrRangeSelectorModule} from "../../modules/tr-range-selector/tr-range-selector.module.";
import {TrRangeDelaySelectorModule} from "../../modules/tr-range-delay-selector/tr-range-delay-selector.module.";

const routes: Routes = [
    {
        path: '',
        component: AdvancedGeolocationPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild(routes),
        FormsModule,
        SharedModule,
        GoogleMapModule,
        TrRangeSelectorModule,
        TrRangeDelaySelectorModule,
    ],
    declarations: [AdvancedGeolocationPage],
    providers: [MarkerTransferService]
})
export class AdvancedGeolocationModule {
}
