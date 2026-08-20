export const regexMail =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-!@#$%^&*])(?=.{12,})/;

export const regexNumber = /^[0-9]*$/;

// Version stricte (doit contenir au moins 1 caractère)
export const regexGeneric = /^[\p{L}\p{N}\p{P}\p{S}\s]+$/u;

// Version optionnelle (peut être vide)
export const regexOptionalGeneric = /^[\p{L}\p{N}\p{P}\p{S}\s]*$/u;

export const regexUrl = /^https?:\/\/[\w-]+(\.[\w-]+)+[/#?]?.*$/;

export const regexIframe = /(?<=src=").*?(?=")/;

