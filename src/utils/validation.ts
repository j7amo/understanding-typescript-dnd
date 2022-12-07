// Validation
// here we describe the structure of Validatable objects which we will pass to let's say 'validate' function in the future
export interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

// here we specify a function which will do all the checks on userInput
export function validate(inputData: Validatable): boolean {
  let isValid = true;

  // if this field is NOT required then there's no point in validating it
  if (inputData.required) {
    // we need 'isValid && ...' guard to ensure that all the criteria are true
    // because if we will judge 'isValid' only by let's say '!!inputData.value' then we don't have to meet
    // all the criteria and only the last one is needed to be true for the whole function to return true which is not what we want
    isValid = isValid && inputData.value.toString().length !== 0;

    if (inputData.minLength != null && typeof inputData.value === "string") {
      isValid = isValid && inputData.value.length >= inputData.minLength;
    }

    if (inputData.maxLength != null && typeof inputData.value === "string") {
      isValid = isValid && inputData.value.length <= inputData.maxLength;
    }

    if (inputData.min != null && typeof inputData.value === "number") {
      isValid = isValid && inputData.value >= inputData.min;
    }

    if (inputData.max != null && typeof inputData.value === "number") {
      isValid = isValid && inputData.value <= inputData.max;
    }
  }

  return isValid;
}
