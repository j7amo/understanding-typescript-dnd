import { Component } from "./base-component";
import { DragTarget } from "../model/drag-drop";
import { Project, ProjectStatus } from "../model/project";
import { projectState } from "../state/project-state";
import { AutoBind } from "../decorators/autobind";
import { ProjectListItem } from "./project-list-item";
import { InsertPosition } from "../constants/constants";
// let's create a class to represent a list of projects
// NOTE: in markup this is not just UL but <section> with different child tags

export class ProjectsList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  storedProjects: Project[] = [];

  constructor(
    templateElementId: string,
    hostElementId: string,
    insertPosition: InsertPosition,
    private projectType: "active" | "finished"
  ) {
    super(templateElementId, hostElementId, insertPosition);
    // we can't just hardcode 'id' here because we need at least 2 lists (active and finished projects)
    this.element.id = `${this.projectType}-projects`;

    this.configure();
    this.renderContent();
  }

  configure() {
    // here we add an anonymous function as a listener to be called later when we add a project to the global state
    // and when this function is called it will receive an array of projects from the state
    projectState.addListener((projects: Project[]) => {
      // we don't need all the projects for every list (active for active and finished for finished only)
      // and we can store it inside the ProjectsList class instance
      this.storedProjects = projects.filter((project) => {
        if (this.projectType === "active") {
          return project.status === ProjectStatus.Active;
        } else if (this.projectType === "finished") {
          return project.status === ProjectStatus.Finished;
        }
      });
      // and we also should not forget to re-render projects every time we add a new project
      this.renderProjects();
    });

    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);
  }

  @AutoBind
  dragOverHandler(event: DragEvent): void {
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

  @AutoBind
  dragLeaveHandler(event: DragEvent): void {
    this.element.classList.remove("droppable");
  }

  @AutoBind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData("text/plain");
    const newStatus =
      this.projectType === "active"
        ? ProjectStatus.Active
        : ProjectStatus.Finished;
    projectState.changeProjectStatus(projectId, newStatus);
    this.element.classList.remove("droppable");
  }

  // this method is for filling in the information inside ProjectsList
  renderContent() {
    // here we find UL and assign an ID to it for the future interaction
    this.element.querySelector("ul")!.id = `${this.projectType}-projects-list`;
    // here we find H2 and fill it with the project list name heading
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.projectType.toUpperCase()} PROJECTS`;
  }

  private renderProjects() {
    const projectsList = this.element.querySelector(
      `#${this.projectType}-projects-list`
    )! as HTMLUListElement;
    // before adding anything to the list we will clear it
    projectsList.innerHTML = "";

    for (const project of this.storedProjects) {
      new ProjectListItem(
        project,
        "single-project",
        projectsList.id,
        InsertPosition.BeforeEnd
      );
    }
  }
}
