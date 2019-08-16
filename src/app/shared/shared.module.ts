import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {TrItemWrap} from "./tr-item-wrap/tr-item-wrap";
import {TrBlinker} from "./tr-blinker/tr-blinker.";

const components = [
  TrItemWrap,
  TrBlinker,
];
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [...components],
  exports: [...components],
})
export class SharedModule {}
