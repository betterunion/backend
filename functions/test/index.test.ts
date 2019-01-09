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
import {testGetUserPersonalInformation} from "./getUserPersonalInformation.test";
import {testPostQuestion} from "./postQuestion.test";

describe("Cloud Functions", () => {

    after(() => {
        test.cleanup();
    });

    describe("Firestore Functions", function() {
        // describe("handleNewUser", function() {testHandleNewUser(test)});
    });

    describe("HTTPS Functions", function() {
        // describe("getUserPersonalInformation", function() {testGetUserPersonalInformation(test)});

        describe("postQuestion", function() {testPostQuestion()});
    });
});