import {Component, OnInit} from '@angular/core';
import {LoadingController, Platform, ToastController} from "@ionic/angular";

@Component({
    selector: 'tr-auto-scan',
    templateUrl: './auto-scan.page.html',
    styleUrls: ['./auto-scan.page.scss'],
})
export class AutoScanPage implements OnInit {


    constructor(
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,

    ) { }


    ngOnInit() {

    }






}
