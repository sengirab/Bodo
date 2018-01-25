import {animate, style, transition, trigger} from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
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
]);
