export interface ITourItem {
    title: string;
    description: string;
    selector: string;
    controlId: string;
    order: number;    
    isActive: boolean;
}

export interface ISteps {
    selector: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    placement?: any;
    content: string;
    order: number;
    disableBeacon: boolean;
}