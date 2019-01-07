import * as firebaseFunctionsTest from "firebase-functions-test";
import * as functions from "firebase-functions";
import "mocha";
import {expect} from "chai";

let onlineConfig = {
    databaseURL: "https://betterunion-8ac8f.firebaseio.com",
    projectId: "betterunion-8ac8f"
};

let pathToKey = "../keys/betterunion-8ac8f-c38aaf15539b.json";

const test = firebaseFunctionsTest(onlineConfig, pathToKey);

import * as myFunctions from "../src/index";

describe("handleNewUser",  () => {
    const wrapped = test.wrap(myFunctions.handleNewUser);

    it("handles basic user", () => {
        const basicUser: functions.auth.UserRecord = {
            uid: "basicUser",
            email: "basicUser@fake.email",
            emailVerified: false,
            displayName: "Basic User"
        }
    });
});



