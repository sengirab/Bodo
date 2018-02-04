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

// Sync handler service always handles the last event that was passed in.
// This means that as soon as an event has been handled,
// It needs to be removed by the user himself, or else the last event  passed in will,
// keep firing on that specific event type e.g keyup, click, etc.
// Service accepts anonymous function since it always handles the last event passed in.

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
        setTimeout(() => {
            if (typeof this.Events[name] === 'undefined') {
                this.Events[name] = {
                    Events: [func],
                    Handler: null
                };

                this.registerListener(name);
                return;
            }
                this.Events[name].Events.push(func);
        }, 0)
    }

    /**
     *
     * @param {string} name
     * @constructor
     */
    RemoveEvent(name: string) {
        // Since we always handle the last event, we can just pop.
        this.Events[name].Events.pop();

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
