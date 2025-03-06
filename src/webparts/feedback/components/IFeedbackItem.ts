export interface IFeedbackComponents {
    Title: string;
    Icon: string;
    Order: number;
    ComponentInternalName: string;
}

export interface IFeedbackComponentsReaction {
    Id: number;
    SC_WelcomeCard: string;
    SC_GuidedTour: string;
    SC_IntranetFeedback: string;
    SC_NewsSlider: string;
    SC_CompanyFeed: string;
    SC_MyFeed: string;
    SC_Vision: string;
    SC_UpcomingEvents: string;
    SC_MeetupRecordings: string;
    SC_VivaDashboard: string;
    SC_PersonalDashboard: string;
    [key: string]: string | number;
}