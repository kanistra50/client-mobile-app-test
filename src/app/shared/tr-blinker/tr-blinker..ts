import {Component} from '@angular/core';

@Component({
    selector: 'tr-blinker',
    template: `<span class="blinker" [ngClass]="{light: signalEvent, error: signalError}"></span>`,
    styleUrls: ['./tr-blinker.scss'],
})
export class TrBlinker {

    time = 100;
    signalEvent = false;
    signalError = false;

    blink() {
        this.signalEvent = true
        setTimeout(() => this.signalEvent = false, 2 * this.time);
    }

    blinkError() {
        this.signalError = true;
        setTimeout(() => {
            this.signalError = false;
            setTimeout(() => {
                this.signalError = true;
                setTimeout(() => this.signalError = false, this.time);
            }, this.time);
        }, this.time);
    }
}
