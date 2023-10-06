import { Component, inject, signal } from '@angular/core';
import { UsersService } from "../services/users.service";
import { User } from "../interfaces/user";
import { MessageType } from "../enums/message-type";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  public _userService = inject(UsersService);
  private selectedUser = this._userService.userSelected
  public selectedUserName = this._userService.selectedName;
  public message = this._userService.message

  public formVisible = signal( false )

  public onCreateUser() {
    this.selectedUserName.set('')
    this.selectedUser.set({} as User)
    this.formVisible.set(true)
  }

  public onClose(){
    this.selectedUserName.set('')
    this.selectedUser.set({} as User)
    this.formVisible.set(false)
  }

  protected readonly MessageType = MessageType;
}
