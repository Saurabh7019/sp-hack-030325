import * as React from 'react';
import styles from './FeedbackForm.module.scss';
import type { IFeedbackFormProps } from './IFeedbackFormProps';

export const FeedbackForm: React.FC<IFeedbackFormProps> = ({
    feedbackData,
    successMessage,
    errorMessage,
    onInputChange,
    onSendFeedback,
}) => {

    return (
        <div className={styles.feedbackFormContainer}>
            <div className={styles.feedbackForm}>
                <select
                    id="category"
                    name="category"
                    title="category"
                    value={feedbackData.category}
                    onChange={onInputChange}
                >
                    <option value="Feedback">Feedback</option>
                    <option value="Bug">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                </select>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter a title"
                    autoComplete="off"
                    value={feedbackData.title}
                    onChange={onInputChange}
                />
                <textarea
                    id="message"
                    name="message"
                    className={styles.comment}
                    value={feedbackData.message}
                    placeholder="Enter your feedback"
                    onChange={onInputChange}
                />
            </div>

            {successMessage && <div className={styles.successText}>{successMessage}</div>}
            {errorMessage && <div className={styles.errorText}>{errorMessage}</div>}

            <button type="button" onClick={onSendFeedback} className={styles.feedbackBtn}>
                Submit
            </button>
        </div>
    )
}
