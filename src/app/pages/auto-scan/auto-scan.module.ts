import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {AutoScanPage} from './auto-scan.page';
import {MarkerTransferService} from "../../services/marker-transferr.service";
import {SharedModule} from "../../shared/shared.module";
import {GoogleMapModule} from "../../modules/google-map/google-map.module";

const routes: Routes = [
    {
        path: '',
        component: AutoScanPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild(routes),

        SharedModule,
        GoogleMapModule,
    ],
    declarations: [AutoScanPage],
    providers: [MarkerTransferService]
})
export class AutoScanModule {
}
