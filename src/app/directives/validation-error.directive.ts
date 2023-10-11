import { Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AbstractControl } from "@angular/forms";

@Directive({
  selector: '[appValidationError]'
})
export class ValidationErrorDirective implements OnInit{
  @Input('appValidationError') public userFormControl!: AbstractControl;

  private _viewContainerRef = inject(ViewContainerRef);
  private _templateRef = inject(TemplateRef);

  public ngOnInit(): void {
    this._viewContainerRef.createEmbeddedView(this._templateRef);
  }
}
