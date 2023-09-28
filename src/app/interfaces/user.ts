import { FormUserTypes } from "../enums/form-user-types";

export interface User {
  "username": string,
  "first_name": string,
  "last_name": string,
  "email": string,
  "user_type": FormUserTypes,
  "password": string
}
