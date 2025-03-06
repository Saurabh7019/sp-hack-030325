import { ITourItem, ISteps } from './ITourItem';

export interface IGuideSiteTourState {
    items: ITourItem[];
    steps: ISteps[];
    isTourActive: boolean;
    stepIndex: number; 
    checked: boolean | undefined;
}