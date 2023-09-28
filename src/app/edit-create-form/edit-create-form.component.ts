import { Component, inject, Input, OnChanges, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { FormState } from "../enums/form-state";

@Component({
  selector: 'app-edit-create-form',
  templateUrl: './edit-create-form.component.html',
  styleUrls: ['./edit-create-form.component.scss']
})
export class EditCreateFormComponent implements OnInit, OnChanges{
  private _fb = inject(FormBuilder);

  @Input() userName = '';

  public userForm!: FormGroup;
  public formState = signal<FormState>(FormState.create);

  ngOnInit(): void {
      this.userForm = this._fb.group({
        username: [''],
        firstName: [''],
        lastName: [''],
        email: [''],
        type: [''],
        password: [''],
        repeatPassword: [''],
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
}
