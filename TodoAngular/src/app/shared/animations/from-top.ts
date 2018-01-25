import {animate, style, transition, trigger} from '@angular/animations';

export const fromTop = trigger('fromTop', [
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
]);
