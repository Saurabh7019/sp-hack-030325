export interface IWelcomeCardState {
    profilePhotoUrl: string | undefined;
    lastPasswordChangeDate: string;
    summaries: {
        emailSummary: string;
        eventSummary: string;
    };
    isCalloutVisible: boolean;
    isAddFavoriteCalloutVisible: boolean;
    isCustomLinkFormVisible: boolean
}