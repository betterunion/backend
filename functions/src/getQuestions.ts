import * as admin from "firebase-admin";
import {Question} from "../../../types/types";
import {CallableContext} from "firebase-functions/lib/providers/https";


//todo:: Make the start actually work
export async function getQuestionsFunction({start=0}: {start?: number}, context: CallableContext): Promise<Question[]> {
    return admin.firestore()
        .collection("questions")
        .orderBy("time.posted", "desc")
        .limit(10)
        .get()
        .then(result => {
            let length = result.docs.length;
            let questions = new Array<Question>(length);
            for(let i = 0; i < length; i++) {
                questions[i] = <Question>result.docs[i].data();
            }
            return questions;
        });
}