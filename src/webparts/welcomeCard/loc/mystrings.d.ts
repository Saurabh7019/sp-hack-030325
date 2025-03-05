declare interface IWelcomeCardWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
  UnknownEnvironment: string;
  SummaryApiEndpoint: string;
}

declare module 'WelcomeCardWebPartStrings' {
  const strings: IWelcomeCardWebPartStrings;
  export = strings;
}
