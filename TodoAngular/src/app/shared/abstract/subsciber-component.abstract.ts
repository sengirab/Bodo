import {OnInit} from '@angular/core';

import {EmitableService} from '../utils/classes/emitable-service.class';

export class SubscriberComponent<T> implements OnInit {

    Fillables: T = this.service.Emitables;
    SubscribeFunctions: {[name: string]: () => any} = {};

    constructor(private service: EmitableService) {
    }

    /**
     * Always call super.ngOnInit in extending class.
     */
    ngOnInit() {
        this.Subscribe();
    }

    /**
     *
     * @constructor
     */
    Subscribe() {
        this.service.Emitter.subscribe((obj) => {
            for (let key in obj) {
                if(!obj.hasOwnProperty(key)) continue;

                if(typeof this.Fillables[key] !== 'undefined') {
                    this.Fillables[key] = obj[key];
                }
            }

            this.DoFunctions();
        })
    }

    /**
     *
     * @constructor
     */
    DoFunctions() {
        for (let key in this.SubscribeFunctions) {
            if(!this.SubscribeFunctions.hasOwnProperty(key)) continue;

            this.SubscribeFunctions[key]()
        }

    }
}
