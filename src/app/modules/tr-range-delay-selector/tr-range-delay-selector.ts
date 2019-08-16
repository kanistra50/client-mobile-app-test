import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'tr-range-delay-selector',
    templateUrl: './tr-range-delay-selector.html',
    styleUrls: ['./tr-range-delay-selector.scss'],
})
export class TrRangeDelaySelector implements OnInit {

    form: FormGroup;
    @Input() isDisabled = false;
    @Output() onChange = new EventEmitter<number>();

    constructor(public formBuilder: FormBuilder) {}

    ngOnInit() {
        this.form = this.formBuilder.group({
            rangeValue: new FormControl(0,
                Validators.compose([
                    Validators.minLength(0),
                    Validators.minLength(900),
                    Validators.required
                ])),
        });
        this._emitRange();
    }


    changeRange() {
       this._emitRange();
    }

    private _emitRange() {
        this.onChange.emit(this.form.get('rangeValue').value);
    }
}
