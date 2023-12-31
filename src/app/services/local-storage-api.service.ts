import { Injectable } from '@angular/core';
import { Project } from '../class/project';
import { AlertService } from './alert.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlarmService } from './alarm.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageAPIService {
 // Utiliza BehaviorSubject para crear una variable observable con un valor inicial
 private isDataChangedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

 // Expón la variable observable como un Observable público
 public isDataChanged$: Observable<boolean> = this.isDataChangedSubject.asObservable();

  projects : Project[]  = [] ;
  autoSavedProjects : Project[]  = [] ;
  
  projectName : string = "My Project";


  constructor( 
    private alertService : AlertService, 
    private alarmService : AlarmService) { 
         // Verificar si existe un autoSavedProject en el almacenamiento local
    const autoSavedProjectsJSON = localStorage.getItem("autoSavedProjects");
    if (autoSavedProjectsJSON) {
      const autoSavedProjects = JSON.parse(autoSavedProjectsJSON);
      if (autoSavedProjects.length > 0) {
        const confirmSave = window.confirm(`Would you like to save the autosaved ${autoSavedProjects[0].name} from your last session?`);
        if (confirmSave) {
          this.recoverProjects();
          this.projects.push(
            new Project(
                autoSavedProjects[0].name,
                autoSavedProjects[0].date,
                autoSavedProjects[0].totalTime
            )
         );
          this.saveProjects();
          this.isDataChangedSubject.next(true) ;
          this.alertService.showCustomAlert("Project saved");
        }
        this.clearAutoSaved();
      }
    }
    }

  recoverProjects(): void {
    try {
      const projectsJSON = localStorage.getItem("projects");
      this.projects = projectsJSON ? JSON.parse(projectsJSON) : [];
    } catch (error) {
      console.error("Error while recovering projects:", error);
    }

  };

  add(timeDifference : number) : void {
    if(!this.projectName) this.projectName = "NO NAME";
    this.recoverProjects();
    this.projects.push(
      new Project(
        this.projectName,
        new Date(Date.now()),
        timeDifference
      )
    );
    this.saveProjects();
    this.isDataChangedSubject.next(true) ;
    this.alertService.showCustomAlert("Project saved");
  };


  addAutoSave(timeDifference: number): void {
    if (!this.projectName) this.projectName = "AUTO SAVED";
    
    try {
      const autoSavedProjectsJSON = localStorage.getItem("autoSavedProjects");
      this.autoSavedProjects = autoSavedProjectsJSON ? JSON.parse(autoSavedProjectsJSON) : [];
    } catch (error) {
      console.error("Error while recovering projects:", error);
    }
    
    if (this.autoSavedProjects.length > 0) {
      // Si ya existe, actualiza el timeDifference
      this.autoSavedProjects[0].totalTime = timeDifference;
    } else {
      // Si no existe, crea un nuevo proyecto "AutoSaved"
      this.autoSavedProjects.unshift(
        new Project(
          this.projectName,
          new Date(Date.now()),
          timeDifference
        )
      );
    }
  
    try {
      const autoSavedProjectsJSON = JSON.stringify(this.autoSavedProjects);
      localStorage.setItem("autoSavedProjects", autoSavedProjectsJSON);
    } catch (error) {
      console.error("Error while saving projects:", error);
    }
  }
  
  
  saveProjects() : void {
    try {
      const projectsJSON = JSON.stringify(this.projects);
      localStorage.setItem("projects", projectsJSON);
    } catch (error) {
      console.error("Error while saving projects:", error);
    }
  };


  clear() : void {
        localStorage.removeItem("projects");
        this.alertService.showCustomAlert("Projects Deleted");
      };
   
  clearAutoSaved() : void {
    localStorage.removeItem("autoSavedProjects");
  };


  orderProjectsByName = () => {
    const orderedProjectsByName :string[] = [...new Set(this.projects.map((item) => item.name))];
    return orderedProjectsByName;
  };


  orderProjectsByDate = () => {
    
    const orderedProjectsByDate = [...new Set(this.projects.map((item) => this.convertToDate(item.date))),];
    return orderedProjectsByDate;
  };



  convertToDate = (date: Date) => {
    date = new Date(date);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  
  filter = (projectName: string, projectDate : string) => {
    this.recoverProjects();

    let filteredProjects: Project[] = this.projects;
  
    if (projectName !== "") {
      filteredProjects = this.projects.filter((item) => item.name === projectName);
    }
  
    if (projectDate !== "") {
      filteredProjects = filteredProjects.filter(
        (item) => this.convertToDate(item.date) === projectDate
      );
    }

    return filteredProjects;
  
  };


  calcTotalTime = (filteredProjects : Project[]) => {
    
    const totalMilisecs: number = filteredProjects.reduce(
      (total, item) => total + item.totalTime, 0);

    return  this.alarmService.MiliSecToHourMinSec(totalMilisecs);
  };

  deleteProject = (projectDate : Date) => {
    this.recoverProjects();

    const projectIndex : number = this.projects.findIndex((item) => item.date === projectDate);
    
    if (projectIndex !== -1) {      
      this.projects.splice(projectIndex, 1); 
      this.saveProjects();
      this.alertService.showCustomAlert("Project Deleted");
      }
      else this.alertService.showCustomAlert("Project not found"); 
  };

}
