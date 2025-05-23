/**
 * The InfoAdvice type in TypeScript represents an object with title, description, and creationDate
 * properties.
 * @property {string} title - The `title` property in the `InfoAdvice` type represents the title of the
 * advice or information being provided. It is expected to be a string value.
 * @property {string} description - The `description` property in the `InfoAdvice` type represents a
 * string that provides details or information about a particular advice or topic. It is used to
 * describe or explain the advice being provided.
 * @property {string} creationDate - The `creationDate` property in the `InfoAdvice` type represents
 * the date when the information or advice was created or published. It is a string type, which
 * typically stores the date in a specific format such as "YYYY-MM-DD" or "MM/DD/YYYY".
 */
export type InfoAdvice = {
  id: number;
  title: string;
  description: string;
  creationDate: string;
};
