import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Updatebook } from './updatebook';

describe('Updatebook', () => {
  let component: Updatebook;
  let fixture: ComponentFixture<Updatebook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Updatebook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Updatebook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
