import { Component } from "./base-component";
import { Validatable, validate } from "../utils/validation";
import { AutoBind } from "../decorators/autobind";
import { projectState } from "../state/project-state";
// let's create a class for project-input template from index.html (it's a <template> tag, so it is not rendered by browser )

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInput: HTMLInputElement;
  descriptionInput: HTMLInputElement;
  peopleInput: HTMLInputElement;

  // here we specify Angular-like approach with the template itself and DOM-element to which we want to render template
  constructor(
    templateElementId: string,
    hostElementId: string,
    insertPosition: InsertPosition,
    elementId?: string
  ) {
    super(templateElementId, hostElementId, insertPosition, elementId);
    this.titleInput = this.element.querySelector("#title")! as HTMLInputElement;
    this.descriptionInput = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInput = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
    this.renderContent();
  }

  // here we specify a method for adding event listener
  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent() {}

  // here we specify a method for gathering all the info from form AND validating it
  private gatherUserInfo(): [string, string, number] | void {
    // get
    const title = this.titleInput.value;
    const description = this.descriptionInput.value;
    const people = this.peopleInput.value;

    // let's create validatable objects for storing validation configuration for every field
    const validatableTitle: Validatable = {
      value: title,
      required: true,
      minLength: 5,
      maxLength: 30,
    };

    const validatableDescription: Validatable = {
      value: description,
      required: true,
      minLength: 5,
      maxLength: 150,
    };

    const validatablePeople: Validatable = {
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
  private clearInputs() {
    this.titleInput.value = "";
    this.descriptionInput.value = "";
    this.peopleInput.value = "";
  }

  // here we specify a method for handling of submit event
  // we want to work with all inputs(validate them at least)
  @AutoBind
  private submitHandler(event: Event) {
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
