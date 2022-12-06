// DEMO PROJECT (active and finished projects list)
// What we implement:
// - rendering of form with data for projects (title, description, number of people) with validation
// - some storage for added projects
// - rendering of 2 lists: finished and not finished projects with DnD functionality between them

// to use 'namespace' feature of TS we need to use a special syntax:
// 1) we need to start with 3 forward slashes
// 2) then we need to use a self-closing <reference> tag (which is special for TS)
// 3) after that we need to specify a value of 'path' attribute, referencing the file where the namespace is declared

/// <reference path="constants/constants.ts"/>
/// <reference path="components/project-input.ts"/>
/// <reference path="components/project-list.ts"/>

// 4) and finally we need to wrap the code which needs access to the content of earlier described namespace
// into namespace object of the SAME name
// p.s. this makes TS happy BUT as a result of splitting our code into several files we get these files
// compiled into JS, and we either have to link them one by one to our HTML-file OR bundle them into one file
// via 'outFile' option in the TSCONFIG file
// p.p.s. In the end this approach works fine and is correct BUT it is not convenient:
// - We have to manually look through the code and decide what imports are needed
// - We have to manually write all these imports
// - TS doesn't have much control over these imports which leads to a situation when we think that we listed
// all the needed imports and TS doesn't even throw an error during compilation BUT we then get an error at runtime which is sad...
// So overall this approach is not what we want, unfortunately.
namespace App  {
    // create a User input form and attach it to DOM
    new ProjectInput(
        'project-input',
        'app',
        InsertPosition.AfterBegin,
        'user-input'
    );
    // create an Active projects list and attach it to DOM
    new ProjectsList(
        'project-list',
        'app',
        InsertPosition.BeforeEnd,
        'active',
    );
    // create a Finished projects list and attach it to DOM
    new ProjectsList(
        'project-list',
        'app',
        InsertPosition.BeforeEnd,
        'finished',
    );
}