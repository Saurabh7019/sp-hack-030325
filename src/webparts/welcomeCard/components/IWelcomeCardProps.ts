import { MSGraphClientV3, HttpClient } from '@microsoft/sp-http';
import { ServiceScope } from "@microsoft/sp-core-library";

export interface IWelcomeCardProps {
  isDarkTheme: boolean;
  hasTeamsContext: boolean;
  userDisplayName: string;
  userEmail: string;
  tenantName: string;
  graphHttpClient: MSGraphClientV3;
  httpClient: HttpClient;
  serviceScope: ServiceScope;
  SummaryApiEndpoint: string;
}
