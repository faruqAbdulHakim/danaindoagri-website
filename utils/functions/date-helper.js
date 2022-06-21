const DateHelper = {
  getTodayDate() {
    const todayTime = new Date();
    const year = todayTime.getFullYear();
    const month = todayTime.getMonth() + 1;
    const date = todayTime.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${
      date < 10 ? '0' + date : date
    }`;
  },

  dateSplitter(dateString) {
    // format: YYYY-MM-DD

    const splited = dateString.split('-');
    return {
      year: parseInt(splited[0]),
      month: parseInt(splited[1]),
      date: parseInt(splited[2]),
    };
  },

  monthString(monthNum) {
    switch (parseInt(monthNum)) {
      case 1:
        return 'Januari';
      case 2:
        return 'Februari';
      case 3:
        return 'Maret';
      case 4:
        return 'April';
      case 5:
        return 'Mei';
      case 6:
        return 'Juni';
      case 7:
        return 'Juli';
      case 8:
        return 'Agustus';
      case 9:
        return 'September';
      case 10:
        return 'Oktober';
      case 11:
        return 'November';
      case 12:
        return 'Desember';
      default:
        return '#Error#';
    }
  },
};

export default DateHelper;
