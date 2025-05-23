/**
 * The type `userRegister` defines the structure of user registration data including name, email,
 * password, and additional user information such as height, weight, activity level, sex, and age.
 * @property {string} name - The `name` property in the `userRegister` type represents the name of the
 * user registering. It is of type string.
 * @property {string} email - The `email` property in the `userRegister` type represents the email
 * address of the user registering for an account.
 * @property {string} password - The `password` property in the `userRegister` type represents the
 * password that a user would use to log in to their account. It is a string type in this case.
 * @property infoUser - The `infoUser` property within the `userRegister` type includes the following
 * sub-properties: height, weight, activityLevel, sex, and age. These properties provide
 */
export type userRegister = {
  name: string;
  email: string;
  password: string;
  infoUser: {
    height: number;
    weight: number;
    activityLevel: string;
    sex: string;
    age: number;
  };
};
