import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IPrices } from 'app/shared/model/prices.model';

type EntityResponseType = HttpResponse<IPrices>;
type EntityArrayResponseType = HttpResponse<IPrices[]>;

@Injectable({ providedIn: 'root' })
export class PricesService {
  public resourceUrl = SERVER_API_URL + 'api/prices';

  constructor(protected http: HttpClient) {}

  create(prices: IPrices): Observable<EntityResponseType> {
    return this.http.post<IPrices>(this.resourceUrl, prices, { observe: 'response' });
  }

  update(prices: IPrices): Observable<EntityResponseType> {
    return this.http.put<IPrices>(this.resourceUrl, prices, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPrices>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPrices[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
