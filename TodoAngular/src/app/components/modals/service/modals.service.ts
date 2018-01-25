import {EventEmitter, Injectable, InjectionToken} from '@angular/core';
import {PlatformModal} from '../modal';

@Injectable()
export class ModalsService {
    Modal: PlatformModal = null;
    ModalListener: EventEmitter<PlatformModal> = new EventEmitter();
    CurrentTokens: { [value: string]: InjectionToken<any> } = {};

    Overlay: boolean = false;

    constructor() {
    }

    /**
     *
     * @param modal
     */
    AddModal(modal: PlatformModal) {
        ModalsService.DisableScroll();

        this.Modal = modal;
        this.ModalListener.emit(this.Modal);
    }

    /**
     *
     */
    RemoveModal() {
        this.Modal = null;
        this.CurrentTokens = {};

        this.ModalListener.emit(this.Modal);
        ModalsService.EnableScroll();
    }

    /**
     *
     * @constructor
     */
    TriggerOverlay() {
        this.Overlay = !this.Overlay;

        if(this.Overlay) {
            ModalsService.DisableScroll();
        } else {
            ModalsService.EnableScroll();
        }

        this.ModalListener.emit(null);
    }

    /**
     *
     */
    private static DisableScroll() {
        // Check if mobile device or tablet
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            document.querySelector('body').setAttribute('style', 'overflow:hidden;');
        } else {
            document.querySelector('body').setAttribute('style', 'overflow:hidden; padding-right:0px;');
        }
    }

    /**
     *
     */
    private static EnableScroll() {
        // Check if mobile device or tablet
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            document.querySelector('body').setAttribute('style', 'overflow-x:hidden;');
        } else {
            document.querySelector('body').setAttribute('style', 'overflow-x:hidden; padding-right:0;');
        }
    }
}
