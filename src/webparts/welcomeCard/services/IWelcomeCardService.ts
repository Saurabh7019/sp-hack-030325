export interface IWelcomeCardService {
    getProfilePhoto: () => Promise<string>;
    getLastPasswordChangeDate: () => Promise<string>;
    getSummary: (api: string) => Promise<JSON>;
}