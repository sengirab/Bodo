import {Component, ElementRef, forwardRef, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR}              from '@angular/forms';

import {OwlDateTimeInlineComponent}                           from 'ng-pick-datetime/date-time/date-time-inline.component';

export const DATE_TIME_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DateTimeComponent),
    multi: true
};

@Component({
    selector: 'app-date-time',
    templateUrl: './date-time.component.html',
    providers: [DATE_TIME_VALUE_ACCESSOR]
})
export class DateTimeComponent implements OnInit, ControlValueAccessor {
    @ViewChild(OwlDateTimeInlineComponent) Picker: OwlDateTimeInlineComponent<any>;

    Open: boolean = false;
    Date: Date;

    private onTouchedCallback: () => void = () => {
    };
    private onChangeCallback: (_: any) => void = () => {
    };

    constructor(private element: ElementRef) {
    }

    ngOnInit() {
    }

    /**
     *
     * @constructor
     */
    OpenPicker() {
        if (this.Open) {
            return;
        }

        this.Open = true;

        let that = this;
        let closePicker = function closePicker(event) {
            if (!that.element.nativeElement.contains(event.target) &&
                event.target.className.indexOf('owl-dt-calendar-cell-content') < 0) {

                that.ClosePicker();
                document.removeEventListener('click', closePicker);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', closePicker);

            this.Picker.registerOnChange((d) => {
                this.writeValue(d);
            });
        });
    }

    /**
     *
     * @constructor
     */
    ClosePicker() {
        this.Open = false;
    }

    /**
     *
     * @constructor
     */
    Reset() {
        this.writeValue(null);
    }

    /**
     *
     * @returns {any}
     */
    get value(): any {
        return this.Date;
    };

    /**
     *
     * @param v
     */
    set value(v: any) {
        if (v !== this.Date) {
            this.Date = v;
            this.onChangeCallback(v);
        }
    }

    /**
     *
     * @param value
     */
    writeValue(value: any) {
        if (value !== this.value) {
            this.value = value;
        }
    }

    /**
     *
     * @param fn
     */
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    };

    /**
     *
     * @param fn
     */
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}
