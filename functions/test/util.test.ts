import "mocha";
import {testMaps} from "./util/maps.test";
import {testNames} from "./util/names.test";
import {testPrivacy} from "./util/privacy.test";

describe("util", function() {
    describe("maps", testMaps);
    describe("names", testNames);
    describe("privacy", testPrivacy);
});