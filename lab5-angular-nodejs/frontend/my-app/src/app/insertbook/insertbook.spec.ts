import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Insertbook } from './insertbook';

describe('Insertbook', () => {
  let component: Insertbook;
  let fixture: ComponentFixture<Insertbook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Insertbook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Insertbook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
