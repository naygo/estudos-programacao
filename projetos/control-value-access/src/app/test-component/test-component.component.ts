import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: TestComponentComponent,
    multi: true
  }]
})
export class TestComponentComponent implements OnInit, ControlValueAccessor {
  value = 0;
  disabled = false;

  onChange: (value: number) => void;
  onTouched: () => void;

  constructor() { }

  writeValue(obj: number): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit(): void { }

  setValue() {
    if (this.disabled) return;

    this.value += 1;
    this.onChange(this.value);
    this.onTouched();
  }
}
