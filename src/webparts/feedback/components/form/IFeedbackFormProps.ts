import { ChangeEvent } from 'react';

export interface IFeedbackFormProps {
    feedbackData: {
        title: string;
        category: string;
        message: string;
    };
    successMessage?: string;
    errorMessage?: string;
    onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onSendFeedback: () => Promise<void>;
}