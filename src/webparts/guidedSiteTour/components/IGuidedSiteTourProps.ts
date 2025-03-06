import { SPHttpClient } from "@microsoft/sp-http";

export interface IGuidedSiteTourProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  spHttpClient: SPHttpClient;
  userLoginName: string;
  siteUrl: string;
}
