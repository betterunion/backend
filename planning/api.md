# Some desired functionality

## users

##### logging in

* firebase handles authentication

##### logging out

* firebase, again

##### registering

* this is done through firebase, but a backend function will need to setup the user's profile.

##### accessing user personal information

backend:

* if it the user trying to access their own information, this can just be done using direct
    calls to the database, as the user has read and write access
* if it is a different user trying to access this user's profile, a different approach will
    be needed that takes into account different security settings. This function should return
    as much information about the user as is allowed, and it can be used both for user profile
    pages and for saying the name of the user replying to a comment
    
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

interface UserInformation {
  name: Name; //same as age
  identity: {
      race: Private<string[]>;
      gender: Private<string>;
      sexualOrientation: Private<string>;
      age: Age; //not private because it's individual members are
      location: Location; //same ^
      religion: Private<string>;
      politicalOrientation: Private<string>;
      politicalParty: Private<string>;
      profession: Private<string>;
      values: Private<string[]>;
  }
  description: Private<string>;
  photo: Private<string>;
}

function getUserInformation(uid: string): UserInformation {}
```
    
##### editing user personal information

* users can only access their own personal information. This can be done directly through th
    database.
    
```typescript
/**
* edits the user information. Takes an object with with the information to be updated
* @param information
*/
function editUserInformation(information: Map<string, any>) {}
```

##### accessing user protected information

* this is not a valid use case. Only the system knows the protected information

##### accessing the user's default privacy information

* this information is only every accessed by the user, so it can just be accessed in the same way
    the user would access their personal information
    
frontend:
```typescript
/**
* Returns the default privacy options for a user
*/
function getUserDefaultPrivacy(): Map<string, number> { return null }
```

##### editing the user's default privacy information
* this can be done in the same way the personal information is edited

frontend:
```typescript
/**
* 
* @param privacy 
*/
function editUserDefaultPrivacy(privacy: Map<string, number>) {}
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
* @param req
* @param res
*/
function getQuestions(req, res): Question[] {}
```

frontend:
```typescript
/**
* Calls the backend getQuestions function
*/
function getQuestions(): Question[] {}
```

##### accessing a question

* information about a question can be gotten directly from the database
backend:

frontend:
```typescript
function getQuestion(req, res): Question {}
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
function postQuestion(req, res): string {}
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
function postQuestion(content: {title: string, body?: string}, tags?: string[]): string {}
```

##### accessing the personalized conversations of that question

* this needs to be a specific function. It must first check to see if the user has accessed
    that question, and if they have, to just show them the replies that they have seen. If not,
    the function should find the (N = 12) conversations with the lowest number of members. Then,
    the function picks the finds the top (n = 3, n < N) conversations which have people who are
    most different than the user. It returns these n conversations, and records that these are
    the conversations that were presented to the user so that they will be the ones that are
    presented again later.
    
##### accessing a conversation

* requires the input parameters of both the conversation id and the question id

##### viewing the replies to a conversation

* this should be done by directly querying the database using an onSnapshot, so that the replies
    are pushed directly to the client

##### starting a conversation

* the client need only supply the id of the question and the content of the reply. The server
    should then be able to generate the required data fields for the conversation and the reply

##### posting a reply to a conversation

* the client needs to supply the id of the question and of the conversation, as well as the
    content of the reply. Then, the server should update other data fields, such as the members.
    There should be a function that adjusts the privacy settings of the conversation whenever the
    members change.

