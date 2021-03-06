import * as admin from "firebase-admin";
import {Conversation, Reply, UserDefaultPrivacyInformation} from "../../../types/types";
import {mapToFirestoreMap} from "../../../util/src/maps";
import {getPrivacyFromMembers} from "../../../util/src/privacy";

export async function postConversationFunction(
    {questionId, content}: {questionId: string, content: {body: string}},
    context
): Promise<string> {
    if(context.auth && context.auth.uid !== null) {
        let body = content.body;
        //get the default privacy settings of the user
        let privacyResult = await admin.firestore()
            .collection("users")
            .doc(context.auth.uid)
            .collection("information")
            .doc("privacy").get();

        let privacy = <UserDefaultPrivacyInformation> privacyResult.data();

        let members = new Map<string, {view: number, edit: number}>();
        members.set(context.auth.uid, {view: privacy.conversations.view, edit: privacy.conversations.edit});

        let conversation: Conversation = {
            members: mapToFirestoreMap(members),
            numMembers: 1,
            privacy: getPrivacyFromMembers(members),
            time: {
                posted: Date.now(),
                lastReply: Date.now()
            }
        };

        let conversationRef = await admin.firestore()
            .collection("questions")
            .doc(questionId)
            .collection("conversations")
            .add(conversation);


        let reply: Reply = {
            content: {
                body
            },
            time: {
                posted: Date.now(),
                lastEdit: null
            },
            author: context.auth.uid
        };

        await conversationRef
            .collection("replies")
            .add(reply);

        return conversationRef.id;
    }
    else {
        return null;
    }
}