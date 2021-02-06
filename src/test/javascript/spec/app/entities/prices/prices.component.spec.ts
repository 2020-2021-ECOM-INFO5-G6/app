import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { EcomTestModule } from '../../../test.module';
import { PricesComponent } from 'app/entities/prices/prices.component';
import { PricesService } from 'app/entities/prices/prices.service';
import { Prices } from 'app/shared/model/prices.model';

describe('Component Tests', () => {
  describe('Prices Management Component', () => {
    let comp: PricesComponent;
    let fixture: ComponentFixture<PricesComponent>;
    let service: PricesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EcomTestModule],
        declarations: [PricesComponent],
      })
        .overrideTemplate(PricesComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PricesComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PricesService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Prices(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.prices && comp.prices[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
