import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar'

import { Observable, EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


import { Anime } from './anime.model';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  baseUrl = 'http://localhost:3001/animes'

  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) { }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, 'x', {
      duration: 4000,
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: isError ? ['msg-error'] : ['msg-sucess']
    });
  }

  
  read(): Observable<Anime[]> {
    return this.http.get<Anime[]>(this.baseUrl);
  }
  
  readById(id: number): Observable<Anime> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Anime>(url);
  }
  
  errorHandler(e: any): Observable<any> {
    this.showMessage('Ocorreu um erro...', true);
    return EMPTY;
  }

  // CRUD
  create(anime: Anime): Observable<Anime> {
    return this.http.post<Anime>(this.baseUrl, anime).pipe(
      map((obj) => obj), 
      catchError(e => this.errorHandler(e))
    );
  }

  update(anime: Anime): Observable<Anime> {
    const url = `${this.baseUrl}/${anime.id}`;
    return this.http.put<Anime>(url, anime).pipe(
      map((obj) => obj), 
      catchError(e => this.errorHandler(e))
    );;
  }

  delete(id: number): Observable<Anime> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<Anime>(url).pipe(
      map((obj) => obj), 
      catchError(e => this.errorHandler(e))
    );;
  }
}
