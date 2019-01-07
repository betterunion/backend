import {UserPersonalInformation, UserMetadata, UserProtectedInformation, UserDefaultPrivacyInformation} from "./types";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

/**
 * first, a backend datastore for the user must be created
 *
 * Setup the metadata for the user based on the info,
 * then setup the personal, protected, and privacy documents under the information subcollection
 *
 * Additionally, some sort of welcome email could be sent here
 *
 * (we shouldn't need to verify user's accounts by email, since they will at least initially
 * be signing in with providers such as google or facebook which have already provided this
 * info)
 *
 * @param user
 */
const handleNewUserFunction = async (user: functions.auth.UserRecord): Promise<any[]> => {
    //the fields of user can be found here https://firebase.google.com/docs/reference/functions/functions.auth.UserRecord

    //record their id
    let uid = user.uid;

    //create the object that will be the top level metadata for the user
    let userMetadata: UserMetadata = {
        email: user.email,
        emailVerified: user.emailVerified,
        role: 'user',
        time: {
            created: Date.now()
        }
    };

    //create the personal information object, autofilling whatever fields that we can
    let userPersonalInformation: UserPersonalInformation = {
        name: {
            first: {value: user.displayName, privacy: 3}
        },
        identity: {

        },
        photo: {value: user.photoURL, privacy: 3},
    };

    //create the protected information object

    let userProtectedInformation: UserProtectedInformation = {
        viewedQuestions: new Map<string, string[]>()
    };

    //create the default privacy information object

    let userDefaultPrivacyInformation: UserDefaultPrivacyInformation = {
        questions: 3,
        conversations: 3
    };

    //write all of the data

    let db = admin.firestore();
    let ref = db.collection("users").doc(uid);

    let dbPromise = ref.set(userMetadata).then(() => {
        return Promise.all([
            ref.collection("information").doc("personal").set(userPersonalInformation),
            ref.collection("information").doc("protected").set(userProtectedInformation),
            ref.collection("information").doc("privacy").set(userDefaultPrivacyInformation)
        ]);
    });

    //here we can do whatever email stuff we want to do


    //finally, return all of the promises

    return Promise.all([dbPromise]);
};

export const handleNewUser = functions.auth.user().onCreate(handleNewUserFunction);