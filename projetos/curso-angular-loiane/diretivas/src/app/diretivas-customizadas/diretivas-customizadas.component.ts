import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-diretivas-customizadas',
  templateUrl: './diretivas-customizadas.component.html',
  styleUrls: ['./diretivas-customizadas.component.css']
})
export class DiretivasCustomizadasComponent implements OnInit {

  mostrarAnime: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  onMostrarAnimes() {
    this.mostrarAnime = !this.mostrarAnime;
  }

}
