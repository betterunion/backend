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