import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-edit-create-form',
  templateUrl: './edit-create-form.component.html',
  styleUrls: ['./edit-create-form.component.scss']
})
export class EditCreateFormComponent implements OnInit{
  private _fb = inject(FormBuilder);

  @Input() userName = '';

  public userForm!: FormGroup

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
}
