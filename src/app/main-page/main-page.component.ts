import { Component, computed, inject, signal } from '@angular/core';
import { UsersService } from "../services/users.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  private _userService = inject(UsersService);
  public selectedUser = this._userService.selectedUserName;

  private editUserFormVisible = signal(!!this.selectedUser())
  private createUserFormVisible = signal(true) //TODO false

  public formVisible = computed( () => this.editUserFormVisible() || this.selectedUser() || this.createUserFormVisible() )

  public onCreateUser() {
    this.selectedUser.set('')
    this.editUserFormVisible.set(false)
    this.createUserFormVisible.set(true)
  }

  public onClose(){
    this.selectedUser.set('')
    this.editUserFormVisible.set(false)
    this.createUserFormVisible.set(false)
  }
}
