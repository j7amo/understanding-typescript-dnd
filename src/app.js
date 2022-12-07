"use strict";
// DEMO PROJECT (active and finished projects list)
// What we implement:
// - rendering of form with data for projects (title, description, number of people) with validation
// - some storage for added projects
// - rendering of 2 lists: finished and not finished projects with DnD functionality between them
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
// to use 'namespace' feature of TS we need to use a special syntax:
// 1) we need to start with 3 forward slashes
// 2) then we need to use a self-closing <reference> tag (which is special for TS)
// 3) after that we need to specify a value of 'path' attribute, referencing the file where the namespace is declared
/// <reference path="drag-drop.ts"/>
/// <reference path="project.ts"/>
// 4) and finally we need to wrap the code which needs access to the content of earlier described namespace
// into namespace object of the SAME name
var App;
(function (App) {
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
      const newProject = new App.Project(
        Math.random().toString(),
        title,
        description,
        people,
        App.ProjectStatus.Active
      );
      this.projects.push(newProject);
      // after we add a project we must notify listeners by calling every one of them with a shallow copy of projects array
      super.notifyListeners(this.projects.slice());
    }
    changeProjectStatus(projectId, newStatus) {
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
  // here we specify a function which will do all the checks on userInput
  function validate(inputData) {
    let isValid = true;
    // if this field is NOT required then there's no point in validating it
    if (inputData.required) {
      // we need 'isValid && ...' guard to ensure that all the criteria are true
      // because if we will judge 'isValid' only by let's say '!!inputData.value' then we don't have to meet
      // all the criteria and only the last one is needed to be true for the whole function to return true which is not what we want
      isValid = isValid && inputData.value.toString().length !== 0;
      if (inputData.minLength != null && typeof inputData.value === "string") {
        isValid = isValid && inputData.value.length >= inputData.minLength;
      }
      if (inputData.maxLength != null && typeof inputData.value === "string") {
        isValid = isValid && inputData.value.length <= inputData.maxLength;
      }
      if (inputData.min != null && typeof inputData.value === "number") {
        isValid = isValid && inputData.value >= inputData.min;
      }
      if (inputData.max != null && typeof inputData.value === "number") {
        isValid = isValid && inputData.value <= inputData.max;
      }
    }
    return isValid;
  }
  // let's create an AutoBind Decorator just to make sure that we won't lose 'this' binding when we work with DOM (say hello to eventListeners)
  function AutoBind(
    _, // '_' and '_2' give TS a hint that we don't use these arguments
    _2,
    propDescriptor
  ) {
    const originalMethod = propDescriptor.value;
    return {
      configurable: true,
      enumerable: false,
      get() {
        return originalMethod.bind(this);
      },
    };
  }
  let InsertPosition;
  (function (InsertPosition) {
    InsertPosition["AfterBegin"] = "afterbegin";
    InsertPosition["BeforeEnd"] = "beforeend";
  })(InsertPosition || (InsertPosition = {}));
  // here we introduce a base class for adding something to the DOM to render the UI
  // 'templateElement' will always be of type 'HTMLTemplateElement', 'element' will always be of type 'HTMLElement'
  // BUT 'hostElement' can be different (sometimes it is a 'div' and sometimes it is an 'ul') and 'element' can be different too,
  // so we need to use generics to help us set specific types when we instantiate a class
  class Component {
    constructor(templateElementId, hostElementId, insertPosition, elementId) {
      this.templateElement = document.getElementById(templateElementId);
      this.hostElement = document.getElementById(hostElementId);
      this.element = document.importNode(
        this.templateElement.content,
        true
      ).firstElementChild;
      this.element.id = elementId ? elementId : "";
      this.attach(insertPosition);
    }
    // here we specify 'attach' method which basically takes content of template and inserts it in the 'app' container to be rendered
    attach(insertWhere) {
      this.hostElement.insertAdjacentElement(insertWhere, this.element);
    }
  }
  // let's create a class to represent a list of projects
  // NOTE: in markup this is not just UL but <section> with different child tags
  class ProjectsList extends Component {
    constructor(templateElementId, hostElementId, insertPosition, projectType) {
      super(templateElementId, hostElementId, insertPosition);
      this.projectType = projectType;
      this.storedProjects = [];
      // we can't just hardcode 'id' here because we need at least 2 lists (active and finished projects)
      this.element.id = `${this.projectType}-projects`;
      this.configure();
      this.renderContent();
    }
    configure() {
      // here we add an anonymous function as a listener to be called later when we add a project to the global state
      // and when this function is called it will receive an array of projects from the state
      projectState.addListener((projects) => {
        // we don't need all the projects for every list (active for active and finished for finished only)
        // and we can store it inside the ProjectsList class instance
        this.storedProjects = projects.filter((project) => {
          if (this.projectType === "active") {
            return project.status === App.ProjectStatus.Active;
          } else if (this.projectType === "finished") {
            return project.status === App.ProjectStatus.Finished;
          }
        });
        // and we also should not forget to re-render projects every time we add a new project
        this.renderProjects();
      });
      this.element.addEventListener("dragover", this.dragOverHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);
      this.element.addEventListener("drop", this.dropHandler);
    }
    dragOverHandler(event) {
      // for our case we only want to accept events with plain text data,
      // this is important because in bigger projects we can have multiple draggable items of different types
      // and multiple drag targets, so we don't wannabe in a situation when we drop everything everywhere, so we need
      // to be more specific
      if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
        // this one is tricky:
        // in JS default behavior when we drag something over something IS NOT TO ALLOW DROP, so we have to PREVENT default behavior
        event.preventDefault();
        // dynamically add css-class for styles
        this.element.classList.add("droppable");
      }
    }
    dragLeaveHandler(event) {
      this.element.classList.remove("droppable");
    }
    dropHandler(event) {
      const projectId = event.dataTransfer.getData("text/plain");
      const newStatus =
        this.projectType === "active"
          ? App.ProjectStatus.Active
          : App.ProjectStatus.Finished;
      projectState.changeProjectStatus(projectId, newStatus);
      this.element.classList.remove("droppable");
    }
    // this method is for filling in the information inside ProjectsList
    renderContent() {
      // here we find UL and assign an ID to it for the future interaction
      this.element.querySelector("ul").id = `${this.projectType}-projects-list`;
      // here we find H2 and fill it with the project list name heading
      this.element.querySelector(
        "h2"
      ).textContent = `${this.projectType.toUpperCase()} PROJECTS`;
    }
    renderProjects() {
      const projectsList = this.element.querySelector(
        `#${this.projectType}-projects-list`
      );
      // before adding anything to the list we will clear it
      projectsList.innerHTML = "";
      for (const project of this.storedProjects) {
        const projectListItem = new ProjectListItem(
          project,
          "single-project",
          projectsList.id,
          InsertPosition.BeforeEnd
        );
      }
    }
  }
  __decorate([AutoBind], ProjectsList.prototype, "dragOverHandler", null);
  __decorate([AutoBind], ProjectsList.prototype, "dragLeaveHandler", null);
  __decorate([AutoBind], ProjectsList.prototype, "dropHandler", null);
  class ProjectListItem extends Component {
    constructor(projectData, templateElementId, hostElementId, insertPosition) {
      super(templateElementId, hostElementId, insertPosition, projectData.id);
      this.projectData = projectData;
      this.configure();
      this.renderContent();
    }
    get persons() {
      return `${this.projectData.people} ${
        this.projectData.people === 1 ? "Person" : "Persons"
      }`;
    }
    dragStartHandler(event) {
      this.element.classList.add("grabbed");
      // to add data to draggable (to parse it later on drop) we use dataTransfer prop in conjunction with setData method.
      // the trick is to pass just an ID of a specific project we are dragging to use it later to get project data from the state
      event.dataTransfer.setData("text/plain", this.projectData.id);
      // also, we need to choose one of predefined drag effects for drag operation (in our case we want to MOVE project from one list to another)
      event.dataTransfer.effectAllowed = "move";
    }
    dragEndHandler(event) {
      this.element.classList.remove("grabbed");
      event.dataTransfer.clearData();
    }
    configure() {
      this.element.draggable = true;
      this.element.addEventListener("dragstart", this.dragStartHandler);
      this.element.addEventListener("dragend", this.dragEndHandler);
    }
    renderContent() {
      const { title, description } = this.projectData;
      const titleHeader = this.element.querySelector("h2");
      const peopleHeader = this.element.querySelector("h3");
      const descriptionParagraph = this.element.querySelector("p");
      titleHeader.textContent = `Title: ${title}`;
      peopleHeader.textContent = `Number of people: ${this.persons}`;
      descriptionParagraph.textContent = `Description: ${description}`;
    }
  }
  __decorate([AutoBind], ProjectListItem.prototype, "dragStartHandler", null);
  __decorate([AutoBind], ProjectListItem.prototype, "dragEndHandler", null);
  // let's create a class for project-input template from index.html (it's a <template> tag, so it is not rendered by browser)
  class ProjectInput extends Component {
    // here we specify Angular-like approach with the template itself and DOM-element to which we want to render template
    constructor(templateElementId, hostElementId, insertPosition, elementId) {
      super(templateElementId, hostElementId, insertPosition, elementId);
      this.titleInput = this.element.querySelector("#title");
      this.descriptionInput = this.element.querySelector("#description");
      this.peopleInput = this.element.querySelector("#people");
      this.configure();
      this.renderContent();
    }
    // here we specify a method for adding event listener
    configure() {
      this.element.addEventListener("submit", this.submitHandler);
    }
    renderContent() {}
    // here we specify a method for gathering all the info from form AND validating it
    gatherUserInfo() {
      // get
      const title = this.titleInput.value;
      const description = this.descriptionInput.value;
      const people = this.peopleInput.value;
      // let's create validatable objects for storing validation configuration for every field
      const validatableTitle = {
        value: title,
        required: true,
        minLength: 5,
        maxLength: 30,
      };
      const validatableDescription = {
        value: description,
        required: true,
        minLength: 5,
        maxLength: 150,
      };
      const validatablePeople = {
        value: people,
        required: true,
        min: 1,
        max: 10,
      };
      if (
        // naive validation approach
        // title.trim().length === 0 ||
        // description.trim().length === 0 ||
        // people.trim().length === 0
        // more advanced validation approach
        !validate(validatableTitle) ||
        !validate(validatableDescription) ||
        !validate(validatablePeople)
      ) {
        alert("Input is incorrect, please fill in the fields!");
        return;
      } else {
        return [title, description, Number(people)];
      }
    }
    // here we specify a method for clearing inputs after successful form submission
    clearInputs() {
      this.titleInput.value = "";
      this.descriptionInput.value = "";
      this.peopleInput.value = "";
    }
    // here we specify a method for handling of submit event
    // we want to work with all inputs(validate them at least)
    submitHandler(event) {
      event.preventDefault();
      const userInput = this.gatherUserInfo();
      if (userInput instanceof Array) {
        const [title, description, people] = userInput;
        // and here we now can add project to the global state
        projectState.addProject(title, description, people);
        this.clearInputs();
      }
    }
  }
  __decorate([AutoBind], ProjectInput.prototype, "submitHandler", null);
  // create our app state instance
  const projectState = ProjectState.createAppState();
  // create a User input form and attach it to DOM
  const projectInput = new ProjectInput(
    "project-input",
    "app",
    InsertPosition.AfterBegin,
    "user-input"
  );
  // create an Active projects list and attach it to DOM
  const activeProjectsList = new ProjectsList(
    "project-list",
    "app",
    InsertPosition.BeforeEnd,
    "active"
  );
  // create a Finished projects list and attach it to DOM
  const finishedProjectsList = new ProjectsList(
    "project-list",
    "app",
    InsertPosition.BeforeEnd,
    "finished"
  );
})(App || (App = {}));
//# sourceMappingURL=app.js.map
