import { Component, OnInit } from '@angular/core';
import { Anime } from '../anime.model';
import { AnimeService } from '../anime.service';

@Component({
  selector: 'app-anime-read',
  templateUrl: './anime-read.component.html',
  styleUrls: ['./anime-read.component.css']
})
export class AnimeReadComponent implements OnInit {

  animes: Anime[];
  displayedColumns = ['id', 'nome', 'nota', 'action'];

  constructor(
    private animeService: AnimeService
  ) { }

  ngOnInit(): void {
    this.animeService.read().subscribe(animes => {
      this.animes = animes
      console.log(animes)
    })
  }
}
