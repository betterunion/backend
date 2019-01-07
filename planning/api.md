# Some desired functionality

## users

##### logging in

* firebase handles authentication

##### logging out

* firebase, again

##### registering

* this is done through firebase, but a backend function will need to setup the user's profile.

backend:
```typescript
/**
* first, a backend datastore for the user must be created
* 
* Setup the metadata for the user based on the info,
* then setup the personal, protected, and privacy documents under the information subcollection
* 
* Additionally, some sort of welcome email could be sent here
* 
* (we shouldn't need to verify user's accounts by email, since they will at least initially
* be signing in with providers such as google or facebook which have already provided this
* info)
* 
* @param user
*/
const handleNewUserFunction = (user): void => {};

export const handleNewUser = functions.auth.user().onCreate(handleNewUserFunction);
```

##### accessing user personal information

backend:

* if it the user trying to access their own information, this can just be done using direct
    calls to the database, as the user has read and write access
* if it is a different user trying to access this user's profile, a different approach will
    be needed that takes into account different security settings. This function should return
    as much information about the user as is allowed, and it can be used both for user profile
    pages and for saying the name of the user replying to a comment
    
backend:

```typescript
/**
* Gets the user information for a specific user, where information is only returned if
* the privacy settings allow for it. Additionally, the privacy values on the settings should
* all be set to 0 in order to make the privacy settings always private.
* 
* @param userId
* @param context
*/
const getUserPersonalInformationFunction = ({userId: string}, context: any): UserPersonalInformation => {};

export const getUserPersonalInformation = functions.https.onCall(getUserPersonalInformationFunction);
```
    
frontend:

```typescript
interface Private<T> {
    value: T;
    privacy: number;
}

interface Name {
    first?: Private<string>;
    last?: Private<string>;
    middle?: Private<string>;
    prefix?: Private<string>;
    suffix?: Private<string>;
}

interface Age {
    min?: Private<number>;
    max?: Private<number>;
    dob?: Private<number>;
}

interface Location {
    //todo
}

interface UserPersonalInformation {
  name: Name; //same as age
  identity: {
      race?: Private<string[]>;
      gender?: Private<string>;
      sexualOrientation?: Private<string>;
      age?: Age; //not private because it's individual members are
      location?: Location; //same ^
      religion?: Private<string>;
      politicalOrientation?: Private<string>;
      politicalParty?: Private<string>;
      profession?: Private<string>;
      values?: Private<string[]>;
  }
  description?: Private<string>;
  photo?: Private<string>;
}

async function getUserPersonalInformation(uid: string): Promise<UserPersonalInformation> {}
```
    
##### editing user personal information

* users can only access their own personal information. This can be done directly through the
    database.
  
frontend:  
```typescript
/**
* edits the user information. Takes an object with with the information to be updated
* @param information
*/
async function editUserPersonalInformation(information: Map<string, any>): Promise<void> {}
```

##### accessing user protected information

* this is not a valid use case. Only the system knows the protected information

##### accessing the user's default privacy information

* this information is only every accessed by the user, so it can just be accessed in the same way
    the user would access their personal information
    
frontend:


```typescript
interface UserDefaultPrivacyInformation {
    questions: number;
    conversations: number;
}
/**
* Returns the default privacy options for a user
*/
//todo: this probably should have a real return type after the default privacy fields are decided
async function getUserDefaultPrivacy(): Promise<any> {}
```

##### editing the user's default privacy information
* this can be done in the same way the personal information is edited

frontend:
```typescript
/**
* 
* @param privacy 
*/
async function editUserDefaultPrivacy(privacy: any): Promise<void> {}
```   
## questions

##### accessing a list of questions

* these can be accessed directly through the database, but it makes sense to make the questions
    to be accessed through an API link in order to better facilitate future personalisation of
    questions to users
    
backend:
```typescript


interface Reply {
    content: {
        body: string;
    };
    time: {
        posted: number;
        lastEdit?: number;
    }
}

interface Conversation {
    replies: Reply[];
    members: Map<string, number>; //map from member id to their desired privacy choice
    numMembers: number;
    privacy: {
        view: number;
        edit: number;
    };
    time: {
        posted: number;
        lastReply: number;
    };
}

interface Question {
    content: {
        title: string;
        body?: string;
    };
    tags: string[];
    time: number;
    author: string;
    conversations?:Conversation[]
}

/**
* Uses the user ID to return a list of questions to the user.
* @param data unused
* @param context unused
*/
const getQuestionsFunction = (data, context) => Question[] {};

export const getQuestions = functions.https.onCall(getQuestionsFunction);

```

