var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from "./base-component.js";
import { validate } from "../utils/validation.js";
import { AutoBind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";
// let's create a class for project-input template from index.html (it's a <template> tag, so it is not rendered by browser)
export class ProjectInput extends Component {
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
    renderContent() { }
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
            !validate(validatablePeople)) {
            alert("Input is incorrect, please fill in the fields!");
            return;
        }
        else {
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
__decorate([
    AutoBind
], ProjectInput.prototype, "submitHandler", null);
//# sourceMappingURL=project-input.js.map