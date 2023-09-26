import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { toSignal } from "@angular/core/rxjs-interop";
import { User } from "../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private localFile = 'assets/users.json';

  private _http = inject(HttpClient);

  private _users$ = this._http.get<User[]>(this.localFile);

  public users = toSignal(this._users$, {initialValue : [] as User[]})

  public selectedUserName = signal('')

  public setSelectedUserName(userName: string): void{
    this.selectedUserName.set(userName)
  }
}
