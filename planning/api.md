# Some desired functionality

## users

##### accessing user personal information

* if it the user trying to access their own information, this can just be done using direct
    calls to the database, as the user has read and write access
* if it is a different user trying to access this user's profile, a different approach will
    be needed that takes into account different security settings. This function should return
    as much information about the user as is allowed, and it can be used both for user profile
    pages and for saying the name of the user replying to a comment

##### accessing user protected information

* this is not a valid use case. Only the system knows the protected information

##### acessing the user's default privacy information

* this information is only every accessed by the user, so it can just be accessed in the same way
    the user would access their personal information
    
## questions

##### accessing a list of questions

* these can be accessed directly through the database, but it makes sense to make the questions
    to be accessed through an API link in order to better facilitate future personalisation of
    questions to users

##### accessing a question

* information about a question can be gotten directly from the database

##### posting a question

* the server will need to setup the id for this and create the necessary fields

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

