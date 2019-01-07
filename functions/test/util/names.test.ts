import "mocha";
import {expect} from "chai";

import {displayNameToName} from "../../src/util/names";

describe("util/names", () => {
    describe("displayNameToName", () => {
        it("handles Aidan", () => {
            const displayName = "Aidan";
            const name = {
                first: {value: "Aidan", privacy: 3},
                middle: null,
                last: null,
                prefix: null,
                suffix: null
            };

            expect(displayNameToName(displayName)).to.deep.equal(name);
        });

        it("handles Aidan Kelley", () => {
            const displayName = "Aidan Kelley";
            const name = {
                first: {value: "Aidan", privacy: 3},
                middle: null,
                last: {value: "Kelley", privacy: 3},
                prefix: null,
                suffix: null
            };

            expect(displayNameToName(displayName)).to.deep.equal(name);
        });

        it("handles Aidan M Kelley", () => {
            const displayName = "Aidan M Kelley";
            const name = {
                first: {value: "Aidan", privacy: 3},
                middle: {value: "M", privacy: 3},
                last: {value: "Kelley", privacy: 3},
                prefix: null,
                suffix: null
            };

            expect(displayNameToName(displayName)).to.deep.equal(name);
        });

        it("handles Dr. Aidan M Kelley", () => {
            const displayName = "Dr. Aidan M Kelley";
            const name = {
                first: {value: "Aidan", privacy: 3},
                middle: {value: "M", privacy: 3},
                last: {value: "Kelley", privacy: 3},
                prefix: {value: "Dr.", privacy: 3},
                suffix: null
            };

            expect(displayNameToName(displayName)).to.deep.equal(name);
        });

        it("handles Dr. Aidan M Kelley, PhD", () => {
            const displayName = "Dr. Aidan M Kelley, PhD";
            const name = {
                first: {value: "Aidan", privacy: 3},
                middle: {value: "M", privacy: 3},
                last: {value: "Kelley", privacy: 3},
                prefix: {value: "Dr.", privacy: 3},
                suffix: {value: "PhD", privacy: 3}
            };

            expect(displayNameToName(displayName)).to.deep.equal(name);
        });

        it("handles Dr. Aidan M Kelley, MD, PhD", () => {
            const displayName = "Dr. Aidan M Kelley, MD, PhD";
            const name = {
                first: {value: "Aidan", privacy: 3},
                middle: {value: "M", privacy: 3},
                last: {value: "Kelley", privacy: 3},
                prefix: {value: "Dr.", privacy: 3},
                suffix: {value: "MD, PhD", privacy: 3}
            };

            expect(displayNameToName(displayName)).to.deep.equal(name);
        });

        it("handles Dr. Aidan M Several Last Names, MD, PhD", () => {
            const displayName = "Dr. Aidan M Several Last Names, MD, PhD";
            const name = {
                first: {value: "Aidan", privacy: 3},
                middle: {value: "M", privacy: 3},
                last: {value: "Several Last Names", privacy: 3},
                prefix: {value: "Dr.", privacy: 3},
                suffix: {value: "MD, PhD", privacy: 3}
            };

            expect(displayNameToName(displayName)).to.deep.equal(name);
        });
    });
});