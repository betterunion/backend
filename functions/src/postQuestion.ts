import * as admin from "firebase-admin";
import {CallableContext} from "firebase-functions/lib/providers/https";
import {Question} from "../../../types/types";

export async function postQuestionFunction(
    {content, tags}: {content: {title: string, body?:string}, tags: string[]},
    context: CallableContext
): Promise<string> {
    if(context.auth && context.auth.uid !== null) {
        return admin.firestore().collection("users").doc(context.auth.uid).get().then(result => {
            let role = result.data().role;

            //only let the user post if their role is admin or moderator
            if (role === "admin" || role === "moderator") {

                //set up the question object
                let question: Question = {
                    content,
                    tags,
                    time: {
                        posted: Date.now()
                    },
                    author: context.auth.uid
                };

                //add the question and return the id of the question
                return admin.firestore().collection("questions").add(question).then(ref => {
                    return ref.id;
                });
            }
            else {
                return null;
            }
        });
    }
    else {
        return null;
    }
}