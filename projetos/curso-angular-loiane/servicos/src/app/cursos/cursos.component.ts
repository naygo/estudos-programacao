import { Component, OnInit } from '@angular/core';

import { CursosService } from './cursos.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css'],
  providers: [CursosService]
  // dependencia privada
})
export class CursosComponent implements OnInit {

  // Sem injeção de dependência
  // cursos: string[] = ['Angular', 'JavaScript', 'Node'];
  // cursosService: CursosService;

  // constructor() {
  //   this.cursosService = new CursosService();
  // }

  // ngOnInit(): void {
  //   this.cursos = this.cursosService.getCursos();
  // }

  cursos: string[] = ['Angular', 'JavaScript', 'Node'];

  constructor(
    private cursosService: CursosService
  ) {}

  ngOnInit(): void {
    this.cursos = this.cursosService.getCursos();

    // this.cursosService.emitirCursoCriado.subscribe(curso => {
    //   console.log(curso)
    // });

    CursosService.criouNovoCurso.subscribe(curso => {
       this.cursos.push(curso);
    });
  }

}
