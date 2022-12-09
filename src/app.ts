// How to use 3rd party libraries with TS projects:
// a simple 'lodash' install and import won't work UNLESS we install *.d.ts translation files package (in our case @types/lodash),
// these files have information on types for TS to be happy.
// So basically we can install any pure JS library + @types package, and it will work fine with TS.
// BUT if somehow there's no such package available then we have 2 choices:
// 1) We don't use this library and look for some alternatives.
// 2) We write *.d.ts files ourselves (which is not that easy).
import _ from "lodash";
import "reflect-metadata";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { ProjectInput } from "./components/project-input";
import { InsertPosition } from "./constants/constants";
import { ProjectsList } from "./components/project-list";

import { Product } from "./product.model";

const product = new Product("", -6.66);

validate(product).then(errors => {
  if (errors.length > 0) {
    console.log('Validation failed!');
    console.log(errors);
  } else {
    console.log(product.getInformation());
  }
});

// let's say we fetch some products from backend, parse JSON and get data in the form of JS object,
// in this case this data is detached from any classes and although the objects in the array look quite similar
// to what we instantiate via 'new Product()' call they are not 100% the same (e.g. they don't have 'getInformation' method)
const productsFromBackend = [
  {
    title: "Product 1",
    price: 1.23,
  },
  {
    title: "Product 2",
    price: 4.56,
  },
];

// so to make real Product instances we have to pass this data to class constructor
// const constructedProducts = productsFromBackend.map(product => new Product(product.title, product.price));

// this is one way to do it but what if we have to pass 10 arguments to instantiate a class?
// to do it faster we can use 3rd party library - 'class-transformer' (which is written with TS by default so no need for additional @types install)
const constructedProducts = plainToClass(Product, productsFromBackend);

// and then we can finally use 'getInformation' method
for (const prod of constructedProducts) {
  console.log(prod.getInformation());
}

// this will work without @types package ONLY if we set "noEmitOnError" to 'false' in tsconfig (which we don't want to do)
console.log(_.shuffle([1, 2, 3]));

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
