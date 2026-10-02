import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-value-accessor',
  templateUrl: './value-accessor.component.html',
})
export class ValueAccessorComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      double: new FormControl(),
      testComponent: new FormControl({ value: 0, disabled: false }) // inicial values
    });

    this.setDoubleValue();
  }

  get double() { return this.form.get('double'); }
  get testComponent() { return this.form.get('testComponent'); }

  setDoubleValue() {
    this.testComponent?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.double?.setValue(value * 2);
      });
  }

  logValues() {
    console.log(this.form.value);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
