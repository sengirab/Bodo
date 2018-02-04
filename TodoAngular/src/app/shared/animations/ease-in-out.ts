import {animate, style, transition, trigger} from '@angular/animations';

export const easeInOut = trigger('easeInOut', [
    transition(':enter', [
        style({
            height: 0,
            width: '100%',
            display: 'block',
            overflow: 'hidden'
        }),
        animate('200ms ease-in', style({
            overflow: 'hidden',
            display: 'block',
            height: 50
        }))
    ]),
    transition(':leave', [
        style({
            overflow: 'hidden',
            display: 'block',
            height: 50,
            width: '100%'
        }),
        animate('200ms ease-out', style({
            overflow: 'hidden',
            display: 'block',
            height: 0
        }))
    ])
]);
