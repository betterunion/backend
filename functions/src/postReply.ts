import {CallableContext} from "firebase-functions/lib/providers/https";
import * as admin from "firebase-admin";
import {Conversation, Reply} from "../../../types/types";
import {firestoreMapToMap} from "./util/maps";

export async function postReplyFunction(
    {questionId, conversationId, content}:
        {questionId: string, conversationId: string, content: {body: string}},
    context: CallableContext
): Promise<string> {
    //determine if privacy rules allow this user to post

    let userId = context.auth.uid;

    let body = content.body;

    if(userId !== null) {

        let conversationRef = admin.firestore()
            .collection("questions")
            .doc(questionId)
            .collection("conversations")
            .doc(conversationId);

        let conversation = <Conversation> (await conversationRef.get()).data();
        let members = firestoreMapToMap(conversation.members);
        let allowedToEdit = false;

        //if the privacy is 0 or 1, anyone can edit
        if(conversation.privacy.edit === 0 || conversation.privacy.edit === 1) {
            allowedToEdit = true;
        }
        //if the privacy is 3, the member must be in the conversation
        else if(conversation.privacy.edit === 3) {

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
                },
                author: userId
            };

            let replyRef = await conversationRef.collection("replies").add(reply);

            // if the conversation does not include the member, or the member has only been added temporarily
            // (e. g. because he was just shown the response and has not replied).
            if(!members.has(userId) || members.get(userId).view === -1) {

                let privacy = (await admin.firestore()
                    .collection('users')
                    .doc(userId)
                    .collection('information')
                    .doc('privacy')
                    .get()).data();



                let newMemberField = {};

                newMemberField["members." + userId] = privacy.conversations;
                //should also update the overall privacy

                await conversationRef.update(newMemberField);
            }

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