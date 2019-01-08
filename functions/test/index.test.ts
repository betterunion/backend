import * as firebaseFunctionsTest from "firebase-functions-test";
import * as functions from "firebase-functions";
import "mocha";
import {expect} from "chai";

let onlineConfig = {
    databaseURL: "https://betterunion-8ac8f.firebaseio.com",
    projectId: "betterunion-8ac8f"
};


let pathToKey = "/Users/aidan/Documents/betterunion/backend/functions/keys/betterunion-8ac8f-c38aaf15539b.json";



const test = firebaseFunctionsTest(onlineConfig, pathToKey);

import * as myFunctions from "../src/index";
import * as admin from "firebase-admin";
import {testHandleNewUser} from "./handleNewUser.test";

describe("Cloud Functions", () => {

    after(() => {
        test.cleanup();
    });

    describe("handleNewUser", () => testHandleNewUser(test));
});