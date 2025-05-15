export type loginInfo = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  [key: string]: any;
};
