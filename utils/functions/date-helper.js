const DateHelper = {
  getTodayDate: () => {
    const todayTime = new Date();
    const year = todayTime.getFullYear();
    const month = todayTime.getMonth();
    const date = todayTime.getDate();
    return `${year}-${month < 10 ? '0'+month : month}-${date < 10 ? '0'+date : date}`
  },
}

export default DateHelper;
