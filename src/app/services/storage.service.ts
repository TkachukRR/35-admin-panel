import { Injectable } from '@angular/core';
import { delay, Observable, of } from "rxjs";
import { UserResponse } from "../interfaces/user-response";
import { UserType } from "../enums/user-type";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _users: UserResponse[] = [
    {
      "username":"mperry1992",
      "first_name":"Matthew",
      "last_name":"Perry",
      "email":"matthew@mail.com",
      "user_type":UserType.Administrator,
      "password":"asd%F1gf"
    },
    {
      "username":"mperry1993",
      "first_name":"Matthew",
      "last_name":"Perry",
      "email":"matthew@mail.com",
      "user_type":UserType.Administrator,
      "password":"asd%F1gf"
    },
    {
      "username":"mperry1994",
      "first_name":"Matthew",
      "last_name":"Perry",
      "email":"matthew@mail.com",
      "user_type":UserType.Driver,
      "password":"asd%F1gf"
    },
    {
      "username":"mperry1995",
      "first_name":"Matthew",
      "last_name":"Perry",
      "email":"matthew@mail.com",
      "user_type":UserType.Administrator,
      "password":"asd%F1gf"
    },
    {
      "username":"mperry1996",
      "first_name":"Matthew",
      "last_name":"Perry",
      "email":"matthew@mail.com",
      "user_type":UserType.Driver,
      "password":"asd%F1gf"
    },
    {
      "username":"mperry1997",
      "first_name":"Matthew",
      "last_name":"Perry",
      "email":"matthew@mail.com",
      "user_type":UserType.Administrator,
      "password":"asd%F1gf"
    },
    {
      "username":"mperry1998",
      "first_name":"Matthew",
      "last_name":"Perry",
      "email":"matthew@mail.com",
      "user_type":UserType.Administrator,
      "password":"asd%F1gf"
    },
    {
      "username":"mperry1999",
      "first_name":"Matthew",
      "last_name":"Perry",
      "email":"matthew@mail.com",
      "user_type":UserType.Administrator,
      "password":"asd%F1gf"
    },
    {
      "username":"mperry2000",
      "first_name":"Matthew",
      "last_name":"Perry",
      "email":"matthew@mail.com",
      "user_type":UserType.Administrator,
      "password":"asd%F1gf"
    },
    {
      "username":"mperry2001",
      "first_name":"Matthew",
      "last_name":"Perry",
      "email":"matthew@mail.com",
      "user_type":UserType.Administrator,
      "password":"asd%F1gf"
    },
    {
      "username":"mperry2002",
      "first_name":"Matthew",
      "last_name":"Perry",
      "email":"matthew@mail.com",
      "user_type":UserType.Administrator,
      "password":"asd%F1gf"
    },
    {
      "username":"mperry2003",
      "first_name":"Matthew",
      "last_name":"Perry",
      "email":"matthew@mail.com",
      "user_type":UserType.Administrator,
      "password":"asd%F1gf"
    }
  ]

  public getAll():Observable<UserResponse[]>{
    return of(this._users).pipe(
      delay(2000)
    )
  }

  public getUser(userName: string): Observable<UserResponse> {
    const userIndex: number = this._users.findIndex(user => user.username === userName);
    if (userIndex === -1) throw new Error(`User ${userName} not found`)

    return of(this._users[userIndex]).pipe(
      delay(1000)
    );
  }

  public updateUser(userName: string, updatingUser: UserResponse): Observable<UserResponse> {
    const userIndex: number = this._users.findIndex(user => user.username === userName);
    if (userIndex === -1) throw new Error(`User ${userName} not found`)
    this._users[userIndex] = updatingUser

    return of(this._users[userIndex]).pipe(
      delay(1000)
    );
  }

  public deleteUser(userName: string): Observable<UserResponse> {
    const userIndex: number = this._users.findIndex(user => user.username === userName);
    if (userIndex === -1) throw new Error(`User ${userName} not found`)

    const deletedUser = this._users[userIndex]
    this._users.splice(userIndex, 1)

    return of(deletedUser).pipe(
      delay(1000)
    );
  }
}
