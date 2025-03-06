import * as React from 'react';
import { ChangeEvent } from 'react';
import styles from './Feedback.module.scss';
import { Icon } from '@fluentui/react/lib/Icon';
import type { IFeedbackProps } from './IFeedbackProps';
import type { IFeedbackState } from './IFeedbackState';
import { Panel, PanelType } from '@fluentui/react';
import { FeedbackForm } from './form/FeedbackForm';
import { ComponentPreferences } from './preferences/ComponentPreferences';
import { FeedbackService } from './FeedbackService';

export default class Feedback extends React.Component<IFeedbackProps, IFeedbackState> {
  private _service: FeedbackService;

  constructor(props: IFeedbackProps) {
    super(props);

    this.state = {
      isOpen: false,
      feedbackData: {
        title: '',
        category: 'Feedback',
        message: '',
      },
      successMessage: undefined,
      errorMessage: undefined,
      feedbackComponents: [],
      componentReactions: {
        Id: 0,
        SC_WelcomeCard: '',
        SC_GuidedTour: '',
        SC_IntranetFeedback: '',
        SC_NewsSlider: '',
        SC_CompanyFeed: '',
        SC_MyFeed: '',
        SC_Vision: '',
        SC_UpcomingEvents: '',
        SC_MeetupRecordings: '',
        SC_VivaDashboard: '',
        SC_PersonalDashboard: '',
      }
    }

    this._service = new FeedbackService();
  }

  private _setPanelState = (isOpen: boolean): void => {
    this.setState({ isOpen, successMessage: undefined, errorMessage: undefined });
  };

  private _openPanel = async (): Promise<void> => {
    const [feedbackComponents, componentReactions] = await Promise.all([
      this._service.getFeedbackComponents(),
      this._service.getMyFeedbackReaction(),
    ]);

    this.setState({
      feedbackComponents,
      componentReactions,
    });

    this._setPanelState(true);
  };

  private _dismissPanel = (): void => {
    this._setPanelState(false);
  };

  public render(): React.ReactElement<IFeedbackProps> {
    const { isOpen, feedbackData, successMessage, errorMessage, feedbackComponents, componentReactions } = this.state;

    return (
      <section id='feedbackSection' className={styles.feedback}>
        <Icon iconName="Feedback" onClick={this._openPanel} className={styles.circleIcon} />
        <Panel
          type={PanelType.custom}
          customWidth={'350px'}
          headerText="Intranet Feedback"
          headerClassName={styles.panelHeaderText}
          isOpen={isOpen}
          onDismiss={this._dismissPanel}
          closeButtonAriaLabel="Close"
        >
          <span className={styles.noteText}>Welcome! We value your feedback. Feel free to share your thoughts, ideas, or report issues to help us improve your experience.</span>

          <FeedbackForm
            feedbackData={feedbackData}
            successMessage={successMessage}
            errorMessage={errorMessage}
            onInputChange={this._handleChange}
            onSendFeedback={this._sendFeedback}
          />

          <div className={styles.panelSubHeaderText}>
            Share your preferences
          </div>
          <span className={styles.noteText}>Express your preferences with a simple thumbs up for what you like and a thumbs down for what you dislike.</span>
          <ComponentPreferences
            feedbackComponents={feedbackComponents}
            componentReactions={componentReactions}
            updateFeedbackReaction={this._updateFeedbackReaction}
          />
        </Panel>
      </section>
    );
  }

  private _handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;

    this.setState(prevState => ({
      feedbackData: { ...prevState.feedbackData, [name]: value },
      successMessage: undefined,
      errorMessage: undefined,
    }));
  };

  private _sendFeedback = async (): Promise<void> => {
    const { title, category, message } = this.state.feedbackData;

    // Check if required fields are empty
    if (!title.trim() || !message.trim()) {
      this.setState({
        successMessage: undefined,
        errorMessage: 'Please provide both a title and feedback before submitting.',
      });
      return;
    }

    // Add feedback item to the SharePoint list
    await this._service.sendFeedback(title, category, message);

    // Clear input fields and set success message upon successful submission
    this.setState({
      feedbackData: { title: '', category: 'Feedback', message: '' },
      successMessage: 'Feedback submitted successfully.',
      errorMessage: undefined,
    });
  };

  private _updateFeedbackReaction = async (reactionType: 'Like' | 'Dislike', componentInternalName: string): Promise<void> => {
    const { Id } = this.state.componentReactions;

    let updatedComponentReactions = { ...this.state.componentReactions };
    updatedComponentReactions = {
      ...updatedComponentReactions,
      [componentInternalName]: reactionType,
    };

    if (Id > 0) {
      await this._service.updateFeedbackReaction(
        Id,
        reactionType,
        componentInternalName
      );

      // Update the state with the modified componentReactions object
      this.setState({
        componentReactions: updatedComponentReactions,
      });

    } else {
      const newId = await this._service.addFeedbackReaction(
        reactionType,
        componentInternalName
      );
      this.setState(prevState => ({
        componentReactions: { ...prevState.componentReactions, Id: newId },
      }));
    }
  }
}
