class Formater {

  formatDate(date) {
    if(date != undefined) {
      return date.split('T')[0];
    }
    return '';
  }

  formatHour(date) {
    if(date != undefined){
      return date.split('T')[1].slice(0, -3);
    }
    return '';
  }

  mapRoleNames(roleName){
    switch(roleName) {
      case 'doctor':
        return 'Doktor';
        break;
      case 'patient':
        return 'Pacjent';
        break;
      case 'admin':
        return 'Admin';
        break;
      default:
        return 'N/A';
        break;

    }
  }

  formatPrice(price){
    return (price / 100).toFixed(2) + " zł"; 
  }

}
export default new Formater();
