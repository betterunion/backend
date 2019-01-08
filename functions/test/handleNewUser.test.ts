import * as myFunctions from "../src";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {expect} from "chai";

export function testHandleNewUser(test) {
    const wrapped = test.wrap(myFunctions.handleNewUser);

    before(function() {
        const basicUser: functions.auth.UserRecord = {
            uid: "basicUser",
            email: "basicUser@fake.email",
            emailVerified: false,
            displayName: "Basic User",
            phoneNumber: null,
            photoURL: null,
            disabled: false,
            metadata: {
                lastSignInTime: "0",
                creationTime: "0",
                toJSON: () => {
                    return ""
                }
            },
            providerData: [],
            toJSON: () => {
                return ""
            }
        };
        return wrapped(basicUser);


    });

    after(function() {
        return admin.firestore().collection("users").doc("basicUser").delete();
    });

    let ref = admin.firestore().collection("users").doc("basicUser");

    it("has correct metadata", function() {
        return ref.get().then(doc => {
            let data = doc.data();
            expect(data.email).to.equal("basicUser@fake.email");
            expect(data.emailVerified).to.equal(false);
            expect(data.role).to.equal("user");
        });
    });

    it("has personal information", function() {
        return ref.collection("information").doc("personal").get().then(doc => {
            let data = doc.data();
            expect(data).to.have.all.keys("name", "identity", "photo");
        });
    });

    it("has protected information", function() {
        return ref.collection("information").doc("protected").get().then(doc => {
            let data = doc.data();
            expect(data).to.have.all.keys("viewedQuestions");
        });
    });

    it("has default privacy information", function() {
        return ref.collection("information").doc("privacy").get().then(doc => {
            let data = doc.data();
            expect(data).to.deep.equal({questions: 3, conversations: 3});
        });
    });
}