frontend:
```typescript
/**
* Calls the backend getQuestions function
*/
async function getQuestions(): Promise<Question[]> {}
```

##### accessing a question

* information about a question can be gotten directly from the database. This will not include
    the associated conversations, however, since the conversations are personalized, the
    conversations will need to be gotten separately.

frontend:
```typescript
async function getQuestion(req, res): Promise<Question> {}
```

##### posting a question

* the server will need to setup the id for this and create the necessary fields. In the beginning,
    only certain users will post questions, and it can probably just initially be handled entirely
    through the database.

backend:
```typescript
/**
* Sets up all of the necessary collections and subcollections of the question, while also
* setting important metadata, such as the author and the time it was posted.
* 
* @param req
* @param res
*/
const postQuestionFunction = (data, context): string => {};

export const postQuestion = functions.https.onCall(postQuestionFunction);
```
    
frontend: 
```typescript
/**
* 
* 
* @param content
* @param tags
* @returns the id of the question
*/
async function postQuestion(content: {title: string, body?: string}, tags?: string[]): Promise<string> {}
```

##### accessing the personalized conversations of that question

* this needs to be a specific function. It must first check to see if the user has accessed
    that question, and if they have, to just show them the replies that they have seen. If not,
    the function should find the (N = 12) conversations with the lowest number of members. Then,
    the function picks the finds the top (n = 3, n < N) conversations which have people who are
    most different than the user. It returns these n conversations, and records that these are
    the conversations that were presented to the user so that they will be the ones that are
    presented again later.
  
backend:
```typescript

const getConversationsFunction = ({questionId}, context): Conversation[] => {};

export const getConversations = functions.https.onCall(getConversationsFunction);
```
    
frontend:
```typescript
/**
* 
* @param questionId
*/
async function getConversations(questionId: string): Promise<Conversation[]> {};
```
    
##### accessing a conversation

* requires the input parameters of both the conversation id and the question id

##### viewing the replies to a conversation

* this should be done by directly querying the database using an onSnapshot, so that the replies
    are pushed directly to the client
    
frontend:
```typescript
function onNewReplies(questionId: string,
    conversationId: string,
    callback: (replies: Reply[]) => void
): () => void {};
```

##### starting a conversation

* the client need only supply the id of the question and the content of the reply. The server
    should then be able to generate the required data fields for the conversation and the reply
backend:

backend:
```typescript
/**
* 
* @param questionId
* @param body
* @param context
* 
* @returns the id of the conversation
*/
const postConversationFunction = (
    {questionId, content: {body}}: {questionId: string, content: {body: string}},
    context
): string => {};

export const postConversation = functions.https.onCall(postConversationFunction);
```
    
frontend:

```typescript
async function postConversation(
    questionId: string,
    content: {body: string}
): Promise<string> {};
```

##### posting a reply to a conversation

* the client needs to supply the id of the question and of the conversation, as well as the
    content of the reply. Then, the server should update other data fields, such as the members.
    There should be a function that adjusts the privacy settings of the conversation whenever the
    members change.

backend:
```typescript
/**
* 
* @param questionId
* @param conversationId
* @param content the content of the reply
* @param context
*/
const postReplyFunction = (
    {questionId, conversationId, content}:
    {questionId: string, conversationId: string, content: {body: string}},
    context: any
): string => {};

export const postReply = functions.https.onCall(postReplyFunction);
```

frontend:
```typescript
async function postReply(
    questionId: string,
    conversationId: string,
    content: {body: string}
): Promise<string> {};
```



##### editing a reply

* Like posting, the client must supply the id of the question and of the conversation, as well
    as the new content of the reply. Then, the server will adjust the time.lastEdit data field.

backend:

```typescript
const editReplyFunction = (
    {questionId, conversationId, content}:
    {questionId: string, conversationId: string, content: {body: string}},
    context: any
): void => {};
```

frontend:

```typescript
async function editReply(
    questionId: string,
    conversationId: string,
    content: {body: string}
): Promise<void> {};
```