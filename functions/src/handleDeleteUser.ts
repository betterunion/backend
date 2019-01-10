import * as admin from "firebase-admin";

export function handleDeleteUserFunction(user: functions.auth.UserRecord): Promise<void> {
    //for now, just delete the user record. It should be OK to leave the user's ID attached to conversations
    return admin.firestore().collection("users").doc(user.uid).delete().then(() => {return});
}