import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { first, map, switchMap } from 'rxjs';
import { NovoUsuarioService } from './novo-usuario.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioExisteService {
  constructor(private novoUsuarioService: NovoUsuarioService) {}

  usuarioJaExite(): Function {
    return (control: AbstractControl) => {
      return control.valueChanges.pipe(
        switchMap((nomeUsuario) => // troca o fluxo
          this.novoUsuarioService.verificaUsuarioExistente(nomeUsuario)
        ),
        map((usuarioExiste) => // troca o resultado
          usuarioExiste ? { usuarioExistente: true } : null
        ),
        first() // encerra o observable
      );
    };
  }
}
