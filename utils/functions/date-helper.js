const DateHelper = {
  getTodayDate() {
    const todayTime = new Date();
    const year = todayTime.getFullYear();
    const month = todayTime.getMonth();
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
};

export default DateHelper;
