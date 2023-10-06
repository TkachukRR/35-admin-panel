import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormState } from "../enums/form-state";
import { UserType } from "../enums/user-type";
import { UsersService } from "../services/users.service";
import { toObservable } from "@angular/core/rxjs-interop";
import { User } from "../interfaces/user";
import { MainPageComponent } from "../main-page/main-page.component";

@Component({
  selector: 'app-edit-create-form',
  templateUrl: './edit-create-form.component.html',
  styleUrls: ['./edit-create-form.component.scss']
})
export class EditCreateFormComponent{
  private _fb = inject(FormBuilder);
  private _us = inject(UsersService)
  private _mp = inject(MainPageComponent)

  private userSelected = this._us.userSelected
  private selectedName = this._us.selectedName

  public formState = signal<FormState | null>(null);
  public loading = this._us.loadingUserInfo
  public formTitle = computed( () => {
      switch (this.formState()) {
        case FormState.create:
          return 'Create new user'

        case FormState.edit:
          return this.loading() ? 'Edit user' : this.userSelected().firstName + ' ' + this.userSelected().lastName

        default: return ''
      }
  })

  public userTypes: UserType[] = [ UserType.Administrator, UserType.Driver]
  public userForm: FormGroup = this._fb.group({
    nick: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
    firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Zа-яА-Я]+$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Zа-яА-Я]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    type: ['', Validators.required],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]+$/)]],
    repeatPassword: ['', Validators.required]
  })

  selectedUser$ = toObservable((this.userSelected)).subscribe(
    (user: User) => {
      this.userForm.patchValue({...user, repeatPassword: user.password})
    })

  selectedName$ = toObservable(this.selectedName).subscribe(
    name => {
      if (name === '') this.formState.set(FormState.create);
      else this.formState.set(FormState.edit);
    }
  )

  public onSubmit(){
    switch (this.formState()){
      case FormState.create:
        this.onCreate();
        break

      case FormState.edit:
        this.onSave();
        break
    }
  }

  public onCreate(){
    this._us.createUser(this.userForm.value)
    this._mp.onClose()
  }

  public onDelete(){
    this._us.deleteUser(this.userForm.value)
    this._mp.onClose()
  }

  public onSave() {
    this._us.updateUser(this.selectedName(), this.userForm.value)
    this._mp.onClose()
  }

  protected readonly FormState = FormState;
}
