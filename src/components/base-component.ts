/// <reference path="../constants/constants.ts"/>

namespace App {
    // here we introduce a base class for adding something to the DOM to render the UI
    // 'templateElement' will always be of type 'HTMLTemplateElement', 'element' will always be of type 'HTMLElement'
    // BUT 'hostElement' can be different (sometimes it is a 'div' and sometimes it is an 'ul') and 'element' can be different too,
    // so we need to use generics to help us set specific types when we instantiate a class
    export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
        templateElement: HTMLTemplateElement;
        hostElement: T;
        element: U;

        protected constructor(templateElementId: string, hostElementId: string, insertPosition: InsertPosition, elementId?: string) {
            this.templateElement = document.getElementById(templateElementId)! as HTMLTemplateElement;
            this.hostElement = document.getElementById(hostElementId)! as T;
            this.element = document.importNode(this.templateElement.content, true).firstElementChild! as U;
            this.element.id = elementId ? elementId : '';
            this.attach(insertPosition);
        }

        // here we specify 'attach' method which basically takes content of template and inserts it in the 'app' container to be rendered
        private attach(insertWhere: InsertPosition) {
            this.hostElement.insertAdjacentElement(insertWhere, this.element);
        }

        abstract configure(): void;
        abstract renderContent(): void;
    }
}