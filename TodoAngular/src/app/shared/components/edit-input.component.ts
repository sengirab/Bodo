import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import {Guid}             from '../../utils/uuid';
import {SyncEventService} from '../services/sync-event.service';

@Component({
    selector: 'app-edit-input',
    templateUrl: './edit-input.component.html'
})
export class EditInputComponent implements OnInit {
    @ViewChild('input') Input: ElementRef;

    @Input() Text: string = '';

    @Output('changed') Changed: EventEmitter<string> = new EventEmitter<string>();
    @Output('tab') TabEvent: EventEmitter<string> = new EventEmitter<string>();

    Value: string = '';
    GeneratedClass = `${Guid()}`;
    SyncEvent: SyncEventService;
    Dom = {
        InputInFocus: false
    };

    constructor(private element: ElementRef,
                private syncEvent: SyncEventService,
                private changeDetect: ChangeDetectorRef) {
        this.SyncEvent = syncEvent;
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
            setTimeout(() => {
                this.Input.nativeElement.focus();
            }, 0);

            this.syncEvent.AddEvent('click', e => this.HandleClick(e));
            this.syncEvent.AddEvent('keyup', e => this.HandleKeyUp(e));
        }
    }

    /**
     *
     * @param event
     * @constructor
     */
    HandleClick(event) {
        if (!this.element.nativeElement.contains(event.target) && event.target.className.indexOf(this.GeneratedClass) == -1) {
            this.Dom.InputInFocus = false;
            this.Changed.emit(this.Value);

            // Remove
            this.syncEvent.RemoveEvent('click');
            this.syncEvent.RemoveEvent('keyup');
        }
    }

    /**
     *
     * @param event
     * @constructor
     */
    HandleKeyUp(event) {
        switch (event.keyCode) {
            case 27:
                this.Dom.InputInFocus = false;
                this.changeDetect.detectChanges();

                this.Value = this.Text;

                this.syncEvent.RemoveEvent('click');
                this.syncEvent.RemoveEvent('keyup');
                break;
            case 13:
                this.Dom.InputInFocus = false;
                this.changeDetect.detectChanges();

                this.Changed.emit(this.Value);
                this.Text = this.Value;

                this.syncEvent.RemoveEvent('click');
                this.syncEvent.RemoveEvent('keyup');
                break;
        }
    }

    /**
     *
     * @constructor
     */
    InputKeyEvent(event) {
        switch (event.keyCode) {
            case 9:
                event.preventDefault();

                this.TabEvent.emit(event.shiftKey);
                this.changeDetect.detectChanges();
                break;
        }
    };
}
