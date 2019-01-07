export interface Private<T> {
    value: T;
    privacy: number;
}

export interface Name {
    first?: Private<string>;
    last?: Private<string>;
    middle?: Private<string>;
    prefix?: Private<string>;
    suffix?: Private<string>;
}

export interface Age {
    min?: Private<number>;
    max?: Private<number>;
    dob?: Private<number>;
}

export interface Location {
    //todo
    zipcode?: number;
    state?: string;
    region?: string;
}

export interface UserMetadata {
    email: string,
    emailVerified: boolean,
    role: string,
    time: {
        created: number
    }
}

export interface UserPersonalInformation {
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

export interface UserProtectedInformation {
    viewedQuestions?: Map<string, string[]> //id of the question to the array of the conversations seen
    otherData?: any;
}

export interface UserDefaultPrivacyInformation {
    questions: number;
    conversations: number;
}

export interface Reply {
    content: {
        body: string;
    };
    time: {
        posted: number;
        lastEdit?: number;
    }
}

export interface Conversation {
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

export interface Question {
    content: {
        title: string;
        body?: string;
    };
    tags: string[];
    time: number;
    author: string;
    conversations?:Conversation[]
}