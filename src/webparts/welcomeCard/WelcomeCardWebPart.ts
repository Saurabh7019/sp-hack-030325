import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'WelcomeCardWebPartStrings';
import { MSGraphClientV3, HttpClient } from '@microsoft/sp-http';
import WelcomeCard from './components/WelcomeCard';
import { IWelcomeCardProps } from './components/IWelcomeCardProps';

export interface IWelcomeCardWebPartProps {
  SummaryApiEndpoint: string;
}

export default class WelcomeCardWebPart extends BaseClientSideWebPart<IWelcomeCardWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _graphClient: MSGraphClientV3;
  private _httpClient: HttpClient;

  public render(): void {
    const { displayName, email } = this.context.pageContext.user;
    const url = new URL(this.context.pageContext.site.absoluteUrl);
    const tenantName = url.hostname.split('.')[0];

    const element: React.ReactElement<IWelcomeCardProps> = React.createElement(
      WelcomeCard,
      {
        isDarkTheme: this._isDarkTheme,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: displayName,
        userEmail: email,
        tenantName: tenantName,
        graphHttpClient: this._graphClient,
        httpClient: this._httpClient,
        serviceScope: this.context.serviceScope,
        SummaryApiEndpoint: this.properties.SummaryApiEndpoint
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    this._graphClient = await this.context.msGraphClientFactory.getClient("3");
    return super.onInit();
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
      {
        header: {
        description: strings.PropertyPaneDescription
        },
        groups: [
        {
          groupName: strings.BasicGroupName,
          groupFields: [
          PropertyPaneTextField('SummaryApiEndpoint', {
            label: strings.SummaryApiEndpoint
          })
          ]
        }
        ]
      }
      ]
    };
  }
}
