import * as admin from "firebase-admin";
import {Question} from "../../../types/types";
import {CallableContext} from "firebase-functions/lib/providers/https";


//todo:: Make the page actually work
export async function getQuestionsFunction({page=0}: {page?: number}, context: CallableContext): Promise<Question[]> {
    const pageCount = 10;

    return admin.firestore()
        .collection("questions")
        .orderBy("time.posted", "desc")
        .limit(pageCount)
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