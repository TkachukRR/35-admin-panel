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
  private errorMsgDiv: HTMLDivElement | null = null;

  @HostListener('focus') onFocus(){
    this.inputEl.style.outline = "1px solid var(--txt-primary)";
    this.sub = this.control.statusChanges?.subscribe(
      () => this.handleValidation()
    );
  }

  @HostListener('blur') onBlur(){
    if (!this.control.errors) {
      this.inputEl.style.outline = 'none';
      return
    }

    this.inputEl.style.outline = '1px solid var(--bg-msg-error)';
    this.handleValidation();
    this.sub?.unsubscribe();
  }

  private updateInputErrors(errorKey: string){
    if (!this.control.errors) return

    switch (errorKey) {
      case 'required':
      this.inputErrors[errorKey] = `required field`;
        break;
      case 'pattern':
        this.inputErrors[errorKey] = `only ${this.control.errors[errorKey]['requiredPattern'].slice(3, -4)}`
        if (this.control.errors[errorKey]['requiredPattern'].includes('(?=.*[A-Z])') && !(/(?=.*[A-Z])/).test(this.control.errors[errorKey]['actualValue'])) this.inputErrors[errorKey] = 'one uppercase'
        if (this.control.errors[errorKey]['requiredPattern'].includes('(?=.*[a-z])') && !(/(?=.*[a-z])/).test(this.control.errors[errorKey]['actualValue'])) this.inputErrors[errorKey] = 'one lowercase'
        if (this.control.errors[errorKey]['requiredPattern'].includes('(?=.*\\d)') && !(/(?=.*\d)/).test(this.control.errors[errorKey]['actualValue'])) this.inputErrors[errorKey] = 'one number'
        if (this.control.errors[errorKey]['requiredPattern'].includes('(?=.*[@#$!%*?&])') && !(/(?=.*[@#$!%*?&])/).test(this.control.errors[errorKey]['actualValue'])) this.inputErrors[errorKey] = 'one symbol'
        if (this.control.errors[errorKey]['requiredPattern'].includes('[a-zA-Z0-9]') && !(/^[a-zA-Z0-9]+$/).test(this.control.errors[errorKey]['actualValue'])) this.inputErrors[errorKey] = 'only Latin letters and numbers'
        if (this.control.errors[errorKey]['requiredPattern'].includes('[a-zA-Zа-яА-Я]') && !(/^[a-zA-Zа-яА-Я]+$/).test(this.control.errors[errorKey]['actualValue'])) this.inputErrors[errorKey] = 'only Cyrillic and Latin letters'
        if (this.control.errors[errorKey]['requiredPattern'].includes('[A-Za-z\\d@#$!%*?&]') && !(/^[A-Za-z\d@#$!%*?&]+$/).test(this.control.errors[errorKey]['actualValue'])) this.inputErrors[errorKey] = 'only Latin letters, numbers and symbols @#$!%*?&'
        break;
      case 'minlength':
      this.inputErrors[errorKey] = `minlength ${this.control.errors['minlength']['requiredLength']}`;
        break;
      case 'email':
        this.inputErrors[errorKey] = `isn't e-mail`;
        break;
    }
  }

  private setErrorMessage() {
    const errorKeys = Object.keys(this.inputErrors)
    this.errorMessage ='Error: ' + errorKeys.map(error => this.inputErrors[error]).join(', ')
  }

  private createErrorMsgDiv(){
    this.errorMsgDiv = document.createElement('div');
    this.errorMsgDiv.style.color = 'var(--bg-msg-error)';
    this.errorMsgDiv.textContent = this.errorMessage;
    this.parentWrapperDivEl.append(this.errorMsgDiv)
  }

  private handleValidation(){
    this.resetErrorsState()
    if (!this.control.errors) return

    Object.keys(this.control.errors).map( errorKey => this.updateInputErrors(errorKey))
    this.setErrorMessage()
    this.inspectErrorMsgDiv()
  }

  private resetErrorsState(){
    this.inputErrors = {}
    this.errorMessage = ''
    if (this.errorMsgDiv) {
      this.parentWrapperDivEl.removeChild(this.errorMsgDiv)
      this.errorMsgDiv = null
    }
  }

  private inspectErrorMsgDiv(){
    !this.errorMsgDiv ? this.createErrorMsgDiv() : this.errorMsgDiv.textContent = this.errorMessage
  }

  public ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }
}
