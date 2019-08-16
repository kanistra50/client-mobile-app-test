import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {TrRangeSelector} from "./tr-range-selector";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [TrRangeSelector],
    exports: [TrRangeSelector],
})
export class TrRangeSelectorModule {
}
