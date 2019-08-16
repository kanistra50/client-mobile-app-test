import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {TrRangeDelaySelector} from "./tr-range-delay-selector";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [TrRangeDelaySelector],
    exports: [TrRangeDelaySelector],
})
export class TrRangeDelaySelectorModule {
}
