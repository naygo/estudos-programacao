import { Directive, HostBinding, HostListener, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[highlight]'
})
export class HighlightDirective {

  @HostListener('mouseenter') onMouseOver(){
    this.backgroundColor = this.hightlightColor;
  }

  @HostListener('mouseleave') onMouseLeave(){
    this.backgroundColor = this.defaultColor;
  }

  @HostBinding('style.backgroundColor') get setColor(){
    return this.backgroundColor;
  }

  private backgroundColor: string;

  @Input() defaultColor: string = 'white';
  @Input('hightlight') hightlightColor: string = 'yellow';

  constructor(
    private elementRef: ElementRef,
    private rederer: Renderer2
  ) { }

}
