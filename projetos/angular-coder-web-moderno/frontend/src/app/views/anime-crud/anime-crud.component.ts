import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/components/template/header/header.service';

@Component({
  selector: 'app-anime-crud',
  templateUrl: './anime-crud.component.html',
  styleUrls: ['./anime-crud.component.css']
})
export class AnimeCrudComponent implements OnInit {

  constructor(
    private headerService: HeaderService,
    private router: Router
    ) { 
    headerService.headerData = {
      title: 'Animes',
      icon: 'ondemand_video',
      routeUrl: '/animes'
    }
  }

  ngOnInit(): void {
  }

  navigateToAnimeCreate(): void {
    this.router.navigate(['/animes/create']);
  }


}
