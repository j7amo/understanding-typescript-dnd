// here we introduce a base class for adding something to the DOM to render the UI
// 'templateElement' will always be of type 'HTMLTemplateElement', 'element' will always be of type 'HTMLElement'
// BUT 'hostElement' can be different (sometimes it is a 'div' and sometimes it is an 'ul') and 'element' can be different too,
// so we need to use generics to help us set specific types when we instantiate a class
export class Component {
    constructor(templateElementId, hostElementId, insertPosition, elementId) {
        this.templateElement = document.getElementById(templateElementId);
        this.hostElement = document.getElementById(hostElementId);
        this.element = document.importNode(this.templateElement.content, true)
            .firstElementChild;
        this.element.id = elementId ? elementId : "";
        this.attach(insertPosition);
    }
    // here we specify 'attach' method which basically takes content of template and inserts it in the 'app' container to be rendered
    attach(insertWhere) {
        this.hostElement.insertAdjacentElement(insertWhere, this.element);
    }
}
//# sourceMappingURL=base-component.js.map