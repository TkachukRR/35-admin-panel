import { Component, inject, signal } from '@angular/core';
import { UsersService } from "../services/users.service";
import { User } from "../interfaces/user";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  public _userService = inject(UsersService);
  private selectedUser = this._userService.userSelected
  public selectedUserName = this._userService.selectedName;

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
}
