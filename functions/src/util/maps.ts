export function mapToFirestoreMap(map: Map<string, any>): any {

    let firestoreMap: any = {};

    for(let entry of Array.from(map.entries())) {
        firestoreMap[entry[0]] = entry[1];
    }

    return firestoreMap;
}

export function firestoreMapToMap(firestoreMap: any): Map<string, any> {
    let map = new Map<string, any>();

    for(let key of Object.keys(firestoreMap)) {
        const value = firestoreMap[key];

        map.set(key, value);
    }

    return map;
}