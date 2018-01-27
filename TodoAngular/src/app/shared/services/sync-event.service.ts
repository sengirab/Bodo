import {Injectable} from '@angular/core';

export interface Handler {
    Events: Array<(event: any) => void>;
    Handler: (event: any) => void
}

function HandlerFunction(ctx: SyncEventService, name: string) {
    let that = ctx;

    return function DoEvent(event) {
        that.DoEvent(name, event)
    }
}

@Injectable()
export class SyncEventService {
    Events: { [value: string]: Handler } = {};

    constructor() {
    }

    /**
     *
     * @param {string} name
     * @param event
     * @constructor
     */
    DoEvent(name: string, event: any) {
        this.Events[name].Events[this.Events[name].Events.length - 1](event);
    }

    /**
     *
     * @param {string} name
     * @param {(event: any) => void} func
     * @constructor
     */
    AddEvent(name: string, func: (event: any) => void) {
        if (typeof this.Events[name] === 'undefined') {
            this.Events[name] = {
                Events: [func],
                Handler: null
            };

            this.registerListener(name);

            return;
        }

        this.Events[name].Events.push(func);
    }

    /**
     *
     * @param {string} name
     * @param {(event: any) => void} func
     * @constructor
     */
    RemoveEvent(name: string, func: (event: any) => void) {
        this.Events[name].Events = this.Events[name].Events.filter(f => f.toString() !== func.toString());

        this.removeListener(name);
    }

    /**
     *
     * @param {string} name
     */
    private registerListener(name: string) {
        this.Events[name].Handler = HandlerFunction(this, name);

        document.addEventListener(name, this.Events[name].Handler);
    }


    /**
     *
     * @param {string} name
     */
    private removeListener(name: string) {
        if(this.Events[name].Events.length > 0) {
            return
        }

        document.removeEventListener(name, this.Events[name].Handler);
        delete this.Events[name];
    }
}
