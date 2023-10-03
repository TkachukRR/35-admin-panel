import { UserType } from "../enums/user-type";

export interface User {
  "nick": string;
  "firstName": string;
  "lastName": string;
  "email": string;
  "password": string;
  "type": UserType;
}
