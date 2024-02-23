export const regexMail =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-!@#\$%\^&\*])(?=.{12,})/;

export const regexNumber = /^[0-9]*$/;

export const regexPhoneNumber = /^\d{10}$/;

export const regexGeneric = /^[a-zA-Z0-9\s,.'\-+éÉàÀè?çî,Î!âÂôÔêÊûÛ:\/ùÙ]{1,}$/;

export const regexOptionalGeneric = /^[a-zA-Z0-9\s,.'\-+éîà,èç?!:\/âôêûù]{0,}$/;

export const regexUrl = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;

export const setRandomNumber = (min: number, max: number) => {
  return Math.trunc(Math.random() * (max - min + 1) + min);
};
