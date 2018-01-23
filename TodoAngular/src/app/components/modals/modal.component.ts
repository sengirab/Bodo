import {Component, OnInit} from '@angular/core';
import {PlatformModal} from './modal';
import {ModalsService} from './service/modals.service';
import {animate, style, transition, trigger} from '@angular/animations';


@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    animations: [
        trigger('fromTop', [
            transition(':enter', [
                style({
                    transform: 'translateY(-100%)',
                }),
                animate('600ms cubic-bezier(0.19, 1, 0.22, 1)', style({
                    transform: 'translateY(0)'
                }))
            ]),
            transition(':leave', [
                style({
                    transform: 'translateY(0)',
                }),
                animate('600ms cubic-bezier(0.19, 1, 0.22, 1)', style({
                    transform: 'translateY(-100%)'
                }))
            ])
        ]),
        trigger('fadeIn', [
            transition(':enter', [
                style({
                    opacity: '0',
                }),
                animate('600ms cubic-bezier(0.19, 1, 0.22, 1)', style({
                    opacity: '1',
                }))
            ]),
            transition(':leave', [
                style({
                    opacity: '1',
                }),
                animate('600ms cubic-bezier(0.19, 1, 0.22, 1)', style({
                    opacity: '0',
                }))
            ])
        ])
    ],
})
export class ModalComponent implements OnInit {

    Modal: PlatformModal = null;

    constructor(private modals: ModalsService) {

    }

    /**
     *
     */
    ngOnInit() {
        this.modals.ModalListener.subscribe((modal) => {
            this.Modal = modal;
        })
    }
}
