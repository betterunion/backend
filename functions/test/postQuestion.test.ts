import * as admin from "firebase-admin";
import {postQuestion} from "../index";
import * as myFunctions from "../index";
import {expect} from "chai";

export function testPostQuestion(test) {

    let questionId = "noId";

    before(function() {
        //create an authorized user
        return admin.firestore().collection("users").doc("postQuestionTestUser").set({role: "moderator"}).then(() => {
            //call the function
            return myFunctions.postQuestion.run(
                {content: {title: "test"}, tags: ["testTag"]},
                {auth: {uid: "postQuestionTestUser"}}
            ).then(id => {
                questionId = id;
            });
        });
    });

    after(function() {
        // @ts-ignore
        return Promise.all([
            //delete the test user
            admin.firestore().collection("users").doc("postQuestionTestUser").delete(),

            //delete the question
            admin.firestore().collection("questions").doc(questionId).delete()
        ]);
    });

    it("should fail when there is no logged in user", function() {
        return myFunctions.postQuestion.run(
            {content: {title: "test"}, tags: ["testTag"]},
            {}
        ).then(id => {
            expect(id).to.equal(null);
        });
    });

    it("should reject a user who is not a moderator or admin", function() {
        return admin.firestore().collection("users").doc("postQuestionTestNormalUser").set({role: "user"}).then(() => {
            //call the function
            return myFunctions.postQuestion.run(
                {content: {title: "test"}, tags: ["testTag"]},
                {auth: {uid: "postQuestionTestNormalUser"}}
            ).then(id => {
                expect(id).to.equal(null);
                return admin.firestore().collection("users").doc("postQuestionTestNormalUser").delete();
            });
        });
    });

    it("should have returned the id", function() {
        expect(questionId).to.not.equal("noId");
    });

    it("should have posted a question", function() {
        return admin.firestore().collection("questions").doc(questionId).get().then(result => {
            let data = result.data();
            expect(data.content.title).to.equal("test");
            expect(data.tags).to.deep.equal(["testTag"]);
            expect(data.author).to.equal("postQuestionTestUser");
        });
    });
}