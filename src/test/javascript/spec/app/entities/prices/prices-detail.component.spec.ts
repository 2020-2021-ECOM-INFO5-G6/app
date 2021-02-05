import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EcomTestModule } from '../../../test.module';
import { PricesDetailComponent } from 'app/entities/prices/prices-detail.component';
import { Prices } from 'app/shared/model/prices.model';

describe('Component Tests', () => {
  describe('Prices Management Detail Component', () => {
    let comp: PricesDetailComponent;
    let fixture: ComponentFixture<PricesDetailComponent>;
    const route = ({ data: of({ prices: new Prices(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EcomTestModule],
        declarations: [PricesDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(PricesDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PricesDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load prices on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.prices).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
