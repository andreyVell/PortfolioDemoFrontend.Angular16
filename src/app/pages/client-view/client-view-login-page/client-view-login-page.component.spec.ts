import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientViewLoginPageComponent } from './client-view-login-page.component';


describe('ClientViewLoginPageComponent', () => {
  let component: ClientViewLoginPageComponent;
  let fixture: ComponentFixture<ClientViewLoginPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientViewLoginPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientViewLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
