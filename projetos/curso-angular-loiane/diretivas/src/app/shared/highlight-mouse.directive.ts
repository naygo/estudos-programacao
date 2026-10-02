import { Directive, HostListener, ElementRef, Renderer2, HostBinding } from '@angular/core';

@Directive({
  selector: '[highlightMouse]'
})
export class HighlightMouseDirective {

  @HostListener('mouseenter') onMouseOver(){
    //this.rederer.setStyle(this.elementRef.nativeElement, 'background-color', 'yellow');
    this.backgroundColor = 'yellow';
  }

  @HostListener('mouseleave') onMouseLeave(){
    //this.rederer.setStyle(this.elementRef.nativeElement, 'background-color', 'white');
    this.backgroundColor = 'white';
  }

  //@HostBinding('style.backgroundColor') backgroundColor: string;
  // se precisar de manipulação
  @HostBinding('style.backgroundColor') get setColor(){
    // código extra
    return this.backgroundColor;
  }

  private backgroundColor: string;

  constructor(
    private elementRef: ElementRef,
    private rederer: Renderer2
  ) { }

}
