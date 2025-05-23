/**
 * The above TypeScript code defines types for login information and login response, with the login
 * response containing an access token and additional dynamic properties.
 * @property {string} email - The `email` property in the `loginInfo` type represents the email address
 * of the user trying to log in.
 * @property {string} password - The `password` property in the `loginInfo` type represents the
 * password input provided by the user during the login process. It is a string type, used for
 * authentication purposes.
 */
export type loginInfo = {
  email: string;
  password: string;
};

