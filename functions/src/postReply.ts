import {CallableContext} from "firebase-functions/lib/providers/https";
import * as admin from "firebase-admin";
import {Conversation, Reply} from "../../../types/types";
import {firestoreMapToMap} from "./util/maps";

export async function postReplyFunction(
    {questionId, conversationId, content: {body}}:
        {questionId: string, conversationId: string, content: {body: string}},
    context: CallableContext
): Promise<string> {
    //determine if privacy rules allow this user to post

    let userId = context.auth.uid;

    if(userId !== null) {

        let conversationRef = admin.firestore()
            .collection("questions")
            .doc(questionId)
            .collection("conversations")
            .doc(conversationId);

        let conversation = <Conversation> (await conversationRef.get()).data();

        let allowedToEdit = false;


        //if the privacy is 0 or 1, anyone can edit
        if(conversation.privacy.edit === 0 || conversation.privacy.edit === 1) {
            allowedToEdit = true;
        }
        //if the privacy is 3, the member must be in the conversation
        else if(conversation.privacy.edit === 3) {
            let members = firestoreMapToMap(conversation.members);

            if(members.has(userId)) {
                allowedToEdit = true;
            }
        }

        if(allowedToEdit) {
            let reply: Reply = {
                content: {
                    body
                },
                time: {
                    posted: Date.now(),
                    lastEdit: null
                }
            };

            let replyRef = await conversationRef.collection("replies").add(reply);

            return replyRef.id;
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
}