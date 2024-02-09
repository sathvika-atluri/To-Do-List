import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private baseUrl = 'http://localhost:3000'; // Remove '/Task' from the base URL

  constructor(private http: HttpClient) {}

  // Update the createTask method
  addTask(task: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Task/CreateTask`, task);
  }

  // Update the getTasks method
  getTasks(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Task/GetTasks/${email}`);
  }

  // Update the updateTask method
  updateTask(taskId: number, updatedTask: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/Task/UpdateTask/${taskId}`, updatedTask);
  }

  // Update the deleteTask method
  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Task/DeleteTask/${taskId}`);
  }

  // Update the getCompletedTasks method
  getCompletedTasks(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Task/GetCompletedTasks/${email}`);
  }

  // Update the getPendingTasks method
  getPendingTasks(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Task/GetPendingTasks/${email}`);
  }

  // Update the getOngoingTasks method
  getOngoingTasks(email: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/Task/GetOngoingTasks/${email}`);
  }
}
