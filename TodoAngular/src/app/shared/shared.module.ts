import {NgModule}                         from '@angular/core';
import {CommonModule}                     from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule}                     from '@angular/router';

import {CapitalizePipe}                   from './pipes/capitalize.pipe';
import {EditInputComponent}               from './components/edit-input.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        //
        EditInputComponent,
        //
        CapitalizePipe
    ],
    declarations: [
        //
        EditInputComponent,
        //
        CapitalizePipe,
    ]
})
export class SharedModule {
}
