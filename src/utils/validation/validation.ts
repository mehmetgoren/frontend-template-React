import { Validators, ValidatorFn } from './validators';
import { store } from '../../store/configureStore';


export type ValidatorDictionary = { [field: string]: ValidatorFn[] };

export function createValidators(typefullName: string, fields?: string[]): ValidatorDictionary {
  if (!typefullName)
    throw new Error("typefullName is undefined or null");

  let metadata = store.getState().metadataReducer.metadata;
  if (!metadata)
    throw new Error("Metadata cannot be pulled");
  let props = metadata[typefullName];
  if (!props)
    throw new Error(typefullName + " can not be found");

  let dic: ValidatorDictionary = {};

  let hasFileds = fields && fields.length > 0;
  props.forEach(i => {
    let found = false;
    if (hasFileds) {
      found = fields.filter(field => field == i.ColumnName).length > 0;
    }
    if (!hasFileds || found) {
      let vList: ValidatorFn[] = [];

      if (i.IsNullable === false) {
        vList.push(Validators.required());
      }
      if (i.JsType === "number"){
        vList.push(Validators.isNumber());
      }
      if (i.MaxLength > 0) {
        vList.push(Validators.maxLength(i.MaxLength));
      }
      if (i.RegularExpression) {
        vList.push(Validators.regex(i.RegularExpression))
      }
      dic[i.ColumnName] = vList;
    }
  });

  return dic;
}

export function validateField(validators: ValidatorDictionary, field: string, value, onValidationChanged: (field: string, isValid: boolean) => void): string {
  let errorMsg: string = null;
  if (validators) {
    const validatorArray: any = validators[field]
    let validatorsFnList: ValidatorFn[] = validatorArray;
    if (validatorsFnList) {
      for (let j = 0; j < validatorsFnList.length; ++j) {
        const validator = validatorsFnList[j];
        errorMsg = validator(value);
        if (errorMsg) {
          if (onValidationChanged)
            onValidationChanged(field, false);
          break;
        } else {
          if (onValidationChanged)
            onValidationChanged(field, true);
        }
      }
    }
  }
  return errorMsg;
}