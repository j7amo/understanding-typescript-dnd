var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "./base-component.js";
import { AutoBind } from "../decorators/autobind.js";
export class ProjectListItem extends Component {
    constructor(projectData, templateElementId, hostElementId, insertPosition) {
        super(templateElementId, hostElementId, insertPosition, projectData.id);
        this.projectData = projectData;
        this.configure();
        this.renderContent();
    }
    get persons() {
        return `${this.projectData.people} ${this.projectData.people === 1 ? "Person" : "Persons"}`;
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
__decorate([
    AutoBind
], ProjectListItem.prototype, "dragStartHandler", null);
__decorate([
    AutoBind
], ProjectListItem.prototype, "dragEndHandler", null);
//# sourceMappingURL=project-list-item.js.map