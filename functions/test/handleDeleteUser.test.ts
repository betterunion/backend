export function testHandleDeleteUser(test) {
    before(function () {
        const basicUser = test.auth.makeUserRecord({
            uid: "basicUser",
            email: "basicUser@fake.email",
            emailVerified: false,
            displayName: "Basic User",
            phoneNumber: null,
            photoURL: null,
            disabled: false,
        });


    });
}