import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { EcomTestModule } from '../../../test.module';
import { PricesUpdateComponent } from 'app/entities/prices/prices-update.component';
import { PricesService } from 'app/entities/prices/prices.service';
import { Prices } from 'app/shared/model/prices.model';

describe('Component Tests', () => {
  describe('Prices Management Update Component', () => {
    let comp: PricesUpdateComponent;
    let fixture: ComponentFixture<PricesUpdateComponent>;
    let service: PricesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EcomTestModule],
        declarations: [PricesUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(PricesUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PricesUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PricesService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Prices(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Prices();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
