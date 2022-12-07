import { Project, ProjectStatus } from "../model/project.js";
class State {
    constructor() {
        this.listeners = [];
    }
    // here we specify a method for adding listeners to an array (we will be using it to notify them when state updates)
    addListener(listenerFn) {
        this.listeners.push(listenerFn);
    }
    // here we specify a method to notify all listeners
    notifyListeners(state) {
        for (const listenerFn of this.listeners) {
            listenerFn(state);
        }
    }
}
// here we specify a class for managing our app state
// IMPORTANT: we want to have only one state at a time, so we use singleton pattern approach
// to implement this approach we need to:
class ProjectState extends State {
    // 2) specify a private constructor (so it can only be called from inside the class and cannot be called via 'new' from outside)
    constructor() {
        super();
        this.projects = [];
    }
    // 3) specify a static method which will check and if needed - make a new instance, and return it to the caller
    static createAppState() {
        if (!this.instance) {
            this.instance = new ProjectState();
        }
        return this.instance;
    }
    // this is one of the CRUD-methods - basically it is a CREATE method for adding projects to the global state
    addProject(title, description, people) {
        const newProject = new Project(Math.random().toString(), title, description, people, ProjectStatus.Active);
        this.projects.push(newProject);
        // after we add a project we must notify listeners by calling every one of them with a shallow copy of projects array
        super.notifyListeners(this.projects.slice());
    }
    changeProjectStatus(projectId, newStatus) {
        const projectToChangeStatus = this.projects.find((project) => project.id === projectId);
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
//# sourceMappingURL=project-state.js.map