import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

import {handleNewUserFunction} from "./src/handleNewUser";
export const handleNewUser = functions.auth.user().onCreate(handleNewUserFunction);

import {handleDeleteUserFunction} from "./src/handleDeleteUser";
export const handleDeleteUser = functions.auth.user().onDelete(handleDeleteUserFunction);

import {getUserPersonalInformationFunction} from "./src/getUserPersonalInformation";
export const getUserPersonalInformation = functions.https.onCall(getUserPersonalInformationFunction);

import {postQuestionFunction} from "./src/postQuestion";
export const postQuestion = functions.https.onCall(postQuestionFunction);

import {postConversationFunction} from "./src/postConversation";
export const postConversation = functions.https.onCall(postConversationFunction);