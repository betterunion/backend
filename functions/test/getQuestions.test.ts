import * as myFunctions from "../index";
import "mocha";
import {expect} from "chai";
import * as admin from "firebase-admin";

export function testGetQuestions(test) {

    let questionId = "testId";
    let userId = "getQuestionsTestUser";
    let value = [];

    before(function() {
        //create an authorized user
        return admin.firestore().collection("users").doc(userId).set({role: "moderator"}).then(() => {
            //call the function
            console.log("HERE");
            return myFunctions.postQuestion.run(
                {content: {title: "test"}, tags: ["testTag"]},
                {auth: {uid: userId}}
            )
        }).then(id => {
            questionId = id;
            //call the function and  get the return value
            return myFunctions.getQuestions.run({}, {});
        }).then(result => {
            value = result;
        });
    });

    after(function() {
        // @ts-ignore
        return Promise.all([
            //delete the test user
            admin.firestore().collection("users").doc(userId).delete(),

            //delete the question
            admin.firestore().collection("questions").doc(questionId).delete()
        ]);
    });

    it("Should be an array", function() {
        expect(value).to.have.property("length");
        expect(value.length).to.be.greaterThan(0);
    });

    it("should have an author", function() {
        value.forEach(item => {
            expect(item).to.include.keys("author");
        });
    });

    it("should have a title", function() {
        value.forEach(item => {
            expect(item).to.include.keys("content");
            expect(item.content).to.include.keys("title");
        });
    });
}