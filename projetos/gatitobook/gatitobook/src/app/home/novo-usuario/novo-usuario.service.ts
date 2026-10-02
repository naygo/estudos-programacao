import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NovoUsuario } from './novo-usuario';

@Injectable({
  providedIn: 'root',
})
export class NovoUsuarioService {
  constructor(private httpClient: HttpClient) {}

  cadastraNovoUsuario(novoUsuario: NovoUsuario): Observable<any> {
    return this.httpClient.post('http://localhost:3000/user/signup', novoUsuario);
  }

  verificaUsuarioExistente(usuario: string): Observable<any> {
    return this.httpClient.get(`http://localhost:3000/user/exists/${usuario}`);
  }
}
