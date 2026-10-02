import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
})
export class TestComponent implements OnInit {
  variavel = 1;
  ngOnInit(): void {
    console.log('Hello from TestComponent.');
  }
}
