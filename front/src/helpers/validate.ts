/* eslint-disable @typescript-eslint/no-explicit-any */

import CustomError from "../utils/interfaces/custom-error";

export function validationErrors(error: any) {
  console.log(error);

  let validationErrors = Array<CustomError>();
  for (const item of error.issues) {
    const customError: CustomError = {
      type: item.path[0] as string,
      message: item.message,
    };
    validationErrors = [...validationErrors, customError];
  }
  console.log({ validationErrors });

  return validationErrors;
}
