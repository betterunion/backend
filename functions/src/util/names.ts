import {Name} from "../types";

export function displayNameToName(displayName: string): Name {


    let output: Name = {
        first: null,
        middle: null,
        last: null,
        prefix: null,
        suffix: null
    };

    if(displayName === null) {
        return output;
    }

    let split = displayName.split(" ");

    //if there is a prefix, add it
    if(split[0].indexOf(".") >= 0) {
        //their name probably has a prefix
        output.prefix = {value: split[0], privacy: 3};
        split.shift(); //remove the prefix from the array;
    }

    //see find if there exists a suffix by looking for a comma, and remove the comma if it is there.
    let suffixIndex = ((): number => {
        for(let i = 0; i < split.length; i++) {
            let commaIndex = split[i].indexOf(",");
            if(commaIndex >= 0) {
                split[i] = split[i].substring(0, commaIndex);
                return i + 1;
            }
        }
        return -1;
    })();

    //if there is a suffix, and the index of it is in the array
    if(suffixIndex >= 0 && suffixIndex < split.length) {
        let suffixArray = split.splice(suffixIndex, split.length);
        output.suffix =  {value: suffixArray.join(" "), privacy: 3};

        //delete the suffix
        split = split.splice(0, suffixIndex);
    }

    //now, make the actual name
    if(split.length >= 1) {
        //make the first index the first name
        output.first = {value: split[0], privacy: 3};

        if(split.length === 2) {
            output.last = {value: split[1], privacy: 3};
        }
        else if(split.length >= 3) {
            output.middle = {value: split[1], privacy: 3};

            //if there is just one item left, it makes it the last name, otherwise it rejoins all remaining items into a big last name
            output.last = {value: split.slice(2, split.length).join(" "), privacy: 3};
        }
    }

    return output;
}