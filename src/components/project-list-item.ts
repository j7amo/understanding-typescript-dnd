/// <reference path="base-component.ts"/>
/// <reference path="../model/drag-drop.ts"/>
/// <reference path="../model/project.ts"/>
/// <reference path="../constants/constants.ts"/>
/// <reference path="../decorators/autobind.ts"/>

namespace App {
    export class ProjectListItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
        private readonly projectData: Project;

        get persons() {
            return `${this.projectData.people} ${this.projectData.people === 1 ? 'Person' : 'Persons'}`;
        }

        constructor(
            projectData: Project,
            templateElementId: string,
            hostElementId: string,
            insertPosition: InsertPosition,
        ) {
            super(templateElementId, hostElementId, insertPosition, projectData.id);
            this.projectData = projectData;

            this.configure();
            this.renderContent();
        }

        @AutoBind
        dragStartHandler(event: DragEvent): void {
            this.element.classList.add('grabbed');
            // to add data to draggable (to parse it later on drop) we use dataTransfer prop in conjunction with setData method.
            // the trick is to pass just an ID of a specific project we are dragging to use it later to get project data from the state
            event.dataTransfer!.setData('text/plain', this.projectData.id);
            // also, we need to choose one of predefined drag effects for drag operation (in our case we want to MOVE project from one list to another)
            event.dataTransfer!.effectAllowed = 'move';
        }

        @AutoBind
        dragEndHandler(event: DragEvent): void {
            this.element.classList.remove('grabbed');
            event.dataTransfer!.clearData();
        }

        configure() {
            this.element.draggable = true;
            this.element.addEventListener('dragstart', this.dragStartHandler);
            this.element.addEventListener('dragend', this.dragEndHandler);
        }

        renderContent() {
            const { title, description } = this.projectData;
            const titleHeader = this.element.querySelector('h2')! as HTMLHeadingElement;
            const peopleHeader = this.element.querySelector('h3')! as HTMLHeadingElement;
            const descriptionParagraph = this.element.querySelector('p')! as HTMLParagraphElement;
            titleHeader.textContent = `Title: ${title}`;
            peopleHeader.textContent = `Number of people: ${this.persons}`;
            descriptionParagraph.textContent = `Description: ${description}`;
        }
    }
}