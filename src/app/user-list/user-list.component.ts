import { Component, inject, Signal } from '@angular/core';
import { UsersService } from "../services/users.service";
import { User } from "../interfaces/user";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  private quantitySkeletonElements = 10
  private _userService = inject(UsersService);

  public skeletonElements = new Array<User>(this.quantitySkeletonElements).fill({} as User)
  public tableHeaders: string[] = ['Username','First name','Last name','Email','Type'];
  public users: Signal<User[]> = this._userService.allUsers

  public selectedUser = this._userService.selectedName;

  onSelected(userName: string):void {
    this._userService.selectedName.set(userName)
  }
}
