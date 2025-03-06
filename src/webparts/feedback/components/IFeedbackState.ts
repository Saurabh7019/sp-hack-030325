import { IFeedbackComponents, IFeedbackComponentsReaction } from './IFeedbackItem';

export interface IFeedbackState {
    isOpen: boolean;
    feedbackData: IFormData;
    successMessage: string | undefined;
    errorMessage: string | undefined;
    feedbackComponents: IFeedbackComponents[];
    componentReactions: IFeedbackComponentsReaction;
}

interface IFormData {
    title: string;
    category: string;
    message: string;
}