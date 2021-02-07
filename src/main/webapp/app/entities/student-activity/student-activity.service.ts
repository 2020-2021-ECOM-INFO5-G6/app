import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IStudentActivity } from 'app/shared/model/student-activity.model';

type EntityResponseType = HttpResponse<IStudentActivity>;
type EntityArrayResponseType = HttpResponse<IStudentActivity[]>;

@Injectable({ providedIn: 'root' })
export class StudentActivityService {
  public resourceUrl = SERVER_API_URL + 'api/student-activities';

  constructor(protected http: HttpClient) {}

  create(studentActivity: IStudentActivity): Observable<EntityResponseType> {
    return this.http.post<IStudentActivity>(this.resourceUrl, studentActivity, { observe: 'response' });
  }

  update(studentActivity: IStudentActivity): Observable<EntityResponseType> {
    return this.http.put<IStudentActivity>(this.resourceUrl, studentActivity, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStudentActivity>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStudentActivity[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getfordefinedstudent(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IStudentActivity[]>(`${this.resourceUrl}/fordefinedstudent/${id}`, { observe: 'response' });
  }

  subscribestudent(studentId: number, activityId: number, comment: string): Observable<EntityResponseType> {
    const myPostBody = { studentId, activityId, comment };
    return this.http.post(`${this.resourceUrl}/subscribestudent`, myPostBody, { observe: 'response' });
  }
}
