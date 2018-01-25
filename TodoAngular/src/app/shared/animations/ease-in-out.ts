import {animate, style, transition, trigger} from '@angular/animations';

export const easeInOut = trigger('easeInOut', [
    transition(':enter', [
        style({
            height: 0,
            width: '100%',
            overflow: 'hidden'
        }),
        animate('500ms cubic-bezier(0.19, 1, 0.22, 1)', style({
            overflow: 'hidden',
            height: 45
        }))
    ]),
    transition(':leave', [
        style({
            overflow: 'hidden',
            height: 45,
            width: '100%'
        }),
        animate('500ms cubic-bezier(0.19, 1, 0.22, 1)', style({
            overflow: 'hidden',
            height: 0
        }))
    ])
]);
