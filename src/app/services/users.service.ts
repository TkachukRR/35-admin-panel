import { inject, Injectable, Signal, signal } from '@angular/core';
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { User } from "../interfaces/user";
import { StorageService } from "./storage.service";
import { filter, map, Observable, switchMap, tap } from "rxjs";
import { UserResponse } from "../interfaces/user-response";
import { Message } from "../interfaces/message";
import { MessageType } from "../enums/message-type";

@Injectable({
  providedIn: 'root'
})
export class UsersService {private _store = inject(StorageService);

  private _allUsers$: Observable<User[]> = this._store.getAll().pipe(
    map((users: UserResponse[]) => users.map(
      user => {
        const userConverted: User = {
          nick: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          password: user.password,
          type: user.user_type
        }
        return userConverted
      }
    ))
  )

  public allUsers: Signal<User[]> = toSignal(this._allUsers$, {initialValue: [] as User[]})

  public selectedName = signal<string>('')
  public message = signal<Message>({} as Message)

  private _userSelected$ = toObservable(this.selectedName).pipe(
    filter(Boolean),
    tap(() => this.message.set({
      type: MessageType.success,
      info:'loading user info'
    })),
    switchMap(selectedName=> this._store.getUser(selectedName)),
    tap(() => {
      this.message.set({
        type: MessageType.success,
        info:'user info loaded'
      });
      setTimeout(() => this.message.set({} as Message), 3000)
    }),
  )

  public userSelected = toSignal(this._userSelected$)
}
