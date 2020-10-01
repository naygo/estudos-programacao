import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Anime } from '../anime.model';
import { AnimeService } from '../anime.service';

@Component({
  selector: 'app-anime-create',
  templateUrl: './anime-create.component.html',
  styleUrls: ['./anime-create.component.css']
})
export class AnimeCreateComponent implements OnInit {

  anime: Anime = {
    nome: '',
    nota: null
  }

  constructor(
    private animeService: AnimeService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  createAnime(): void {
    this.animeService.create(this.anime).subscribe(() => {
      this.animeService.showMessage('Anime criado!')
      this.router.navigate(['/animes'])
    });    
  }

  cancel(): void {
    this.router.navigate(['/animes']);
  }

}
