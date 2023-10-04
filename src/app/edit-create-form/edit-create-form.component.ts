import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormState } from "../enums/form-state";
import { UserType } from "../enums/user-type";
import { UsersService } from "../services/users.service";
import { toObservable } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-edit-create-form',
  templateUrl: './edit-create-form.component.html',
  styleUrls: ['./edit-create-form.component.scss']
})
export class EditCreateFormComponent{
  private _fb = inject(FormBuilder);
  private _us = inject(UsersService)

  private userSelected = this._us.userSelected
  private selectedName = this._us.selectedName

  public formState = signal<FormState>(FormState.create);
  public loading = this._us.loadingUserInfo
  public editFormTitle = signal('Edit user')

  public userTypes: UserType[] = [ UserType.Administrator, UserType.Driver]
  public userForm: FormGroup = this._fb.group({
    username: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
    firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Zа-яА-Я]+$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Zа-яА-Я]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    type: ['', Validators.required],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]+$/)]],
    repeatPassword: ['', Validators.required]
  })

  selectedUser$ = toObservable((this.userSelected)).subscribe(
    (user) => {
      this.editFormTitle.set(`${user.first_name} ${user.last_name}`)
      this.userForm.patchValue({
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        type: user.user_type,
        password: user.password,
        repeatPassword: user.password
      })
    })

  loading$ = toObservable(this.loading).subscribe(
    () => {
      this.editFormTitle.set('Edit user')
    }
  )

  selectedName$ = toObservable(this.selectedName).subscribe(
    name => {
      if (name === '') this.formState.set(FormState.create);
      else this.formState.set(FormState.edit);
    }
  )

  public onSubmit(){
  }

  public onCreate(){
  }

  public onDelete(){
  }

  public onSave() {
  }

  protected readonly FormState = FormState;
}
