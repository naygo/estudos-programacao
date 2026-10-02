import { 
  Component, 
  OnInit,
  OnChanges,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked, 
  Input} from '@angular/core';

@Component({
  selector: 'app-ciclo',
  templateUrl: './ciclo.component.html',
  styleUrls: ['./ciclo.component.css']
})
export class CicloComponent implements OnInit, OnChanges, DoCheck, AfterContentInit,
  AfterContentChecked, AfterViewInit, AfterViewChecked {

    @Input() valorInicial: number = 10;

  constructor() { 
    console.log('contructor');
  }

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  ngOnChanges() {
    console.log('ngOnChanges');
  }

  ngDoCheck() {
    console.log('ngDoCheck');
  }

  ngAfterContentInit () {
    console.log('ngAfterContentInit');
  }
  
  ngAfterViewInit () {
    console.log('ngAfterViewInit');
  }

  ngAfterContentChecked () {
    console.log('ngAfterContentChecked');
  }

  ngAfterViewChecked () {
    console.log('ngAfterViewChecked');
  }

  ngOnDestroy () {
    console.log('ngOnDestroy');
  }
}
