import { inject, Injectable, signal } from '@angular/core';
import { toObservable } from "@angular/core/rxjs-interop";
import { User } from "../interfaces/user";
import { StorageService } from "./storage.service";
import { map, of, pipe, switchMap, tap } from "rxjs";
import { UserResponse } from "../interfaces/user-response";
import { Message } from "../interfaces/message";
import { MessageType } from "../enums/message-type";

@Injectable({
  providedIn: 'root'
})
export class UsersService{
  private _store = inject(StorageService);
  private _messageExpTime = 3000

  public allUsers = signal([] as User[])
  public selectedName = signal<string>('')
  public userSelected= signal<User>({} as User)

  public loadingUserInfo = signal(false)
  public message = signal<Message>({} as Message)

  private _allUsersSub = this._store.getAll().pipe(
    map((users: UserResponse[]) => users.map( user => this.convertToUser(user))),
    tap(users => {
      this.allUsers.set(users)
      this.message.set({
        type: MessageType.success,
        info: 'All users loaded'
      });
      setTimeout(() => this.message.set({} as Message), this._messageExpTime)
      return
    })
  ).subscribe()

  private _userSelectedSub = toObservable(this.selectedName).pipe(
    tap((selectedName) => {
      if (selectedName) {
        this.loadingUserInfo.set(true);
        this.message.set({
          type: MessageType.success,
          info:'loading user info'
        });
      }
    }),
    switchMap(selectedName => {
      if (!selectedName) {
        this.message.set({} as Message);
        return of({} as UserResponse);
      }

      return this._store.getUser(selectedName);
    }),
    map(user => {
      this.userSelected.set(this.convertToUser(user));
      return this.convertToUser(user)
    }),
    tap( user => {
      if (!!user.nick) {
        this.loadingUserInfo.set(false);
        this.message.set({
          type: MessageType.success,
          info: 'user info loaded'
        });
        setTimeout(() => this.message.set({} as Message), this._messageExpTime)
        return
      }
      this.message.set({} as Message)
    })
  ).subscribe()

  private convertToUser(userResp: UserResponse):User  {
    return {
      nick: userResp.username,
      firstName: userResp.first_name,
      lastName: userResp.last_name,
      email: userResp.email,
      password: userResp.password,
      type: userResp.user_type
    }
  }
  private convertToUserResponse(userResp: User):UserResponse  {
    return {
      username: userResp.nick,
      first_name: userResp.firstName,
      last_name: userResp.lastName,
      email: userResp.email,
      password: userResp.password,
      user_type: userResp.type
    }
  }

  public updateUser(nick: string, user: User) {
    const userResp = this.convertToUserResponse(user)
    this._store.updateUser(nick, userResp).subscribe(
      pipe(updatedUser => {
        const updatedUserIndex = this.allUsers().findIndex(user => user.nick === nick)
        const newUsers = [...this.allUsers()]

        newUsers[updatedUserIndex] = this.convertToUser(updatedUser)
        this.allUsers.set(newUsers)
        this.message.set({
          type: MessageType.success,
          info: 'User info updated'
        });
        setTimeout(() => this.message.set({} as Message), this._messageExpTime)
        return
      })
    )
  }

  public deleteUser(user: User){
    const userDel = this.convertToUserResponse(user)

    this._store.deleteUser(userDel.username).subscribe(
      deletedUser => {
        const newUsers = this.allUsers().filter(user => user.nick !== deletedUser.username)
        this.allUsers.set(newUsers)
        this.message.set({
          type: MessageType.success,
          info: 'User deleted'
        });
        setTimeout(() => this.message.set({} as Message), this._messageExpTime)
        return
      }
    )}

  public createUser(user: User){
    const newUser = this.convertToUserResponse(user)

    this._store.createUser(newUser).subscribe(
      () => {
        const newUsers = [user, ...this.allUsers()]
        this.allUsers.set(newUsers)
        this.message.set({
          type: MessageType.success,
          info: 'Created new user'
        });
        setTimeout(() => this.message.set({} as Message), this._messageExpTime)
        return
      }
    )
  }
}
