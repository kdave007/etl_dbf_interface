import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawTablesComponent } from './raw-tables.component';

describe('RawTablesComponent', () => {
  let component: RawTablesComponent;
  let fixture: ComponentFixture<RawTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawTablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
