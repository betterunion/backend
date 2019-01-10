import {postConversation, postQuestion} from "../index";
import * as admin from "firebase-admin";
import "mocha";
import {expect} from "chai";
import {Conversation} from "../../../types/types";
import {firestoreMapToMap} from "../src/util/maps";

export function testPostConversation(test) {

    let questionId = "noId";
    let conversationId = "noId";
    let conversationRef = null;
    let conversationData;
    let replies: admin.firestore.QuerySnapshot = null;

    before(function() {
        //create a moderator user that can post questions
        return admin.firestore()
            .collection("users")
            .doc("conversationUser")
            .set({role: "moderator"})
            .then(function() {
                //create some default privacy information for the user
                return admin.firestore()
                    .collection("users")
                    .doc("conversationUser")
                    .collection("information")
                    .doc("privacy")
                    .set({conversations: {view: 0, edit: 1}});
            })
            .then(function () {
                // run postQuestion (which we already have tested by this point) to create a question
                return postQuestion.run(
                    {content: {title: "test"}, tags: ["testTag"]},
                    {auth: {uid: "conversationUser"}}
                )
            }).then(function (id) {
                // run postConversation to create the conversation. We will then verify the data created later
                questionId = id;
                return postConversation.run(
                    {questionId, content: {body: "oh hi"}},
                    {auth: {uid: "conversationUser"}}
                );
            }).then(function (id) {
                // get the data from the conversation
                conversationId = id;
                conversationRef = admin.firestore()
                    .collection("questions")
                    .doc(questionId)
                    .collection("conversations")
                    .doc(conversationId);
                return conversationRef.get()
            }).then(function (result) {
                // record the data frmo the conversation
                conversationData = <Conversation> result.data();
                return conversationRef.collection("replies").get();
            }).then(function (result) {
                replies = result;
            });
    });

    after(function() {
        // @ts-ignore
        return Promise.all([
            //delete the test question (also deletes test conversations)
            admin.firestore().collection("questions").doc(questionId).delete(),

            //delete the test user
            admin.firestore().collection("users").doc("conversationUser").delete()
        ]);
    });

    it("should reject when not logged in", function() {
        postConversation.run(
            {questionId, content: {body: "oh hi"}},
            {}
        ).then(id => {
            expect(id).to.equal(null);
        })
    });

    it("should have correct privacy information", function() {
        expect(conversationData.privacy).to.deep.equal({view: 0, edit: 1});
    });

    it("should have correct member information", function() {
        let members = <Map<string, {view: number, edit: number}>> firestoreMapToMap(conversationData.members);

        // @ts-ignore
        expect(members.get("conversationUser")).to.deep.equal({view: 0, edit: 1});
    });

    it("should have the correct numMembers", function() {
        expect(conversationData.numMembers).to.equal(1);
    });

    it("should have a time property", function() {
        expect(conversationData.time).to.have.keys("posted", "lastReply");
    });

    it("should have one reply", function() {
        expect(replies.size).to.equal(1);
    });

    it("should have the correct reply data", function() {
        replies.forEach(function (doc) {
            let reply = doc.data();

            expect(reply.content).to.deep.equal({body: "oh hi"});
            expect(reply.time).to.have.keys("posted", "lastEdit");
            expect(reply.time.lastEdit).to.equal(null);
            expect(reply.author).to.equal("conversationUser");
        });
    });
}