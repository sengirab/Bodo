import {Component, ComponentFactoryResolver, InjectionToken, Input, ReflectiveInjector, ViewChild, ViewContainerRef} from '@angular/core';

import {ModalTypes, PlatformModal} from '../../modal';
import {ModalsService} from '../../service/modals.service';
import {ListModalComponent} from '../list-modal/list-modal.component';

@Component({
    selector: 'app-dynamic-modal',
    templateUrl: './dynamic-modal.component.html',
    entryComponents: [
        ListModalComponent
    ],
})
export class DynamicModalComponent {
    @ViewChild('container', {read: ViewContainerRef}) Container: ViewContainerRef;

    CurrentComponent = null;
    Data: PlatformModal;
    Type: string;

    constructor(public modals: ModalsService, private resolver: ComponentFactoryResolver) {
    }

    /**
     *
     * @param {PlatformModal} Data
     * @constructor
     */
    @Input() set Modal(Data: PlatformModal) {
        if (!Data) return;

        this.Data = Data;
        this.Type = ModalTypes[Data.modalType];

        const inputProviders = Object.keys(Data.data.inputs).map((inputName) => {
            this.modals.CurrentTokens[inputName] = new InjectionToken<any>(inputName);

            return {
                provide: this.modals.CurrentTokens[inputName],
                useValue: Data.data.inputs[inputName]
            };
        });

        let resolvedInputs = ReflectiveInjector.resolve(inputProviders);
        let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.Container.parentInjector);

        const factory = this.resolver.resolveComponentFactory(Data.data.component);
        const component = factory.create(injector);

        this.Container.insert(component.hostView);

        if (this.CurrentComponent !== null) {
            this.CurrentComponent.destroy();
        }

        this.CurrentComponent = component;
    }
}
