import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ManualScanPage} from './manual-scan.page';
import {SharedModule} from "../../shared/shared.module";
import {GoogleMapModule} from "../../modules/google-map/google-map.module";
import {MarkerTransferService} from "../../services/marker-transferr.service";

const routes: Routes = [
    {
        path: '',
        component: ManualScanPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild(routes),

        SharedModule,
        GoogleMapModule,
    ],
    declarations: [ManualScanPage],
    providers: [MarkerTransferService]
})
export class ManualScanModule {
}
