/**
 * The type `InfoUser` defines a structure containing user information such as id, name, registration
 * date, and additional details like height, weight, and activity level.
 * @property {number} id - The `id` property in the `InfoUser` type represents a unique identifier for
 * the user.
 * @property {string} name - The `InfoUser` type includes the following properties:
 * @property {string} registrationDate - The `registrationDate` property in the `InfoUser` type
 * represents the date when the user registered. It is of type string.
 * @property infoUser - The `infoUser` property in the `InfoUser` type represents additional
 * information about a user, including their ID, height, weight, and activity level.
 */
export type InfoUser = {
  id: number;
  name: string;
  registrationDate: string;
  infoUser: {
    id: number;
    height: number;
    weight: number;
    activityLevel: string;
    sex: string;
    age: number;
  };
};
