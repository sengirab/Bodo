import {NgModule}                         from '@angular/core';
import {CommonModule}                     from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule}                     from '@angular/router';

import {CapitalizePipe}                             from './pipes/capitalize.pipe';
import {EditInputComponent}                         from './components/edit-input.component';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import { DateTimeComponent } from './components/date-time.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        //
        EditInputComponent,
        DateTimeComponent,
        //
        CapitalizePipe
    ],
    declarations: [
        //
        EditInputComponent,
        DateTimeComponent,
        //
        CapitalizePipe,
    ]
})
export class SharedModule {
}
