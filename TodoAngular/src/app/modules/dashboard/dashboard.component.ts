import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

    List: {Id: string, Name: string} = null;

    constructor() {
    }

    ngOnInit() {
    }

    /**
     *
     * @constructor
     */
    SelectList(List: {Id: string, Name: string}) {
        this.List = List
    }
}
