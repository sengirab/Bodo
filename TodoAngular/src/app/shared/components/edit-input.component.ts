import {Component, ElementRef, Input, OnInit} from '@angular/core';

import {Guid} from '../../utils/uuid';

@Component({
    selector: 'app-edit-input',
    templateUrl: './edit-input.component.html'
})
export class EditInputComponent implements OnInit {
    @Input() Text: string = '';

    GeneratedClass = `input-${Guid()}`;
    Dom = {
        InputInFocus: false
    };

    constructor(private element: ElementRef) {
    }

    /**
     *
     */
    ngOnInit() {
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
            document.addEventListener('click', function _func(event: any) {

                if (!that.element.nativeElement.contains(event.target) && event.target.className.indexOf(that.GeneratedClass) == -1) {
                    that.Dom.InputInFocus = false;

                    // Remove
                    document.removeEventListener('click', _func);
                }
            });
        }
    }
}
