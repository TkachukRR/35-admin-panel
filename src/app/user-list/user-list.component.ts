import { Component, inject } from '@angular/core';
import { UsersService } from "../services/users.service";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  private _userService = inject(UsersService);

  public tableHeaders: string[] = ['Username','First name','Last name','Email','Type'];
  public users = this._userService.users
  public selectedUser = this._userService.selectedUserName;

  onSelected(userName: string):void {
    this._userService.setSelectedUserName(userName);
  }
}
