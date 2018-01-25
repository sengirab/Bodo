import {Component, OnInit}                   from '@angular/core';
import {PlatformModal}                       from './modal';
import {ModalsService}                       from './service/modals.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {fadeIn}                              from '../../shared/animations/fade-in';
import {fromTop}                             from '../../shared/animations/from-top';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    animations: [
        fromTop,
        fadeIn
    ],
})
export class ModalComponent implements OnInit {

    Modal: PlatformModal = null;
    TriggerOverlay: boolean = false;

    constructor(private modals: ModalsService) {

    }

    /**
     *
     */
    ngOnInit() {
        this.modals.ModalListener.subscribe((modal) => {
            this.Modal = modal;

            this.TriggerOverlay = this.modals.Overlay;
        })
    }
}
