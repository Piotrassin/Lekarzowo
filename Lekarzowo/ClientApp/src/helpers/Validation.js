class Validation {

  validateLogin(email, password){
    return {
      email: (!email.includes("@")) && email.length === 0,
      password: password.length === 0
    }
  }

  validateRegistration(firstName, lastName, dateOfBirth, gender, pesel, email, password, passwordConfirm){
    return {
      firstName: this.validateBlank(firstName),
      lastName: this.validateBlank(lastName),
      dateOfBirth: (new Date(dateOfBirth) >= new Date()),
      gender: (gender !=  'M' ||  gender != 'K'),
      pesel: (pesel.length <= 11 && (!(/^\d+$/.test(pesel)))),
      password: (password.length === 0),
      passwordConfirm:  (password === passwordConfirm)
    }
  }

  validateBlank(input){
    return (input.trim() == '') && input.length === 0;
  }


}
export default new Validation();
