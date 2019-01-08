import {privacyHelper} from "../../src/util/privacy";
import "mocha";
import {expect} from "chai";

export function testPrivacy() {
    describe("privacyHelper", function() {
        it("handles empty object", function() {
            expect(privacyHelper({}, 0)).to.deep.equal({});
        });

        let testData = {
            foo: {
                value: "foo",
                privacy: 0
            },
            bar: {
                value: "bar",
                privacy: 1
            }
        };

        it("handles privacy level 0", function() {
            expect(privacyHelper(testData, 0)).to.deep.equal({
                foo: {
                    value: "foo",
                    privacy: 0
                }
            });
        });

        it("handles privacy level 1", function() {
            expect(privacyHelper(testData, 1)).to.deep.equal({
                foo: {
                    value: "foo",
                    privacy: 0
                },
                bar: {
                    value: "bar",
                    privacy: 0
                }
            });
        });

        it("does not mutate the object", function() {
            expect(privacyHelper(testData, -1)).to.deep.equal({});
            expect(testData).to.deep.equal({
                foo: {
                    value: "foo",
                    privacy: 0
                },
                bar: {
                    value: "bar",
                    privacy: 1
                }
            });
        });

        const nestedTestData = {
            nested: {
                foo: {
                    value: "foo",
                    privacy: 0
                },
                bar: {
                    value: "bar",
                    privacy: 1
                }
            },
            foo: {
                value: "foo",
                privacy: 0
            },
            bar: {
                value: "bar",
                privacy: 1
            }
        };

        it("handles nested data", function() {
            expect(privacyHelper(nestedTestData, 0)).to.deep.equal({
                nested: {
                    foo: {
                        value: "foo",
                        privacy: 0
                    }
                },
                foo: {
                    value: "foo",
                    privacy: 0
                }
            });
        });
    });
}