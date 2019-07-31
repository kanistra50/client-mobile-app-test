import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'tr-item-wrap',
    template: `<div class="item"><ng-content></ng-content></div>`,
    styleUrls: ['./tr-item-wrap.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrItemWrap {

}
