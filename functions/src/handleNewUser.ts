import {UserPersonalInformation, UserMetadata, UserProtectedInformation, UserDefaultPrivacyInformation} from "../../../types/types";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {mapToFirestoreMap} from "../../../util/src/maps";
import {displayNameToName} from "../../../util/src/names";

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
export const handleNewUserFunction = async (user: functions.auth.UserRecord): Promise<any[]> => {
    //the fields of user can be found here https://firebase.google.com/docs/reference/functions/functions.auth.UserRecord

    //record their id
    const uid = user.uid;

    //create the object that will be the top level metadata for the user
    const userMetadata: UserMetadata = {
        email: user.email,
        emailVerified: user.emailVerified,
        role: 'user',
        time: {
            created: Date.now()
        }
    };

    //create the personal information object, autofilling whatever fields that we can
    const userPersonalInformation: UserPersonalInformation = {
        name: displayNameToName(user.displayName),
        identity: {

        },
        photo: {value: user.photoURL, privacy: 3},
    };

    //create the protected information object

    const testMap = new Map<string, string[]>();

    testMap.set("test", ["hi", "man"]);

    const userProtectedInformation = {
        viewedQuestions: mapToFirestoreMap(testMap)
    };

    //create the default privacy information object

    const userDefaultPrivacyInformation: UserDefaultPrivacyInformation = {
        conversations: {
            view: 3,
            edit: 3
        }
    };

    //write all of the data

    const db = admin.firestore();
    const ref = db.collection("users").doc(uid);

    const dbPromise = ref.set(userMetadata).then(() => {
        return Promise.all([
            ref.collection("information").doc("protected").set(userProtectedInformation),
            ref.collection("information").doc("personal").set(userPersonalInformation),
            ref.collection("information").doc("privacy").set(userDefaultPrivacyInformation)
        ]);
    });

    //here we can do whatever email stuff we want to do


    //finally, return all of the promises

    return Promise.all([dbPromise]);
};