import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursorAnimationComponent } from './cursor-animation.component';

describe('CursorAnimationComponent', () => {
  let component: CursorAnimationComponent;
  let fixture: ComponentFixture<CursorAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursorAnimationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursorAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
