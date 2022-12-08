import { ProjectInput } from "./components/project-input";
import { InsertPosition } from "./constants/constants";
import { ProjectsList } from "./components/project-list";
// DEMO PROJECT (active and finished projects list)
// What we implement:
// - rendering of form with data for projects (title, description, number of people) with validation
// - some storage for added projects
// - rendering of 2 lists: finished and not finished projects with DnD functionality between them

// create a User input form and attach it to DOM
new ProjectInput(
  "project-input",
  "app",
  InsertPosition.AfterBegin,
  "user-input"
);
// create an Active projects list and attach it to DOM
new ProjectsList("project-list", "app", InsertPosition.BeforeEnd, "active");
// create a Finished projects list and attach it to DOM
new ProjectsList("project-list", "app", InsertPosition.BeforeEnd, "finished");
