import { MSGraphClientFactory, MSGraphClientV3, HttpClient } from '@microsoft/sp-http';
import { IWelcomeCardService } from "./IWelcomeCardService";
import { ServiceKey, ServiceScope } from '@microsoft/sp-core-library';

export class WelcomeCardService implements IWelcomeCardService {
    public static readonly serviceKey: ServiceKey<IWelcomeCardService> = ServiceKey.create<IWelcomeCardService>('mpd:IWelcomeCardService', WelcomeCardService);
    private _msGraphClientFactory: MSGraphClientFactory;
    private _httpClient: HttpClient;
    private defaultProfilePictureUrl = '/_layouts/15/userphoto.aspx?size=S';

    public constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(() => {
            this._msGraphClientFactory = serviceScope.consume(MSGraphClientFactory.serviceKey);
            this._httpClient = serviceScope.consume(HttpClient.serviceKey);
        });
    }

    public async getProfilePhoto(): Promise<string> {
        try {
            const client: MSGraphClientV3 = await this._msGraphClientFactory.getClient('3');
            const stream = await client.api(`me/photo/$value`).get();
            const url = window.URL || window.webkitURL;
            return url.createObjectURL(stream);
        } catch (error) {
            console.error('Error fetching profile photo:', error);
            return this.defaultProfilePictureUrl;
        }
    }

    public async getLastPasswordChangeDate(): Promise<string> {
        try {
            const client: MSGraphClientV3 = await this._msGraphClientFactory.getClient('3');
            const meData = await client.api(`me`).select('lastPasswordChangeDateTime').get();
            const dateObject = new Date(meData.lastPasswordChangeDateTime);
            const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = dateObject.toLocaleDateString('en-US', options);
            return formattedDate;
        } catch (error) {
            console.error('Error fetching last password change date:', error);
            return this.defaultProfilePictureUrl;
        }
    }

    public async getSummary(api: string): Promise<JSON> {
        try {
            const client: MSGraphClientV3 = await this._msGraphClientFactory.getClient('3');
            const messages = await client.api(`me/mailFolders/inbox/messages?$top=3&$filter=isRead eq false&$orderby=receivedDateTime desc&$select=receivedDateTime,subject,from,bodyPreview`).get();
            const emailJson = JSON.stringify(messages.value.map((message: { receivedDateTime: string; subject: string; from: { emailAddress: { address: string } }; bodyPreview: string }) => ({
            receivedDateTime: message.receivedDateTime,
            subject: message.subject,
            from: message.from.emailAddress.address,
            bodyPreview: message.bodyPreview
            })));
            
            const events = await client.api(`me/events?$top=3&$orderby=start/dateTime&$filter=start/dateTime ge '${new Date().toISOString()}'&$select=subject,start,end,location,organizer,bodyPreview`).get();
            const eventJson = JSON.stringify(events.value.map((event: { subject: string; start: { dateTime: string; timeZone: string }; end: { dateTime: string; timeZone: string }; location: { displayName: string }; organizer: { emailAddress: { address: string } }; bodyPreview: string }) => ({
                subject: event.subject,
                start: event.start.dateTime,
                startTimeZone: event.start.timeZone,
                end: event.end.dateTime,
                endTimeZone: event.end.timeZone,
                location: event.location.displayName,
                organizer: event.organizer.emailAddress.address,
                bodyPreview: event.bodyPreview
            })));

            const body: string = JSON.stringify({
                "emailJson": emailJson,
                "eventJson": eventJson
            });
            const summary = await this._httpClient.post(api, HttpClient.configurations.v1, {
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
            });
            const data = await summary.json();
            return data;
        } catch (error) {
            console.error('Error fetching summary:', error);
            return JSON.parse('{}');
        }
    }
}