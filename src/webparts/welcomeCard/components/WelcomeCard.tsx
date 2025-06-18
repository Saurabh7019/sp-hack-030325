import * as React from 'react';
import styles from './WelcomeCard.module.scss';
import type { IWelcomeCardProps } from './IWelcomeCardProps';
import type { IWelcomeCardState } from './IWelcomeCardState';
import { IWelcomeCardService } from '../services/IWelcomeCardService';
import { WelcomeCardService } from '../services/WelcomeCardService';
import { escape } from '@microsoft/sp-lodash-subset';
import {
  Shimmer,
  ThemeProvider,
  mergeStyles,
  mergeStyleSets,
  Callout,
  ActivityItem,
  Link,
  css,
  ActionButton,
  IIconProps
} from '@fluentui/react';
import { Icon } from '@fluentui/react/lib/Icon';

const addFriendIcon: IIconProps = { iconName: 'AddLink', style: { color: 'white' } };

const wrapperClass = mergeStyles({
  padding: 2,
  selectors: {
    '& > .ms-Shimmer-container': {
      margin: '10px 0',
    },
  }
});

const classNames = mergeStyleSets({
  exampleRoot: {
    marginTop: '20px',
    borderBottom: '1px solid #f3f2f1',
    paddingBottom: '5px',
  },
  nameText: {
    fontWeight: 'bold',
  },
});

const activityItemExamples = [
  {
    key: 1,
    activityDescription: [
      <div className={styles.activityDescriptionWrapper} key={1}>
        <Link
          className={classNames.nameText}
          onClick={() => {
            alert('A name was clicked.');
          }}
        >
          Local Work
        </Link>
        <Icon iconName="Cancel" className={styles.closeIcon} />
      </div>
    ],
    activityIcon: <Icon iconName={'DocumentSet'} />,
    comments: [
      <span key={1}>Permissions are successfully updated to your app Local Work in Access wording check. </span>,
    ],
    timeStamp: 'Just now',
  },
  {
    key: 2,
    activityDescription: [
      <div className={styles.activityDescriptionWrapper} key={1}>
        <Link
          className={classNames.nameText}
          onClick={() => {
            alert('A name was clicked.');
          }}
        >
          Maconomy
        </Link>
        <Icon iconName="Cancel" className={styles.closeIcon} />
      </div>
    ],
    activityIcon: <Icon iconName={'Money'} />,
    comments: [
      <span key={1}>Your invoice #45678 has been processed. Click </span>,
      <Link
        key={2}
        className={classNames.nameText}
        onClick={() => {
          alert('An @mentioned name was clicked.');
        }}
      >
        here
      </Link>,
      <span key={3}> to review the details.</span>,
    ],
    timeStamp: '5 minutes ago',
  },
  {
    key: 3,
    activityDescription: [
      <div className={styles.activityDescriptionWrapper} key={1}>
        <Link
          className={classNames.nameText}
          onClick={() => {
            alert('A name was clicked.');
          }}
        >
          Maconomy
        </Link>
        <Icon iconName="Cancel" className={styles.closeIcon} />
      </div>
    ],
    activityIcon: <Icon iconName={'Warning'} />,
    comments: [
      <span key={1}>Approval required for expense report #78901. Click </span>,
      <Link
        key={2}
        className={classNames.nameText}
        onClick={() => {
          alert('An @mentioned name was clicked.');
        }}
      >
        here
      </Link>,
      <span key={3}> to review and approve.</span>,
    ],
    timeStamp: '10 minutes ago',
  },
  {
    key: 4,
    activityDescription: [
      <div className={styles.activityDescriptionWrapper} key={1}>
        <Link
          className={classNames.nameText}
          onClick={() => {
            alert('A name was clicked.');
          }}
        >
          IFS
        </Link>
        <Icon iconName="Cancel" className={styles.closeIcon} />
      </div>
    ],
    activityIcon: <Icon iconName={'CheckMark'} />,
    comments: [
      <span key={1}>Your purchase order #12345 has been approved. Click </span>,
      <Link
        key={2}
        className={classNames.nameText}
        onClick={() => {
          alert('An @mentioned name was clicked.');
        }}
      >
        here
      </Link>,
      <span key={3}> to view the details.</span>,
    ],
    timeStamp: '15 minutes ago',
  },
  {
    key: 5,
    activityDescription: [
      <div className={styles.activityDescriptionWrapper} key={1}>
        <Link
          className={classNames.nameText}
          onClick={() => {
            alert('A name was clicked.');
          }}
        >
          SAP Concur
        </Link>
        <Icon iconName="Cancel" className={styles.closeIcon} />
      </div>
    ],
    activityIcon: <Icon iconName={'Money'} />,
    comments: [
      <span key={1}>Your travel expense claim has been submitted for review. Click </span>,
      <Link
        key={2}
        className={classNames.nameText}
        onClick={() => {
          alert('An @mentioned name was clicked.');
        }}
      >
        here
      </Link>,
      <span key={3}> to track the status.</span>,
    ],
    timeStamp: '30 minutes ago',
  }
];

