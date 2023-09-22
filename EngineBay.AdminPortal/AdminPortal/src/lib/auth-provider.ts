import { UserIdentity } from "ra-core";

type LoginParams = {
    username: string;
    password: string;
}
export const authProvider = {
    // send username and password to the auth server and get back credentials
    login: (params: LoginParams) => {
        console.log("Login was called")
        const { username, password } = params;
        const basicAuthCredentials = `Basic ${btoa(`${username}:${password}`)}`;
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("token", basicAuthCredentials);
        return Promise.resolve()
    },
    // when the dataProvider returns an error, check if this is an authentication error
    checkError: ({ status }: { status: number }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem("username");
            return Promise.reject();
        }
        return Promise.resolve();
    },
    // when the user navigates, make sure that their credentials are still valid
    checkAuth: () => {
        return localStorage.getItem("isAuthenticated")
            ? Promise.resolve()
            : Promise.reject();
    },
    // remove local credentials and notify the auth server that the user logged out
    logout: () => {
        console.log("Logout was called")
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
        return Promise.resolve()
    },
    // get the user's profile
    getIdentity: () => {
        console.log("getIdentity was called")
        const userIdentity: UserIdentity = {
            id: "123",
            fullName: "test"
        };
        return Promise.resolve(userIdentity)
    },
    // get the user permissions (optional)
    getPermissions: () => {
        console.log("getPermissions was called")
        return Promise.resolve([])
    },
};