# privacy settings

There will be several privacy settings, which will control who can see the document. The privacy settings may be used
to control the actual access to the database, or can control just what the specific functions will serve to the user.
In the case of a conversation, where multiple people may choose the privacy level, the level will be the maximum
of the choices.

* level 0: Viewable to anyone and any logged in user can reply to the conversation
* level 1: Viewable by any logged in user
* level 2: Viewable by "friends" (whatever this means)
* level 3: No one but the members of the conversation, and whoever is shown the conversation
           in a question. If this level is used in a personal information field, it will be hidden from everyone.

Reply privacy works with the same levels above, except "view" is replaced with "reply". Reply
privacy can be used by users who are interested in keeping the number of people who can respond
to a question low, making it more intimate.

# time

Whenever time is mentioned, it will be a map to specifically named times. For example,
something like

`{time: {posted: 0, lastReply: 0}}`

Where `time.posted` would be the time that the document was posted, and
`time.lastReply` was the time of the last reply. Instead of `0`s, the actual time will be
represented as milliseconds since 1970, in the UTC timezone.

# users
top level can be viewed by the user, but not edited directly
* email
* role (user, moderator, admin, ...)
* time
    * created
    * last login (maybe)
* information (subcollection containing "personal" and "protected")
    * personal information (can be viewed and edited by the user at will)
        * note: each field will be a map with a field "privacy", which controls who can see the information, 
          and a field "value" which will have the actual value. However, no matter the privacy, this information
          will still be directly viewable and editable exclusively by the user
        * name
            * first name
            * last name
            * middle name
            * prefix
            * suffix
        * personal identity (all optional)
            * race
            * gender
            * sexual orientation
            * age
                * minimum
                * maximum (if ony a range is supplied)
                * date of birth
            * general location
            * religion
            * political leaning/orientation
            * political party
            * profession
            * values (a map of string values)
        * personal description (where they can write a paragraph or something describing themselves)
        * photo (as a url)
    * protected information (like by the political classification algorithm... this can neither be viewed nor edited by the user)
        * "political" classification
        * questions that have been viewed by the user
        * any data related to the user being studied
    * privacy (the default privacy settings for things that the user posts, such as a conversation
        these can be edited and viewed directly by the user)
        * a specific field/document
            * view privacy
            * reply privacy
        
* conversations (these will be references to the ids of the conversations. This will be a subcollection. viewable but not editable)
    * a conversation
        * id of question
        * ids of the replies that were s
        * time
            * posted
            * lastReply
        
    
# questions

top level of a question can be can be viewed by anyone

* content
    * title
    * body (optional)
* tags
* time
    * posted
    * lastReply
* author (id to the author)
* score? (some way of sorting questions )
* conversations (a subcollection of new conversations, replies to the original post. Only server has any access)
    * a conversation
        * replies (viewing is based on privacy, and deleting can
                   only be done by the owner of the reply. Only the server can edit and add.)
            * a reply (including the initial reply)
                * content
                    * body
                * time
                    * posted
                    * lastEdit (null if no edits)
                * author (id to the author)
        * members a map of people included in the conversation to another map with some info
            * a member
                * privacy (the privacy setting that the member chose)
        * numMembers      
        * privacy (see privacy settings; decided from the maximum privacy in members)
            * view
            * reply
        * time
            * posted
            * lastReply




