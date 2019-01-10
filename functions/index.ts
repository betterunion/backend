import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

import {handleNewUserFunction} from "./handleNewUser";
export const handleNewUser = functions.auth.user().onCreate(handleNewUserFunction);

import {getUserPersonalInformationFunction} from "./getUserPersonalInformation";
export const getUserPersonalInformation = functions.https.onCall(getUserPersonalInformationFunction);

import {postQuestionFunction} from "./postQuestion";
export const postQuestion = functions.https.onCall(postQuestionFunction);

import {postConversationFunction} from "./postConversation";
export const postConversation = functions.https.onCall(postConversationFunction);