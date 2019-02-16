import * as admin from "firebase-admin";
import {Question} from "../../../types/types";
import {CallableContext} from "firebase-functions/lib/providers/https";

export async function postReplyFunction(_, context: CallableContext): Promise<Question[]> {
    return admin.firestore()
        .collection("questions")
        .limit(10)
        .get()
        .then(result => {

        });
}