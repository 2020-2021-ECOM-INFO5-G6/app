import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ISemesterInscription } from 'app/shared/model/semester-inscription.model';

type EntityResponseType = HttpResponse<ISemesterInscription>;
type EntityArrayResponseType = HttpResponse<ISemesterInscription[]>;

@Injectable({ providedIn: 'root' })
export class SemesterInscriptionService {
  public resourceUrl = SERVER_API_URL + 'api/semester-inscriptions';

  constructor(protected http: HttpClient) {}

  create(semesterInscription: ISemesterInscription): Observable<EntityResponseType> {
    return this.http.post<ISemesterInscription>(this.resourceUrl, semesterInscription, { observe: 'response' });
  }

  update(semesterInscription: ISemesterInscription): Observable<EntityResponseType> {
    return this.http.put<ISemesterInscription>(this.resourceUrl, semesterInscription, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISemesterInscription>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISemesterInscription[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  createwithsemester(semester: number, semesterInscription: ISemesterInscription): Observable<EntityResponseType> {
    const myPostBody = { semester, semesterInscription };
    return this.http.post(`${this.resourceUrl}/withsemester`, myPostBody, { observe: 'response' });
  }
}
