import * as React from 'react';
import styles from './WelcomeCard.module.scss';
import type { IWelcomeCardProps } from './IWelcomeCardProps';
import type { IWelcomeCardState } from './IWelcomeCardState';
import { IWelcomeCardService } from '../services/IWelcomeCardService';
import { WelcomeCardService } from '../services/WelcomeCardService';
import { escape } from '@microsoft/sp-lodash-subset';
import { Shimmer, ThemeProvider, mergeStyles } from '@fluentui/react';

const wrapperClass = mergeStyles({
  padding: 2,
  selectors: {
    '& > .ms-Shimmer-container': {
      margin: '10px 0',
    },
  },
});

export default class WelcomeCard extends React.Component<IWelcomeCardProps, IWelcomeCardState> {
  private _wcServiceInstance: IWelcomeCardService;
  private defaultProfilePictureUrl = '/_layouts/15/userphoto.aspx?size=S';

  constructor(props: IWelcomeCardProps) {
    super(props);

    const {
      serviceScope
    } = props;

    this.state = {
      profilePhotoUrl: undefined,
      lastPasswordChangeDate: '',
      summaries: {
        emailSummary: '',
        eventSummary: ''
      }
    }

    this._wcServiceInstance = new WelcomeCardService(serviceScope);
  }

  public async componentDidMount(): Promise<void> {
    const profilePhotoUrl = await this._wcServiceInstance.getProfilePhoto();
    const lastPasswordChangeDate = await this._wcServiceInstance.getLastPasswordChangeDate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const summaries: any = await this._wcServiceInstance.getSummary(this.props.SummaryApiEndpoint);

    this.setState(
      {
        profilePhotoUrl,
        lastPasswordChangeDate,
        summaries: {
          emailSummary: summaries.emailSummary,
          eventSummary: summaries.eventSummary
        }
      }
    );
  }

  public render(): React.ReactElement<IWelcomeCardProps> {
    const {
      isDarkTheme,
      hasTeamsContext,
      userDisplayName,
      userEmail,
      tenantName
    } = this.props;

    const delveUrl = `https://${tenantName}-my.sharepoint.com/_layouts/15/me.aspx/?p=${userEmail}&v=work`;

    const hour = new Date().getHours();
    const greeting =
      hour < 12 ? "Good morning" :
        hour < 18 ? "Good afternoon" :
          "Good evening";

    return (
      <section id='welcomeCard' className={`${styles.welcomeCard} ${hasTeamsContext ? styles.teams : ''}`}>

        <div className={styles.welcomeMessage} style={{ color: isDarkTheme ? 'white' : 'black' }}>
          {escape(greeting)}, {escape(userDisplayName)}!
        </div>
        <div className={styles.container}>
          <div className={styles.profile}>
            <a href={delveUrl} target='_blank' rel='noreferrer'>
              <img src={this.state.profilePhotoUrl || this.defaultProfilePictureUrl} alt={`Profile Picture for ${userDisplayName}`} className={styles.profilePicture} />
            </a>
          </div>

          <div className={styles.info}>
            <div className={styles.textContent} style={{ color: isDarkTheme ? 'white' : 'black', display: 'none' }}>
              You last changed your password on {this.state.lastPasswordChangeDate}.
              Would you like to <a href="https://account.activedirectory.windowsazure.com/ChangePassword.aspx">Reset</a> it now for enhanced security?
            </div>

            <h3>Email Summary</h3>
            <p>
              {this.state.summaries.emailSummary ? (
                <span dangerouslySetInnerHTML={{ __html: this.state.summaries.emailSummary }} />
              ) : (
                <ThemeProvider className={wrapperClass}>
                  <Shimmer width="90%" />
                  <Shimmer width="70%" />
                </ThemeProvider>
              )}
            </p>

            <h3>Upcoming Events</h3>
            <p>
              {this.state.summaries.eventSummary ? (
                <span dangerouslySetInnerHTML={{ __html: this.state.summaries.eventSummary }} />
              ) : (
                <ThemeProvider className={wrapperClass}>
                  <Shimmer width="70%" />
                  <Shimmer width="90%" />
                </ThemeProvider>
              )}
            </p>
          </div>

          {/* <div className={styles.info}>
            <div className={styles.textContent} style={{ color: isDarkTheme ? 'white' : 'black' }}>
              You last changed your password on {this.state.lastPasswordChangeDate}.
              Would you like to <a href="https://account.activedirectory.windowsazure.com/ChangePassword.aspx">Reset</a> it now for enhanced security?
            </div>
          </div> */}

          <div className={styles.permissions}>
            <p>Permissions are success..</p>
          </div>
        </div>

      </section>
    );
  }
}