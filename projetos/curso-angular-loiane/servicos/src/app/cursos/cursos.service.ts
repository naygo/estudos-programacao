import { EventEmitter, Injectable } from "@angular/core";
import { LogService } from "../shared/log.service";

@Injectable()
export class CursosService {

  emitirCursoCriado = new EventEmitter<string>();

  // não é necessária a instância deste para acessá-lo
  // usar quando tiver dependências privadas
  // variavel compartilhada
  static criouNovoCurso = new EventEmitter<string>();

  private cursos: string[] = ['Angular', 'JavaScript', 'Node'];

  constructor(
    private logService: LogService
  ){}

  getCursos() {
    this.logService.consoleLog('Obtendo lista de cursos');
    return this.cursos;
  }

  addCurso(curso: string) {
    this.logService.consoleLog(`Criando um novo curso ${curso}`);
    this.cursos.push(curso);
    this.emitirCursoCriado.emit(curso);
    CursosService.criouNovoCurso.emit(curso);
  }
}
