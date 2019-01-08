import {UserPersonalInformation} from "../../../types/types";
import * as admin from "firebase-admin";
import {privacyHelper} from "./util/privacy";
import * as functions from "firebase-functions";

export async function getUserPersonalInformationFunction(
    {uid} : {uid: string},
    context: functions.https.CallableContext
): Promise<UserPersonalInformation> {
    let result = await admin.firestore().collection("users").doc(uid).collection("information").doc("personal").get();
    let output = result.data();

    //the maximum privacy level, meaning the privacy level of a field must be below this in order to be shown.
    let maxLevel = 0;

    //the the user is logged in, raise the maximum privacy level
    if(context.auth.uid !== null) {
        maxLevel = 1;
    }

    privacyHelper(output, maxLevel);

    return <UserPersonalInformation> output;
}