// Drag and Drop interfaces
// this interface will describe a contract for the class which will need to be implemented
// if we want something to be draggable and moved around to be dropped eventually.
// in our case we will definitely use this interface in conjunction with ProjectListItem class
export interface Draggable {
  // we basically want to handle 2 types of event:
  // start of dragging:
  dragStartHandler(event: DragEvent): void;
  // end of dragging:
  dragEndHandler(event: DragEvent): void;
}

// this interface will describe a contract for the class which will need to be implemented
// if we want something to be a target for a draggable item.
// in our case we will use this interface in conjunction with ProjectsList class
export interface DragTarget {
  // we basically want to handle 3 types of event:
  // when draggable is over drag target - we need it to tell the browser
  // that this is a valid place to drop something and permit the drop
  dragOverHandler(event: DragEvent): void;
  // when draggable is dropped to a drag target, and we want to react to it somehow
  dropHandler(event: DragEvent): void;
  // when draggable was over drag target
  dragLeaveHandler(event: DragEvent): void;
}
