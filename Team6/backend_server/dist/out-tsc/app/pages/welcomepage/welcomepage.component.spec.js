import { TestBed } from '@angular/core/testing';
import { WelcomepageComponent } from './welcomepage.component';
describe('WelcomepageComponent', () => {
    let component;
    let fixture;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WelcomepageComponent]
        })
            .compileComponents();
        fixture = TestBed.createComponent(WelcomepageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
