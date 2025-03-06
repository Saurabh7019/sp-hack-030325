import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { ITourItem } from './ITourItem';
import * as strings from 'GuidedSiteTourWebPartStrings';

interface IListItem {
    Title: string;
    SC_Description: string;
    SC_Selector: string;
    SC_ControlID: string;
    SC_TourOrder: number;
    SC_IsActive: number;
}

export class GuidedSiteTourService {

    /**
     * Gets user profile property value
     * @returns Promise<boolean>
     */
    public async GetUserProfileProperties(client: SPHttpClient, userLoginName: string, siteUrl: string): Promise<boolean> {
        try {
            const encodedUserName = encodeURIComponent(`i:0#.f|membership|${userLoginName}`);
            const restAPIUrl = `${siteUrl}/_api/sp.userprofiles.peoplemanager/getuserprofilepropertyfor(accountName=@v,%20propertyname='NoTutorialForAllSites')?@v='${encodedUserName}'`;

            const response: SPHttpClientResponse = await client.get(restAPIUrl, SPHttpClient.configurations.v1);
            const results: { value?: string } = await response.json();

            const NoforAllSite: boolean = results.value !== undefined ? JSON.parse(results.value.toLowerCase()) : false;

            return NoforAllSite;
        } catch (error) {
            throw new Error(`Error occurred: ${error}`);
        }
    }

    /**
     * Sets user profile property value
     * @returns {void}
     */
    public async SetUserProfileProperties(client: SPHttpClient, userLoginName: string, isChecked: boolean): Promise<boolean> {
        try {
            const chekedValue: string = String(isChecked);
            const baseUrl = window.location.protocol + "//" + window.location.host;
            const apiUrl = baseUrl + "/_api/SP.UserProfiles.PeopleManager/SetSingleValueProfileProperty";

            const userData = {
                'accountName': `i:0#.f|membership|${userLoginName}`,
                'propertyName': 'NoTutorialForAllSites',
                'propertyValue': chekedValue,
            };

            const spOpts = {
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'Content-type': 'application/json;odata=verbose',
                    'odata-version': '',
                },
                body: JSON.stringify(userData),
            };

            const response: SPHttpClientResponse = await client.post(apiUrl, SPHttpClient.configurations.v1, spOpts);

            console.log(`User profile preference for Site tour updated as ${response.status}`);

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**
     * Gets site tour content
     * @returns Promise<ITourItem[]>
     */
    public async GetTourContent(client: SPHttpClient, siteUrl: string): Promise<ITourItem[]> {
        try {
            const viewXML = `<View><Query><Where><Eq><FieldRef Name='SC_IsActive'/><Value Type='Integer'>1</Value></Eq></Where></Query></View>`;
            const payload = { 'ViewXml': viewXML };

            const response: SPHttpClientResponse = await client.post(
                `${siteUrl}/_api/web/lists/GetByTitle('${strings.tourListTitle}')/GetItems(query=@v1)?$select=Title,SC_ControlID,SC_Description,SC_Selector,SC_TourOrder,SC_IsActive&@v1=${JSON.stringify(payload)}`,
                SPHttpClient.configurations.v1,
                { headers: { 'odata-version': '3.0' } }
            );

            if (!response.ok) {
                console.error(`Error: ${response.status} - ${response.statusText}`);
                return [];
            }

            const data = await response.json();
            if (!data.value || data.value.length === 0) {
                return [];
            }

            const items: ITourItem[] = data.value.map((d: IListItem) => ({
                title: d.Title,
                description: d.SC_Description,
                selector: d.SC_Selector,
                controlId: d.SC_ControlID,
                order: d.SC_TourOrder,
                isActive: d.SC_IsActive,
            }));

            return items.sort((a, b) => a.order - b.order);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}