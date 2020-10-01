import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Anime } from '../anime.model';
import { AnimeService } from '../anime.service';

@Component({
  selector: 'app-anime-delete',
  templateUrl: './anime-delete.component.html',
  styleUrls: ['./anime-delete.component.css']
})
export class AnimeDeleteComponent implements OnInit {

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

  deleteAnime(): void {
    this.animeService.delete(this.anime.id).subscribe(() => {
      this.animeService.showMessage('Anime deletado com sucesso!');
      this.router.navigate(['/animes']);
    });
  }

  cancel(): void {
    this.router.navigate(['/animes']);
  }

}
