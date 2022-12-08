import { Project, ProjectStatus } from "../model/project";
// Project State Management

type Listener<T> = (items: T[]) => void;

class State<T> {
  private listeners: Listener<T>[] = [];

  // here we specify a method for adding listeners to an array (we will be using it to notify them when state updates)
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }

  // here we specify a method to notify all listeners
  notifyListeners(state: T[]) {
    for (const listenerFn of this.listeners) {
      listenerFn(state);
    }
  }
}

// here we specify a class for managing our app state
// IMPORTANT: we want to have only one state at a time, so we use singleton pattern approach
// to implement this approach we need to:
class ProjectState extends State<Project> {
  private projects: Project[] = [];

  // 1) specify a private static field which will hold our ONE and ONLY class instance
  private static instance: ProjectState;

  // 2) specify a private constructor (so it can only be called from inside the class and cannot be called via 'new' from outside)
  private constructor() {
    super();
  }

  // 3) specify a static method which will check and if needed - make a new instance, and return it to the caller
  static createAppState() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }

    return this.instance;
  }

  // this is one of the CRUD-methods - basically it is a CREATE method for adding projects to the global state
  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );
    this.projects.push(newProject);

    // after we add a project we must notify listeners by calling every one of them with a shallow copy of projects array
    super.notifyListeners(this.projects.slice());
  }

  changeProjectStatus(projectId: string, newStatus: ProjectStatus) {
    const projectToChangeStatus = this.projects.find(
      (project) => project.id === projectId
    );

    // to avoid unnecessary re-rendering we do all the work ONLY if status was really changed
    if (projectToChangeStatus && projectToChangeStatus.status !== newStatus) {
      projectToChangeStatus.status = newStatus;
      // after we change a project status we must notify listeners by calling every one of them with a shallow copy of projects array
      super.notifyListeners(this.projects.slice());
    }
  }
}

// create our app state instance
export const projectState = ProjectState.createAppState();
