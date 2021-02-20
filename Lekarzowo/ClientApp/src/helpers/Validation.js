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
      message = message.concat('Pole ').concat(`${key}${value}`).concat('\n')
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

  validateUniversalBlank(stringObject, returnName){
    var errorObject = {};

    this.addErrorToObject(errorObject, returnName, this.validateBlank(stringObject));

    return errorObject;
  }

  validateUniversalBlankTwoinputs(stringObject1,stringObject2, returnName1, returnName2){
    var errorObject = {};

    this.addErrorToObject(errorObject, returnName1, this.validateBlank(stringObject1));
    this.addErrorToObject(errorObject, returnName2, this.validateBlank(stringObject2));

    return errorObject;
  }

  validateUniversalBlankTwoinputsNumber(stringObject1,stringObject2, returnName1, returnName2){
    var errorObject = {};

    this.addErrorToObject(errorObject, returnName1, this.validateBlankNumber(stringObject1));
    this.addErrorToObject(errorObject, returnName2, this.validateBlankNumber(stringObject2));

    return errorObject;
  }

  validateUniversalNumberBlank(stringObject, returnName){
    var errorObject = {};

    this.addErrorToObject(errorObject, returnName, this.validateBlankNumber(stringObject));

    return errorObject;
  }

  validateBlankLocal(local){
    var errorObject = {};

    this.addErrorToObject(errorObject, 'Nazwa', this.validateBlank(local.name));
    this.addErrorToObject(errorObject, 'Miasto', this.validateBlankNumber(local.cityId));
    this.addErrorToObject(errorObject, 'Ulica', this.validateBlank(local.streetName));
    this.addErrorToObject(errorObject, 'Kod pocztowy', this.validateBlankNumber(local.postCode));
    this.addErrorToObject(errorObject, 'Numer ulicy', this.validateBlankNumber(local.streetNumber));

    return errorObject;
  }

  validateAddSicknessVisit(sicknessId, description){
    var errorObject = {};
    this.addErrorToObject(errorObject, 'Opis', this.validateBlank(description));
    this.addErrorToObject(errorObject, 'Choroba', this.validateBlankObject(sicknessId));


    return errorObject;
  }

  validateAddMedicineVisit(sickness, medicine, description){
    var errorObject = {};
    this.addErrorToObject(errorObject, 'Opis', this.validateBlank(description));
    this.addErrorToObject(errorObject, 'Choroba', this.validateBlankObject(sickness));
    this.addErrorToObject(errorObject, 'Lek', this.validateBlankObject(medicine));


    return errorObject;
  }

  validateAddTreatmentVisit(treatment, description){
    var errorObject = {};
    this.addErrorToObject(errorObject, 'Opis', this.validateBlank(description));
    this.addErrorToObject(errorObject, 'Zabieg', this.validateBlankObject(treatment));


    return errorObject;
  }

  validateAdminAddSeciality(specialityName, basePrice, duration){
    var errorObject = {};
    this.addErrorToObject(errorObject, 'Specjalizacja', this.validateBlank(specialityName));
    this.addErrorToObject(errorObject, 'Cena bazowa', this.validateBlankNumber(basePrice));
    this.addErrorToObject(errorObject, 'Docelowy czas wizyty', this.validateBlankNumber(duration));


    return errorObject;
  }

  validateAdminAddRoom(localId, roomNumber){
    var errorObject = {};
    this.addErrorToObject(errorObject, 'Lokal', this.validateBlankNumber(localId));
    this.addErrorToObject(errorObject, 'Numer pokoju', this.validateBlankNumber(roomNumber));


    return errorObject;
  }

  validateAdminAddLocal(cityId, localName, streetName, postalCode, streetNumber, blockNumber){
    var errorObject = {};
    this.addErrorToObject(errorObject, 'Miasto', this.validateBlankNumber(cityId));
    this.addErrorToObject(errorObject, 'Lokal', this.validateBlank(localName));
    this.addErrorToObject(errorObject, 'Ulica', this.validateBlank(streetName));
    this.addErrorToObject(errorObject, 'Kod Pocztowy', this.validateBlank(postalCode));
    this.addErrorToObject(errorObject, 'Numer ulicy', this.validateBlankNumber(streetNumber));


    return errorObject;
  }

  validateAdminAddWorkingHours(doctorId, localId, startDate, endDate, startHour, endHour){
    var errorObject = {};
    this.addErrorToObject(errorObject, 'Doktor', this.validateBlankNumber(doctorId));
    this.addErrorToObject(errorObject, 'Lokal', this.validateBlankNumber(localId));
    this.addErrorToObject(errorObject, 'Data od', this.validateBlankObject(startDate));
    this.addErrorToObject(errorObject, 'Data do', this.validateBlankObject(endDate));
    this.addErrorToObject(errorObject, 'Godzina od', this.validateBlankObject(startHour));
    this.addErrorToObject(errorObject, 'Godzina do', this.validateBlankObject(endHour));

    return errorObject;
  }
  validateAdminDeleteWorkingHours(doctorId, localId, workinghoursId){
    var errorObject = {};
    this.addErrorToObject(errorObject, 'Doktor', this.validateBlankNumber(doctorId));
    this.addErrorToObject(errorObject, 'Lokal', this.validateBlankNumber(localId));
    this.addErrorToObject(errorObject, 'Godziny pracy', this.validateBlankNumber(workinghoursId));

    return errorObject;
  }

  validateAdminAddDoctor(specialityId, name, lastName, dateOfBirth, email, password, gender, pesel){
    var errorObject = {};
    this.addErrorToObject(errorObject, 'Imie', this.validateBlank(name));
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
    this.addErrorToObject(errorObject, 'Specjalizacja', this.validateBlankNumber(specialityId));

    return errorObject;
  }

  validateOldMedicineAdd(medicine, medicineDescription, medicineFinishDate){
    var errorObject = {};
    this.addErrorToObject(errorObject, 'Lek', this.validateBlankObject(medicine));
    this.addErrorToObject(errorObject, 'Opis', this.validateBlank(medicineDescription));
    this.addErrorToObject(errorObject, 'Data Zakończenia', this.validateBlank(medicineFinishDate));

    return errorObject;
  }

  validateOldIllnessAdd(illnessName, illnessDescription, diagnoseDate, cureDate){
    var errorObject = {};
    this.addErrorToObject(errorObject, 'Choroba', this.validateBlankObject(illnessName));
    this.addErrorToObject(errorObject, 'Opis', this.validateBlank(illnessDescription));
    this.addErrorToObject(errorObject, 'Data diagnozy', this.validateBlank(diagnoseDate));
    this.addErrorToObject(errorObject, 'Data wyleczenia', this.validateBlank(cureDate));

    return errorObject;
  }

  validateAddVisit(cityId, doctorId, specId, dateStart, dateEnd){
    var errorObject = {};
    this.addErrorToObject(errorObject, 'Miasto', this.validateBlankNumber(cityId));
    //this.addErrorToObject(errorObject, 'Doktor', this.validateBlank(doctorId));
    this.addErrorToObject(errorObject, 'Specjalizacja', this.validateBlankNumber(specId));
    this.addErrorToObject(errorObject, 'Data Od', this.validateDateBeforeCustom(dateStart));
    this.addErrorToObject(errorObject, 'Data Do', this.validateDateBefore(dateEnd));



    return errorObject;
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
    var validationResult = (input == undefined) || (input.trim() == '') || input.length === 0;
    if(validationResult){
      return " jest puste";
    }
    return validationResult;
  }

  validateBlankNumber(input){
    var validationResult = (input == undefined) || (input < 0) || input.length === 0;
    if(validationResult){
      return " jest puste";
    }
    return validationResult;
  }

  validateBlankObject(input){
    var validationResult = (input == undefined);
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

  validateDateBefore(input){


    //var validationResult = ((new Date(input)).getDate() < (new Date()).getDate()) || ((new Date(input)).getMonth() < (new Date()).getMonth()) || ((new Date(input)).getYear() < (new Date()).getYear());
    var validationResult = new Date(input) < new Date();
    if(validationResult){
      return " nie może być wcześniejsza niż dzisiejsza data";
    }
    return validationResult;
  }

  validateDateBeforeCustom(input){
    var date = new Date(input);
//    date.setDate(date.getDate() + 1);
    var validationResult = date < new Date();
    //var validationResult = ((date).getDate() < (new Date()).getDate()) || ((date).getMonth() < (new Date()).getMonth()) || ((date).getYear() < (new Date()).getYear());
    if(validationResult){
      return " nie może być wcześniejsza niż dzisiejsza data";
    }
    return validationResult;
  }

  validateGender(input){
    var validationResult = (input !=  'M' &&  input != 'K' &&  input != 'X');
    if(validationResult){
      return " musi być Mężczyzna lub Kobieta lub Wolę nie podawać";
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