// categories scrollable fading
const cssClassesCategories = css(styles.categories, styles.scrollable);
const cssClassesFavorites = css(styles.favorites, styles.scrollable);

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
      },
      isCalloutVisible: false,
      isAddFavoriteCalloutVisible: false,
      isCustomLinkFormVisible: false
    }

    this._wcServiceInstance = new WelcomeCardService(serviceScope);
  }

  private toggleIsCalloutVisible = (): void => {
    this.setState({ isCalloutVisible: !this.state.isCalloutVisible });
  }

  private toggleIsAddFavoriteCalloutVisible = (): void => {
    this.setState({ isAddFavoriteCalloutVisible: !this.state.isAddFavoriteCalloutVisible });
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

  private toggleCustomLinkForm = (): void => {
    this.setState({ isCustomLinkFormVisible: !this.state.isCustomLinkFormVisible });
  };

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
          <div id='profilePicture' className={styles.profile}>
            <a href={delveUrl} target='_blank' rel='noreferrer'>
              <img src={this.state.profilePhotoUrl || this.defaultProfilePictureUrl} alt={`Profile Picture for ${userDisplayName}`} className={styles.profilePicture} />
            </a>
          </div>

          <div className={styles.info}>
            <div className={styles.textContent} style={{ color: 'black' }}>
              You last changed your password on <span style={{ fontWeight: 'bold' }}>{this.state.lastPasswordChangeDate}</span>.
              Would you like to <a href="https://account.activedirectory.windowsazure.com/ChangePassword.aspx">Reset</a> it now?
            </div>

            <span id='emailSummary'>
              <div className={styles.summaryHeader}>
                <Icon iconName="Mail" className={styles.summaryIcon} />
                <h3>Email summary</h3>
              </div>
              <p className={styles.summaryContainer} style={{ color: 'black' }}>
                {this.state.summaries.emailSummary ? (
                  <span dangerouslySetInnerHTML={{ __html: this.state.summaries.emailSummary }} />
                ) : (
                  <ThemeProvider className={wrapperClass}>
                    <Shimmer width="90%" />
                    <Shimmer width="70%" />
                  </ThemeProvider>
                )}
              </p>
            </span>

            <span id='eventSummary'>
              <div className={styles.summaryHeader}>
                <Icon iconName="Calendar" className={styles.summaryIcon} />
                <h3>Upcoming events</h3>
              </div>
              <p className={styles.summaryContainer} style={{ color: 'black' }}>
                {this.state.summaries.eventSummary ? (
                  <span dangerouslySetInnerHTML={{ __html: this.state.summaries.eventSummary }} />
                ) : (
                  <ThemeProvider className={wrapperClass}>
                    <Shimmer width="70%" />
                    <Shimmer width="90%" />
                  </ThemeProvider>
                )}
              </p>
            </span>
          </div>

          <div className={styles.permissions} style={{ color: 'black' }}>
            <p>Permissions are successful...
              <span className={styles.iconContainer} id="ringerIcon" onClick={this.toggleIsCalloutVisible}>
                <Icon iconName="Ringer" />
                <span className={styles.badge}>5</span>
              </span>
            </p>
            <div className={styles.quickLinks}>
              <div className={styles.quickLinkItem} id="addFavoriteIcon" onClick={this.toggleIsAddFavoriteCalloutVisible}>
                <Icon iconName="AddFavorite" className={styles.appIconCircleFav} style={{ color: "darkblue" }} />
                <span style={{ color: "darkblue", fontWeight: 'bold' }}>Add Favorite</span>
              </div>
              <div className={styles.quickLinkItem}>
                <Icon iconName="DocumentSet" className={styles.appIconCircleFav} />
                <span>Time reporting</span>
              </div>
              <div className={styles.quickLinkItem}>
                <Icon iconName="OfficeAssistantLogo" className={styles.appIconCircleFav} />
                <span>Microsoft 365</span>
              </div>
              <div className={styles.quickLinkItem}>
                <Icon iconName="SharepointLogo" className={styles.appIconCircleFav} />
                <span>HR Hub</span>
              </div>
              <div className={styles.quickLinkItem}>
                <Icon iconName="TaskLogo" className={styles.appIconCircleFav} />
                <span>Trello</span>
              </div>
              <div className={styles.quickLinkItem}>
                <Icon iconName="LearningTools" className={styles.appIconCircleFav} />
                <span>LinkedIn Learning</span>
              </div>
              <div className={styles.quickLinkItem}>
                <Icon iconName="Money" className={styles.appIconCircleFav} />
                <span>SAP Concur</span>
              </div>
            </div>
          </div>

          {this.state.isCalloutVisible && (
            <Callout
              className={styles.callout}
              role="dialog"
              gapSpace={0}
              target="#ringerIcon"
              onDismiss={this.toggleIsCalloutVisible}
              setInitialFocus
            >
              {activityItemExamples.map((item: { key: string | number }) => (
                <ActivityItem {...item} key={item.key} className={classNames.exampleRoot} />
              ))}
            </Callout>
          )}

          {this.state.isAddFavoriteCalloutVisible && (
            <Callout
              className={styles.calloutQuickLink}
              role="dialog"
              gapSpace={0}
              target="#addFavoriteIcon"
              onDismiss={this.toggleIsAddFavoriteCalloutVisible}
              setInitialFocus
            >
              <div className={styles.appLauncherDropdown}>
                <div className={cssClassesCategories}>
                  <div className={styles.linedName}>Time, Travel & Expenses</div>
                  <div className={styles.categoryApps}>
                    <div role="button" aria-disabled="false" aria-roledescription="draggable"
                      className={styles.appButton}>
                      <a href="/ifs" target="_blank" rel="noreferrer" className={styles.app}>
                        <Icon iconName="DocumentSet" className={styles.appIconCircle} />
                        <div>
                          <div className={styles.titleAndStar}>
                            <div className={styles.titleApp}>Time reporting
                              <Icon iconName="FavoriteStarFill" className={styles.favoriteStarIcon} />
                            </div>
                          </div>
                          <div className={styles.descriptionApp}>Time reporting, business and management control</div>
                        </div>
                      </a>
                    </div>
                    <div role="button" aria-disabled="false" aria-roledescription="draggable"
                      className={styles.appButton}>
                      <a href="https://accounts.mycwt.com/sp/startSSO.ping?PartnerIdpId=https%3A%2F%2Fsts.windows.net%2F58af3eba-510e-4544-8cfd-85f5e0206382%2F" target="_blank" rel="noreferrer" className={styles.app}>
                        <Icon iconName="Airplane" className={styles.appIconCircle} />
                        <div>
                          <div className={styles.titleAndStar}>
                            <div className={styles.titleApp}>Travel Booking
                              <Icon iconName="FavoriteStar" className={styles.favoriteStarIcon} />
                            </div>
                          </div>
                          <div className={styles.descriptionApp}>Travel management and accommodation</div>
                        </div>
                      </a>
                    </div>
                    <div role="button" aria-disabled="false" aria-roledescription="draggable"
                      className={styles.appButton}>
                      <a href="https://account.activedirectory.windowsazure.com/applications/signin/de2fae87-0d6c-4ba5-aa19-88ba2dda235c?tenantId=58af3eba-510e-4544-8cfd-85f5e0206382" target="_blank" rel="noreferrer" className={styles.app}>
                        <Icon iconName="Money" className={styles.appIconCircle} />
                        <div>
                          <div className={styles.titleAndStar}>
                            <div className={styles.titleApp}>SAP Concur
                              <Icon iconName="FavoriteStarFill" className={styles.favoriteStarIcon} />
                            </div>
                          </div>
                          <div className={styles.descriptionApp}>Systems for expenses, travel, and AP processes</div>
                        </div>
                      </a>
                    </div>
                    <div role="button" aria-disabled="false" aria-roledescription="draggable" className={styles.appButton}>
                      <a href="https://www.expensify.com/" target="_blank" rel="noreferrer" className={styles.app}>
                        <Icon iconName="AllCurrency" className={styles.appIconCircle} />
                        <div>
                          <div className={styles.titleAndStar}>
                            <div className={styles.titleApp}>Expensify
                              <Icon iconName="FavoriteStar" className={styles.favoriteStarIcon} />
                            </div>
                          </div>
                          <div className={styles.descriptionApp}>Expense management and reporting</div>
                        </div>
                      </a>
                    </div>
                  </div>

                  <div className={styles.linedName}>Human Resources</div>
                  <div className={styles.categoryApps}>
                    <div role="button" aria-disabled="false" aria-roledescription="draggable"
                      className={styles.appButton}>
                      <a href="https://account.activedirectory.windowsazure.com/applications/signin/de2fae87-0d6c-4ba5-aa19-88ba2dda235c?tenantId=58af3eba-510e-4544-8cfd-85f5e0206382" target="_blank" rel="noreferrer" className={styles.app}>
                        <Icon iconName="AppIconDefaultList" className={styles.appIconCircle} />
                        <div>
                          <div className={styles.titleAndStar}>
                            <div className={styles.titleApp}>Sub-consultant app
                              <Icon iconName="FavoriteStar" className={styles.favoriteStarIcon} />
                            </div>
                          </div>
                          <div className={styles.descriptionApp}>Register a new internal or external sub-consultant</div>
                        </div>
                      </a>
                    </div>
                    <div role="button" aria-disabled="false" aria-roledescription="draggable"
                      className={styles.appButton}>
                      <a href="https://account.activedirectory.windowsazure.com/applications/signin/de2fae87-0d6c-4ba5-aa19-88ba2dda235c?tenantId=58af3eba-510e-4544-8cfd-85f5e0206382" target="_blank" rel="noreferrer" className={styles.app}>
                        <Icon iconName="ConnectContacts" className={styles.appIconCircle} />
                        <div>
                          <div className={styles.titleAndStar}>
                            <div className={styles.titleApp}>PeopleDoc Employee Portal
                              <Icon iconName="FavoriteStar" className={styles.favoriteStarIcon} />
                            </div>
                          </div>
                          <div className={styles.descriptionApp}>HR requests and employment documents</div>
                        </div>
                      </a>
                    </div>
                    <div role="button" aria-disabled="false" aria-roledescription="draggable" className={styles.appButton}>
                      <a href="https://www.workday.com/" target="_blank" rel="noreferrer" className={styles.app}>
                        <Icon iconName="WorkforceManagement" className={styles.appIconCircle} />
                        <div>
                          <div className={styles.titleAndStar}>
                            <div className={styles.titleApp}>Workday
                              <Icon iconName="FavoriteStar" className={styles.favoriteStarIcon} />
                            </div>
                          </div>
                          <div className={styles.descriptionApp}>HR and payroll management</div>
                        </div>
                      </a>
                    </div>
                    <div role="button" aria-disabled="false" aria-roledescription="draggable" className={styles.appButton}>
                      <a href="https://www.linkedin.com/learning/" target="_blank" rel="noreferrer" className={styles.app}>
                        <Icon iconName="LearningTools" className={styles.appIconCircle} />
                        <div>
                          <div className={styles.titleAndStar}>
                            <div className={styles.titleApp}>LinkedIn Learning
                              <Icon iconName="FavoriteStarFill" className={styles.favoriteStarIcon} />
                            </div>
                          </div>
                          <div className={styles.descriptionApp}>Professional development and training</div>
                        </div>
                      </a>
                    </div>
                    <div role="button" aria-disabled="false" aria-roledescription="draggable" className={styles.appButton}>
                      <a href="https://7566ava.sharepoint.com/" target="_blank" rel="noreferrer" className={styles.appSmall}>
                        <Icon iconName="SharepointLogo" className={styles.appIconCircle} />
                        <div>
                          <div className={styles.titleAndStar}>
                            <div className={styles.titleApp}>HR Hub
                              <Icon iconName="FavoriteStarFill" className={styles.favoriteStarIcon} />
                            </div>
                          </div>
                          <div className={styles.descriptionApp}>Find HR services and information</div>
                        </div>
                      </a>
                    </div>
                  </div>

                  <div className={styles.linedName}>Project Management</div>
                  <div className={styles.categoryApps}>
                    <div role="button" aria-disabled="false" aria-roledescription="draggable" className={styles.appButton}>
                      <a href="https://www.microsoft.com/en-us/microsoft-365/project/project-management-software" target="_blank" rel="noreferrer" className={styles.app}>
                        <Icon iconName="ProjectLogo32" className={styles.appIconCircle} />
                        <div>
                          <div className={styles.titleAndStar}>
                            <div className={styles.titleApp}>Microsoft Project
                              <Icon iconName="FavoriteStar" className={styles.favoriteStarIcon} />
                            </div>
                          </div>
                          <div className={styles.descriptionApp}>Project planning and management</div>
                        </div>
                      </a>
                    </div>
                    <div role="button" aria-disabled="false" aria-roledescription="draggable" className={styles.appButton}>
                      <a href="https://www.smartsheet.com/" target="_blank" rel="noreferrer" className={styles.app}>
                        <Icon iconName="TimeSheet" className={styles.appIconCircle} />
                        <div>
                          <div className={styles.titleAndStar}>
                            <div className={styles.titleApp}>SmartSheet
                              <Icon iconName="FavoriteStar" className={styles.favoriteStarIcon} />
                            </div>
                          </div>
                          <div className={styles.descriptionApp}>Collaborative work management</div>
                        </div>
                      </a>
                    </div>
                    <div role="button" aria-disabled="false" aria-roledescription="draggable" className={styles.appButton}>
                      <a href="https://www.asana.com/" target="_blank" rel="noreferrer" className={styles.app}>
                        <Icon iconName="TaskManager" className={styles.appIconCircle} />
                        <div>
                          <div className={styles.titleAndStar}>
                            <div className={styles.titleApp}>Asana
                              <Icon iconName="FavoriteStar" className={styles.favoriteStarIcon} />
                            </div>
                          </div>
                          <div className={styles.descriptionApp}>Task and project management</div>
                        </div>
                      </a>
                    </div>
                    <div role="button" aria-disabled="false" aria-roledescription="draggable" className={styles.appButton}>
                      <a href="https://www.trello.com/" target="_blank" rel="noreferrer" className={styles.app}>
                        <Icon iconName="TaskLogo" className={styles.appIconCircle} />
                        <div>
                          <div className={styles.titleAndStar}>
                            <div className={styles.titleApp}>Trello
                              <Icon iconName="FavoriteStarFill" className={styles.favoriteStarIcon} />
                            </div>
                          </div>
                          <div className={styles.descriptionApp}>Visual project management</div>
                        </div>
                      </a>
                    </div>
                  </div>

                </div>
                <div className={cssClassesFavorites}>
                  <div className={styles.linedName}>Favourites</div>
                  <div role="button" aria-disabled="false" aria-roledescription="draggable">
                    <a href="/ifs" target="_blank" rel="noreferrer" className={styles.appSmall}>
                      <Icon iconName="DocumentSet" className={styles.appIconCircle} />
                      <div>
                        <div className={styles.titleAndStar}>
                          <div className={styles.titleApp}>Time reporting</div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div role="button" aria-disabled="false" aria-roledescription="draggable">
                    <a href="https://www.office.com/?auth=2&amp;home=1" target="_blank" rel="noreferrer" className={styles.appSmall}>
                      <Icon iconName="OfficeAssistantLogo" className={styles.appIconCircle} />
                      <div>
                        <div className={styles.titleAndStar}>
                          <div className={styles.titleApp}>Microsoft 365</div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div role="button" aria-disabled="false" aria-roledescription="draggable">
                    <a href="https://7566ava.sharepoint.com/" target="_blank" rel="noreferrer" className={styles.appSmall}>
                      <Icon iconName="SharepointLogo" className={styles.appIconCircle} />
                      <div>
                        <div className={styles.titleAndStar}>
                          <div className={styles.titleApp}>HR Hub</div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div role="button" aria-disabled="false" aria-roledescription="draggable">
                    <a href="https://www.trello.com/" target="_blank" rel="noreferrer" className={styles.appSmall}>
                      <Icon iconName="TaskLogo" className={styles.appIconCircle} />
                      <div>
                        <div className={styles.titleAndStar}>
                          <div className={styles.titleApp}>Trello</div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div role="button" aria-disabled="false" aria-roledescription="draggable">
                    <a href="https://www.linkedin.com/learning/" target="_blank" rel="noreferrer" className={styles.appSmall}>
                      <Icon iconName="LearningTools" className={styles.appIconCircle} />
                      <div>
                        <div className={styles.titleAndStar}>
                          <div className={styles.titleApp}>LinkedIn Learning</div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div role="button" aria-disabled="false" aria-roledescription="draggable">
                    <a href="https://account.activedirectory.windowsazure.com/applications/signin/de2fae87-0d6c-4ba5-aa19-88ba2dda235c?tenantId=58af3eba-510e-4544-8cfd-85f5e0206382" target="_blank" rel="noreferrer" className={styles.appSmall}>
                      <Icon iconName="Money" className={styles.appIconCircle} />
                      <div>
                        <div className={styles.titleAndStar}>
                          <div className={styles.titleApp}>SAP Concur</div>
                        </div>
                      </div>
                    </a>
                  </div>

                  <ActionButton
                    iconProps={addFriendIcon}
                    allowDisabledFocus
                    className={styles.addCustomLinkButton}
                    onClick={this.toggleCustomLinkForm}
                  >
                    Custom link
                  </ActionButton>

                  {this.state.isCustomLinkFormVisible && (
                    <form
                      className={styles.customLinkForm}
                      onSubmit={(e) => {
                        e.preventDefault();
                        alert('Custom link added!');
                        this.setState({ isCustomLinkFormVisible: false });
                      }}
                    >
                      <div className={styles.formGroup}>
                        <label htmlFor="linkTitle" className={styles.formLabel}>Title:</label>
                        <input
                          type="text"
                          id="linkTitle"
                          name="linkTitle"
                          className={styles.formInput}
                          placeholder="Enter the title"
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="linkUrl" className={styles.formLabel}>URL:</label>
                        <input
                          type="url"
                          id="linkUrl"
                          name="linkUrl"
                          className={styles.formInput}
                          placeholder="Enter the URL"
                          required
                        />
                      </div>
                      <div className={styles.formActions}>
                        <button type="submit" className={styles.submitButton}>Add</button>
                        <button
                          type="button"
                          className={styles.cancelButton}
                          onClick={this.toggleCustomLinkForm}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </Callout>
          )}
        </div>
      </section>
    );
  }
}