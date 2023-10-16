import { Directive, ElementRef, HostListener, inject, OnDestroy } from '@angular/core';
import { NgControl } from "@angular/forms";
import { Subscription } from "rxjs";

@Directive({
  selector: '[appValidationError]'
})
export class ValidationErrorDirective implements OnDestroy{
  private elRef = inject(ElementRef);
  private control = inject(NgControl);

  private sub!: Subscription | undefined;

  private parentWrapperDivEl: HTMLDivElement = this.elRef.nativeElement.parentNode;
  private inputEl: HTMLInputElement = this.elRef.nativeElement;

  private inputErrors: any = {};
  private errorMessage = '';
  private errorMsgDiv!: HTMLDivElement | null;

  @HostListener('focus') onFocus(){
    this.inputEl.style.outlineColor = "1px solid var(--txt-primary)"

    this.sub = this.control.statusChanges?.subscribe(
      () => {
        if (!this.control.errors) {
          this.inputErrors = {}
          this.errorMessage = ''
          if (this.errorMsgDiv) {
            this.parentWrapperDivEl.removeChild(this.errorMsgDiv)
            this.errorMsgDiv = null
          }
          return
        }

        Object.keys(this.control.errors).map( errorKey => {
          this.deleteUnExistingErrors()
          this.updateErrors(errorKey)
          this.setErrorMessage()
          if (!this.errorMsgDiv) {
            this.prepareErrorDiv()
            if (this.errorMsgDiv) this.parentWrapperDivEl.append(this.errorMsgDiv)
          } else {
            this.errorMsgDiv.textContent = this.errorMessage
          }
        })
      }
    )
  }

  @HostListener('blur') onBlur(){
    if (!this.control.errors) return

    this.inputEl.style.outline = '1px solid var(--bg-msg-error)';

    Object.keys(this.control.errors).map( errorKey => {
      this.deleteUnExistingErrors()
      this.updateErrors(errorKey)
      this.setErrorMessage()
      if (!this.errorMsgDiv) {
        this.prepareErrorDiv()
        if (this.errorMsgDiv) this.parentWrapperDivEl.append(this.errorMsgDiv)
      } else {
        this.errorMsgDiv.textContent = this.errorMessage
      }
    })
    this.sub?.unsubscribe()
  }

  private deleteUnExistingErrors(){
    Object.keys(this.inputErrors).filter(key => !this.control.errors?.[key]).map(key => delete this.inputErrors[key])
  }

  private updateErrors(errorKey: string){
    if (this.control.errors && errorKey === 'required') {
      this.inputErrors[errorKey] = `required field`
    }
    if (this.control.errors && errorKey === 'pattern') {
      this.inputErrors[errorKey] = `only ${this.control.errors[errorKey]['requiredPattern'].slice(3, -4)}`
    }
    if (this.control.errors && errorKey === 'minlength') {
      this.inputErrors[errorKey] = `minlength ${this.control.errors['minlength']['requiredLength']}`
    }
  }

  private setErrorMessage() {
    const errorKeys = Object.keys(this.inputErrors)
    this.errorMessage ='Error: ' + errorKeys.map(error => this.inputErrors[error]).join(', ')
  }

  private prepareErrorDiv(){
    this.errorMsgDiv = document.createElement('div');
    this.errorMsgDiv.style.color = 'var(--bg-msg-error)';
    this.errorMsgDiv.textContent = this.errorMessage
  }

  public ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }
}
