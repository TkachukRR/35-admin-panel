import { UserType } from "../enums/user-type";

export interface UserResponse {
  "username": string;
  "first_name": string;
  "last_name": string;
  "email": string;
  "user_type": UserType;
  "password": string;
}
