import { store } from '../../store/configureStore';
import { Toolbox } from '../toolbox';


export const Validators = {
  required,
  isNumber,
  maxLength,
  regex,
  isEmail
}

function required(): ValidatorFn {
  return (value) => {
    if (Toolbox.isUndefinedOrNull(value) || !value.toString().trim().length) {
      return "required";
    }
    return null;
  };
}

function isNumber():ValidatorFn {
  return (value) =>{
    if (value&&!Toolbox.isNumber(value)){
      return "the value must be a number";
    }
    return null;
  };
}

function maxLength(maxLength: number): ValidatorFn {
  return (value) => {
    if (value && value.toString().trim().length > maxLength) {
      // Return jsx
      return "the value exceeded " + maxLength + " symbols";
    }
    return null;
  };
};


function regex(pattern): ValidatorFn {
  return (value) => {
    if (!value.match(pattern)) {
      return "the value is invalid";
    }
    return null;
  };
};

function isEmail(): ValidatorFn {
  const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return (value) => {
    if (!emailPattern.test(value)) {
      return "email address is not valid";
    }
    return null;
  };
}

export type ValidatorFn = (value) => string;


