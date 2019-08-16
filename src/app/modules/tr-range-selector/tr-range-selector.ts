import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'tr-range-selector',
    templateUrl: './tr-range-selector.html',
    styleUrls: ['./tr-range-selector.scss'],
})
export class TrRangeSelector implements OnInit {

    form: FormGroup;
    @Input() isDisabled = false;
    @Output() onChange = new EventEmitter<number>();

    constructor(public formBuilder: FormBuilder) {}

    ngOnInit() {
        this.form = this.formBuilder.group({
            rangeValue: new FormControl(1,
                Validators.compose([
                    Validators.minLength(1),
                    Validators.minLength(5),
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
