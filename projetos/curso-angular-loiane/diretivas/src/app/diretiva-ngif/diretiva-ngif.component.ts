import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-diretiva-ngif',
  templateUrl: './diretiva-ngif.component.html',
  styleUrls: ['./diretiva-ngif.component.css']
})
export class DiretivaNgifComponent implements OnInit {

  animes: string[] = [];

  mostrarAnime: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  onMostrarAnimes() {
    this.mostrarAnime = !this.mostrarAnime;
  }

}
