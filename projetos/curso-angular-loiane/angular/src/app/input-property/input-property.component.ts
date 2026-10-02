import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input-property.component.html',
  styleUrls: ['./input-property.component.css'],
  //inputs: ['nomeAnime:nome']
})
export class InputPropertyComponent implements OnInit {

  @Input('nome') nomeAnime: string = '';
  //nomeAnime: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
