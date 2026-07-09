import CustomError from "../interfaces/custom-error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validationErrors(error: any) {
  let validationErrors = Array<CustomError>();
  for (const item of error.issues) {
    const customError: CustomError = {
      type: item.path[0] as string,
      message: item.message,
    };
    validationErrors = [...validationErrors, customError];
  }
  return validationErrors;
}
