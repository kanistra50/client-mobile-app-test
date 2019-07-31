import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {TrItemWrap} from "./tr-item-wrap/tr-item-wrap";

const componnets = [
  TrItemWrap
];
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [...componnets],
  exports: [...componnets],
})
export class SharedModule {}
