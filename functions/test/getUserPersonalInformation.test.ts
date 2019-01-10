import {handleNewUserFunction} from "../src/handleNewUser";
import * as myFunctions from "../index";
import * as admin from "firebase-admin";
import {expect} from "chai";
import "mocha";

export function testGetUserPersonalInformation(test) {
    before(function() {

        let testUser = test.auth.makeUserRecord(
            {
                uid: "testUser",
                email: "testUser@fake.email"
            }
        );

        return test.wrap(myFunctions.handleNewUser)(testUser).then(() => {
            return admin.firestore().collection("users").doc("testUser").collection("information").doc("personal").update({
                "name.first": {value: "level 0", privacy: 0},
                "name.last": {value: "level 1", privacy: 1},
                "name.middle": {value: "level 3", privacy: 3},

                photo: {value: "level 1", privacy: 1}
            });
        });
    });

    after(function() {
        return admin.firestore().collection("users").doc("testUser").delete();
    });

    it("works with no logged in user", function() {
        return myFunctions.getUserPersonalInformation.run({uid: "testUser"}, {auth: {uid: null}}).then(data => {
            expect(data.name).to.deep.equal({
                first: {
                    value: "level 0", privacy: 0
                },
            });
        });
    });

    it("works with a logged in user", function() {
        return myFunctions.getUserPersonalInformation.run({uid: "testUser"}, {auth: {uid: "not null"}}).then(data => {
            expect(data.name).to.deep.equal({
                first: {
                    value: "level 0", privacy: 0
                },
                last: {value: "level 1", privacy: 0},
            });
            expect(data.photo).to.deep.equal({value: "level 1", privacy: 0});
        });
    });

    it("forms JSON", function() {
        return myFunctions.getUserPersonalInformation.run({uid: "testUser"}, {auth: {uid: "not null"}}).then(data => {
            expect(JSON.stringify(data)).to.not.equal(null);
        });
    });
}