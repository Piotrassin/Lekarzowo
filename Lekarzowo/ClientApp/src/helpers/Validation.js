class Validation {

  addErrorToObject(errorObject, errorInputName, errorValue){
    if(errorValue){
      if(errorInputName in errorObject){
        errorObject[errorInputName].push(errorValue)
      }else {
        errorObject[errorInputName] = [errorValue]
      }
    }

  }

  handleValidationOutcome(errors){
    var message  = '';
    for (const [key, value] of Object.entries(errors)) {
      message = message.concat(`${key}${value}`).concat('\n')
    }
    return message;
  }

  handleValidationFetchOutcome(errors){
    var message  = '';
    for (const [key, value] of Object.entries(errors)) {
      message = message.concat(`${value}`).concat('\n')
    }
    return message;
  }


  validateLogin(email, password){
    var errorObject = {};
    this.addErrorToObject(errorObject, 'Email', this.validateBlank(email));
    //this.addErrorToObject(errorObject, 'Email', this.validateEmail(email));
    this.addErrorToObject(errorObject, 'Hasło', this.validateBlank(password));
    //this.addErrorToObject(errorObject, 'Hasło', this.validatePassword(password));
    
    return errorObject;
  }

  validatePasswordChange(password, passwordConfirm){
    var errorObject = {};
    this.addErrorToObject(errorObject, 'Hasło', this.validateBlank(password));
    //this.addErrorToObject(errorObject, 'Hasło', this.validatePassword(password));
    this.addErrorToObject(errorObject, 'Potwierdź hasło', this.validateBlank(passwordConfirm));
    this.addErrorToObject(errorObject, 'Hasło', this.validateConfirmPassword(password, passwordConfirm));
    return errorObject;
  }

  validateUserChange(firstName, lastName, dateOfBirth, gender, pesel, email){
    var errorObject = {};

    this.addErrorToObject(errorObject, 'Imie', this.validateBlank(firstName));
    this.addErrorToObject(errorObject, 'Nazwisko', this.validateBlank(lastName));
    this.addErrorToObject(errorObject, 'Data urodzenia', this.validateBlank(dateOfBirth));
    this.addErrorToObject(errorObject, 'Data urodzenia', this.validateDateOfBirth(dateOfBirth));
    this.addErrorToObject(errorObject, 'Płeć', this.validateBlank(gender));
    this.addErrorToObject(errorObject, 'Płeć', this.validateGender(gender));
    this.addErrorToObject(errorObject, 'Pesel', this.validateBlank(pesel));
    this.addErrorToObject(errorObject, 'Pesel', this.validatePesel(pesel));
    this.addErrorToObject(errorObject, 'Email', this.validateBlank(email));
    this.addErrorToObject(errorObject, 'Email', this.validateEmail(email));


    return errorObject;
  }

  validateRegistration(firstName, lastName, dateOfBirth, gender, pesel, email, password, passwordConfirm){
    var errorObject = {};

    this.addErrorToObject(errorObject, 'Imie', this.validateBlank(firstName));
    this.addErrorToObject(errorObject, 'Nazwisko', this.validateBlank(lastName));
    this.addErrorToObject(errorObject, 'Data urodzenia', this.validateBlank(dateOfBirth));
    this.addErrorToObject(errorObject, 'Data urodzenia', this.validateDateOfBirth(dateOfBirth));
    this.addErrorToObject(errorObject, 'Płeć', this.validateBlank(gender));
    this.addErrorToObject(errorObject, 'Płeć', this.validateGender(gender));
    this.addErrorToObject(errorObject, 'Pesel', this.validateBlank(pesel));
    this.addErrorToObject(errorObject, 'Pesel', this.validatePesel(pesel));
    this.addErrorToObject(errorObject, 'Email', this.validateBlank(email));
    this.addErrorToObject(errorObject, 'Email', this.validateEmail(email));
    this.addErrorToObject(errorObject, 'Hasło', this.validateBlank(password));
    //this.addErrorToObject(errorObject, 'Hasło', this.validatePassword(password));
    this.addErrorToObject(errorObject, 'Potwierdź hasło', this.validateBlank(passwordConfirm));
    this.addErrorToObject(errorObject, 'Hasło', this.validateConfirmPassword(password, passwordConfirm));

    return errorObject;
    /*return {
      firstName: this.validateBlank(firstName),
      lastName: this.validateBlank(lastName),
      dateOfBirth: (new Date(dateOfBirth) >= new Date()),
      gender: (gender !=  'M' ||  gender != 'K'),
      pesel: (pesel.length <= 11 && (!(/^\d+$/.test(pesel)))),
      password: (password.length === 0),
      passwordConfirm:  (password === passwordConfirm)
    }*/
  }

  validateBlank(input){
    var validationResult = (input.trim() == '') || input.length === 0;
    if(validationResult){
      return " jest puste";
    }
    return validationResult;
  }

  validateDateOfBirth(input){
    var validationResult = (new Date(input) >= new Date());
    if(validationResult){
      return " nie może być późniejsza niż dzisiejsza data";
    }
    return validationResult;
  }

  validateGender(input){
    var validationResult = (input !=  'M' &&  input != 'K');
    if(validationResult){
      return " musi być M lub K";
    }
    return validationResult;
  }

  validatePesel(input){
    var validationResult = (input.length <= 11 && (!(/^\d+$/.test(input))));
    if(validationResult){
      return " jest niepoprawny";
    }
    return validationResult;
  }

  validateEmail(input){
    var validationResult = (!input.includes("@"));
    if(validationResult){
      return " jest nieporawny";
    }
    return validationResult;
  }

  validatePassword(input){
    var validationResult = (input.trim() == '') || input.length === 0;
    if(validationResult){
      return " jest puste";
    }
    return validationResult;
  }

  validateConfirmPassword(input, confirmInput){
    var validationResult = (!(input == confirmInput));
    if(validationResult){
      return " nie są takie same";
    }
    return validationResult;
  }

  validateUserData(firstName, lastName, dateOfBirth, email, gender, pesel){
    return {
      firstName: this.validateBlank(firstName),
      lastName: this.validateBlank(lastName),
      dateOfBirth: (new Date(dateOfBirth) >= new Date()),
      gender: (gender !=  'M' ||  gender != 'K'),
      pesel: (pesel.length <= 11 && (!(/^\d+$/.test(pesel))))
    }
  }





}
export default new Validation();
