import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Anime } from '../anime.model';
import { AnimeService } from '../anime.service';

@Component({
  selector: 'app-anime-update',
  templateUrl: './anime-update.component.html',
  styleUrls: ['./anime-update.component.css']
})
export class AnimeUpdateComponent implements OnInit {

  anime: Anime;

  constructor(
    private animeService: AnimeService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.animeService.readById(id).subscribe(anime => {
      this.anime = anime;
    });
  }

  updateAnime(): void {
    this.animeService.update(this.anime).subscribe(() => {
      this.animeService.showMessage('Anime alterado com sucesso!');
      this.router.navigate(['/animes']);
    });
  }

  cancel():void {
    this.router.navigate(['/animes']);
  }
}
