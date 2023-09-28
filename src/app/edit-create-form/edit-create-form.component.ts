import { Component, inject, Input, OnChanges, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormState } from "../enums/form-state";
import { FormUserTypes } from "../enums/form-user-types";

@Component({
  selector: 'app-edit-create-form',
  templateUrl: './edit-create-form.component.html',
  styleUrls: ['./edit-create-form.component.scss']
})
export class EditCreateFormComponent implements OnInit, OnChanges{
  private _fb = inject(FormBuilder);

  @Input() userName = '';

  public userTypes: FormUserTypes[] = [ FormUserTypes.admin, FormUserTypes.driver]
  public userForm!: FormGroup;
  public formState = signal<FormState>(FormState.create);

  ngOnInit(): void {
    this.userForm = this._fb.group({
      username: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-Zа-яА-Я]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-Zа-яА-Я]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      type: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]+$/)]],
      repeatPassword: ['', Validators.required]
    })
  }

  ngOnChanges(){
    switch (true) {
      case !!this.userName:
        this.formState.set(FormState.edit);
        break;

      default:
        this.formState.set(FormState.create);
        break;
    }
  }

  public onSubmit(){
  }

  public onCreate(){
  }

  public onDelete(){
  }

  protected readonly FormState = FormState;
}
