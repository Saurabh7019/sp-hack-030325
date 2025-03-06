import { Caching } from "@pnp/queryable";
import { SPFI, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import { IItem } from "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import { getSP } from "../pnpjsConfig";

import { IFeedbackComponents, IFeedbackComponentsReaction } from './IFeedbackItem';

export class FeedbackService {

    private _sp: SPFI;

    constructor() {
        this._sp = getSP();
    }

    async sendFeedback(title: string, category: string, message: string): Promise<void> {
        try {
            const spService = spfi(this._sp).using(Caching({ store: "session" }));

            // Add feedback item to the SharePoint list
            await spService.web.lists.getByTitle('Intranet Feedbacks').items.add({
                Title: title,
                SC_Feedback: message,
                SC_FeedbackCategory: category,
                SC_Status: "New",
            });
        } catch (error) {
            console.error(`sendFeedback - ${JSON.stringify(error)}`);
            throw new Error("An issue occurred while submitting the feedback.");
        }
    }

    async getFeedbackComponents(): Promise<IFeedbackComponents[]> {
        const spService = spfi(this._sp).using(Caching({ store: "session" }));

        const response: IItem[] = await spService.web.lists
            .getByTitle("Feedback Components")
            .items
            .select("Title", "SC_IconName", "SC_TourOrder", "SC_ComponentInternalName")
            .orderBy("SC_TourOrder", true)();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return response.map((item: any) => ({
            Title: item.Title,
            Icon: item.SC_IconName,
            Order: item.SC_TourOrder,
            ComponentInternalName: item.SC_ComponentInternalName
        }));
    }

    async getMyFeedbackReaction(): Promise<IFeedbackComponentsReaction> {
        const spService = spfi(this._sp).using(Caching({ store: "session" }));

        const user = await spService.web.currentUser();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await this._sp.web.lists
            .getByTitle("Feedback Reactions")
            .items
            .filter(`AuthorId eq ${user.Id}`).top(1)();

        if (response.length > 0) {
            return {
                Id: response[0].Id,
                SC_WelcomeCard: response[0].SC_WelcomeCard,
                SC_GuidedTour: response[0].SC_GuidedTour,
                SC_IntranetFeedback: response[0].SC_IntranetFeedback,
                SC_NewsSlider: response[0].SC_NewsSlider,
                SC_CompanyFeed: response[0].SC_CompanyFeed,
                SC_MyFeed: response[0].SC_MyFeed,
                SC_Vision: response[0].SC_Vision,
                SC_UpcomingEvents: response[0].SC_UpcomingEvents,
                SC_MeetupRecordings: response[0].SC_MeetupRecordings,
                SC_VivaDashboard: response[0].SC_VivaDashboard,
                SC_PersonalDashboard: response[0].SC_PersonalDashboard
            };
        }

        return {
            Id: 0,
            SC_WelcomeCard: '',
            SC_GuidedTour: '',
            SC_IntranetFeedback: '',
            SC_NewsSlider: '',
            SC_CompanyFeed: '',
            SC_MyFeed: '',
            SC_Vision: '',
            SC_UpcomingEvents: '',
            SC_MeetupRecordings: '',
            SC_VivaDashboard: '',
            SC_PersonalDashboard: ''
        };
    }

    async updateFeedbackReaction(
        itemId: number,
        reactionType: 'Like' | 'Dislike',
        componentInternalName: string
    ): Promise<void> {
        try {
            const spService = spfi(this._sp).using(Caching({ store: "session" }));

            await spService.web.lists
                .getByTitle('Feedback Reactions')
                .items
                .getById(itemId)
                .update({ [componentInternalName]: reactionType });

        } catch (error) {
            console.error(`updateFeedbackReaction - ${JSON.stringify(error)}`);
        }
    }

    async addFeedbackReaction(
        reactionType: 'Like' | 'Dislike',
        componentInternalName: string
    ): Promise<number> {
        try {
            const spService = spfi(this._sp).using(Caching({ store: "session" }));

            const response = await spService.web.lists
                .getByTitle('Feedback Reactions')
                .items
                .add({ [componentInternalName]: reactionType });

            return response.Id;
        } catch (error) {
            console.error(`addFeedbackReaction - ${JSON.stringify(error)}`);
            return 0;
        }
    }

}