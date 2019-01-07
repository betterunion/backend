import * as assert from "assert";
import { expect } from 'chai';
import "mocha";

import {mapToFirestoreMap, firestoreMapToMap} from "../../src/util/maps";

describe("util/maps", () => {
    describe("mapToFirestoreMap", () => {
        let testMap = new Map<string, string[]>();

        it("handles empty map", () => {

            let firestoreMap = mapToFirestoreMap(testMap);

            expect(firestoreMap).to.deep.equal({});
        });

        it("handles map with one item", () => {
            testMap.set("test", ["foo", "bar"]);

            expect(mapToFirestoreMap(testMap), "firestore map").to.deep.equal({test: ["foo", "bar"]});
        });
    });

    describe("firestoreMapToMap", () => {
        it("handles empty firebase map", () => {
            let testMap = new Map<string, string[]>();

            expect(firestoreMapToMap({})).to.deep.equal(testMap);
        });

        it("handles a map with one item", () => {
            let testMap = new Map<string, string[]>();
            testMap.set("test", ["foo", "bar"]);

            expect(firestoreMapToMap({test: ["foo", "bar"]})).to.deep.equal(testMap);
        });
    });
});