import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  tasks: any[] = [];
  filteredTasks: any[] = [];

  showAddTask: boolean = false;
  showUpdateTask: boolean = false;
  newTask: any = {};
  selectedTask: any = {};

  constructor(private dataService: DataService) {}

  login(): Observable<any> {
    return this.dataService.getTasks(this.email);
  }
  performLoginAndActions() {
    this.login().subscribe(response => {
      this.tasks = response;
      // Perform any subsequent actions here
      this.showAddTaskForm(); // For example
    }, error => {
      console.error('Error fetching tasks:', error);
    });
  }
  ngOnInit(): void {
    // Initialize tasks and filteredTasks when the component initializes
    this.getTasks();
  }
  getTasks() {
    // Fetch tasks from DataService
    this.dataService.getTasks(this.email).subscribe(
      (response: any) => {
        this.tasks = response; // Assuming the response is an array of tasks
        this.filteredTasks = this.tasks; // Initialize filteredTasks with all tasks initially
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  filterTasks(category: string) {
    switch (category) {
      case 'completed':
        this.filteredTasks = this.tasks.filter(task => task.STATUS === 'COMPLETE');
        break;
      case 'ongoing':
        this.filteredTasks = this.tasks.filter(task => task.STATUS === 'PENDING' && new Date(task.DUE_DATE) >= new Date());
        break;
      case 'pending':
        this.filteredTasks = this.tasks.filter(task => task.STATUS === 'PENDING' && new Date(task.DUE_DATE) < new Date());
        break;
      default:
        this.filteredTasks = this.tasks;
    }
  }



  showAddTaskForm() {
    this.showAddTask = true;
  }

  addTask() {
    this.dataService.addTask(this.newTask).subscribe(response => {
      console.log('New task added:', response);
      // Assuming response contains updated task list, update tasks array
      this.tasks = response;
      // Reset newTask and hide the add task form
      this.newTask = {};
      this.showAddTask = false;
    }, error => {
      console.error('Error adding task:', error);
    });
  }

  updateTask(task: any) {
    // Implement logic to update task
    this.selectedTask = task;
    this.showUpdateTask = true;
  }

  updateTaskInDatabase() {
    // Implement logic to update task in the database
    this.dataService.updateTask(this.selectedTask.id, this.selectedTask).subscribe(response => {
      console.log('Task updated:', response);
      // Assuming response contains updated task list, update tasks array
      this.tasks = response;
      // Reset selectedTask and hide the update task form
      this.selectedTask = {};
      this.showUpdateTask = false;
    }, error => {
      console.error('Error updating task:', error);
    });
  }

  deleteTask(task: any) {
    this.dataService.deleteTask(task.id).subscribe(response => {
      console.log('Task deleted:', response);
      // Assuming response contains updated task list, update tasks array
      this.tasks = response;
    }, error => {
      console.error('Error deleting task:', error);
    });
  }
}
