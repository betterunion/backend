export function privacyHelper(object: any, maxLevel: number): any {

    let output = {};

    for(let key in object) {
        if(object[key]) {
            if (object[key].hasOwnProperty("privacy") && object[key].hasOwnProperty("value")) {
                if (object[key].privacy <= maxLevel) {
                    //the privacy is below the maximum, so it is allowed
                    output[key] = {value: object[key].value, privacy: 0};
                }
            }
            else {
                output[key] = privacyHelper(object[key], maxLevel);
            }
        }
    }

    return output;
}

export function getPrivacyFromMembers(members: Map<string, {view: number, edit: number}> | any): {view: number, edit: number} {

    let max = {view: 0, edit: 0};

    function handleMax(value: {view: number, edit: number}) {
        if(value.view > max.view) {
            max.view = value.view;
        }
        if(value.edit > max.edit) {
            max.edit = value.edit;
        }
    }

    if(members instanceof Map) {
        for(let entry of members.entries()) {
            let value = entry[1];
            handleMax(value);
        }
    }
    else {
        for(let key of Object.keys(members)) {
            let value = members[key];
            handleMax(value);
        }
    }

    return max;
}