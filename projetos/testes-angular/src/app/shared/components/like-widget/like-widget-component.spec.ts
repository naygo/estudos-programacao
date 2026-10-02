import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { UniqueIdService } from "../../services/unique-id/unique-id.service";
import { LikeWidgetComponent } from "./like-widget.component";
import { LikeWidgetModule } from "./like-widget.module";

describe(`${LikeWidgetComponent.name}`, () => {
    let fixture: ComponentFixture<LikeWidgetComponent> = null;
    let component: LikeWidgetComponent = null;

    beforeEach(async () => {
        //component = new LikeWidgetComponent(new UniqueIdService())
        await TestBed.configureTestingModule({
            // declarations: [ LikeWidgetComponent ],
            // imports: [ 
            //     FontAwesomeModule
            // ],
            // providers: [
            //     UniqueIdService
            // ]
            imports: [LikeWidgetModule]
        }).compileComponents();

        fixture = TestBed.createComponent(LikeWidgetComponent);
        component = fixture.componentInstance;
    });

    it('Should create component', () => {
        //const component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    it('Should auto-generate ID when (@Input id) is not assigned', () => {
        //const component = fixture.componentInstance;

        fixture.detectChanges();
        expect(component.id).toBeTruthy();
    });

    it('Should NOT auto-generate ID during ngOnInit when (@Input id) is assigned', () => {
        //const component = fixture.componentInstance;
        const someId = 'someId';
        
        component.id = someId;

        fixture.detectChanges();
        expect(component.id).toBeTruthy();
    });

    it(`${LikeWidgetComponent.prototype.like.name} 
        should trigger (@Output liked) when called`, () => {
            spyOn(component.liked, 'emit');
            fixture.detectChanges();

            // component.liked.subscribe(() => {
            //     expect(true).toBeTrue();
            //     // done();
            // });
            // component.like();

            component.like();
            expect(component.liked.emit).toHaveBeenCalled();
    });
});