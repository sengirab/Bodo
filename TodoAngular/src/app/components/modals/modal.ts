export enum ModalTypes {
    Modal
}
export class PlatformModal {
    constructor(public data: { component: any, inputs: any, title: any }, public modalType: ModalTypes = ModalTypes.Modal) {
    }
}
