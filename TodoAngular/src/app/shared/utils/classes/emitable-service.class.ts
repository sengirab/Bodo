import {Subject} from 'rxjs/Subject';

export abstract class EmitableService {

    Emitter: Subject<any> = new Subject();
    abstract Emitables;

    constructor() {
    }

    /**
     *
     * @constructor
     */
    Emit<O, K extends keyof O>(Emitables: O, ...keys: K[]) {
        let object = Object.create({});

        keys.forEach((key) => {
            object[key] = Emitables[key];
        });

        this.Emitter.next(object)
    }
}
