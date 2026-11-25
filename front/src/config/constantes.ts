export const regexMail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-!@#$%^&*])(?=.{12,})/;

export const regexNumber = /^\d*$/;

// Version stricte (doit contenir au moins 1 caractère)
export const regexGeneric = /^[\p{L}\p{N}\p{P}\p{S}\s]+$/u;

// Version optionnelle (peut être vide)
export const regexOptionalGeneric = /^[\p{L}\p{N}\p{P}\p{S}\s]*$/u;

export const regexUrl = /^https?:\/\/[\w-]+(\.[\w-]+)+[/#?]?.*$/;

export const regexIframe = /(?<=src=").*?(?=")/;

