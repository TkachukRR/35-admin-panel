import { inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { User } from "../interfaces/user";
import { StorageService } from "./storage.service";
import { catchError, map, Observable, of, pipe, switchMap, tap, throwError } from "rxjs";
import { UserResponse } from "../interfaces/user-response";
import { Message } from "../interfaces/message";
import { MessageType } from "../enums/message-type";
import { logMessages } from "@angular-devkit/build-angular/src/tools/esbuild/utils";

@Injectable({
  providedIn: 'root'
})
export class UsersService{
  private _store = inject(StorageService);
  private messageLive = 3000

  private _allUsersSub = this._store.getAll().pipe(
    map((users: UserResponse[]) => users.map( user => this.convertToUser(user))),
    tap(users => this.allUsers.set(users))
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


  public allUsers = signal([] as User[])

  public selectedName = signal<string>('')
  public message = signal<Message>({} as Message)

  private _userSelected$: Observable<User> = toObservable(this.selectedName).pipe(
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
    map(user => this.convertToUser(user)),
    tap( user => {
      if (!!Object.keys(user).length) {
        this.loadingUserInfo.set(false);
        this.message.set({
          type: MessageType.success,
          info: 'user info loaded'
        });
        setTimeout(() => this.message.set({} as Message), this.messageLive)
        return
      }
      this.message.set({} as Message)
    })
  )

  public userSelected= toSignal<User, User>(this._userSelected$, {initialValue: {} as User})
  public loadingUserInfo = signal(false)

  public updateUser(nick: string, user: User) {
    const userResp = this.convertToUserResponse(user)
    this._store.updateUser(nick, userResp).subscribe(
      updatedUser => {
        const updatedUserIndex = this.allUsers().findIndex(user => user.nick === nick)
        const newUsers = [...this.allUsers()]

        newUsers[updatedUserIndex] = this.convertToUser(updatedUser)
        this.allUsers.set(newUsers)
      }
    )
  }

  public deleteUser(user: User){
    const userDel = this.convertToUserResponse(user)

    this._store.deleteUser(userDel.username).subscribe(
      deletedUser => {
        const newUsers = this.allUsers().filter(user => user.nick !== deletedUser.username)
        this.allUsers.set(newUsers)
      }
    )}
}
