class Formater {

  formatDate(date) {
    if(date != undefined) {
      return date.split('T')[0];
    }
    return '';
  }

  formatHour(date) {
    if(date != undefined){
      return (date.split('T')[1]).split('.')[0].slice(0, -3);
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

  getDayofWeek(dateToChange){
    var d = new Date(dateToChange);
    var weekday = new Array(7);
    weekday[0] = "Niedziela";
    weekday[1] = "Poniedziałek";
    weekday[2] = "Wtorek";
    weekday[3] = "Środa";
    weekday[4] = "Czwartek";
    weekday[5] = "Piątek";
    weekday[6] = "Sobota";

    return weekday[d.getDay()];
  }

  formatPrice(price){
    return (price / 100).toFixed(2) + " zł";
  }

}
export default new Formater();
