import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Guid}             from '../../utils/uuid';
import {SyncEventService} from '../services/sync-event.service';

@Component({
    selector: 'app-edit-input',
    templateUrl: './edit-input.component.html'
})
export class EditInputComponent implements OnInit {
    @Input() Text: string = '';
    @Output() Changed: EventEmitter<string> = new EventEmitter<string>();

    Value: string = '';
    GeneratedClass = `input-${Guid()}`;
    Dom = {
        InputInFocus: false
    };

    constructor(private element: ElementRef,
                private syncEvent: SyncEventService) {
    }

    /**
     *
     */
    ngOnInit() {
        this.Value = this.Text;
    }

    /**
     *
     * @constructor
     */
    Switch() {
        this.Dom.InputInFocus = !this.Dom.InputInFocus;

        if (this.Dom.InputInFocus) {
            // Assigning that to this for reference within the named function.
            let that = this;

            // Adding eventListener, named function so we can remove when its not needed anymore.
            let CFunc = function CFunc(event: any) {
                if (!that.element.nativeElement.contains(event.target) && event.target.className.indexOf(that.GeneratedClass) == -1) {
                    that.Dom.InputInFocus = false;
                    that.Changed.emit(that.Value);

                    // Remove
                    that.syncEvent.RemoveEvent('click', CFunc);
                    that.syncEvent.RemoveEvent('keyup', KFunc);
                }
            };
            let KFunc = function KFunc(event: any) {
                switch (event.keyCode) {
                    case 27:
                        that.Dom.InputInFocus = false;
                        that.Value = that.Text;

                        that.syncEvent.RemoveEvent('click', CFunc);
                        that.syncEvent.RemoveEvent('keyup', KFunc);
                        break;
                    case 13:
                        that.Dom.InputInFocus = false;
                        that.Changed.emit(that.Value);

                        that.syncEvent.RemoveEvent('click', CFunc);
                        that.syncEvent.RemoveEvent('keyup', KFunc);
                        break;
                }
            };

            this.syncEvent.AddEvent('keyup', KFunc);
            this.syncEvent.AddEvent('click', CFunc);
        }
    }
}
