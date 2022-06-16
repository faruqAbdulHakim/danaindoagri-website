import DateHelper from './date-helper';

const FinancesFormat = {
  getFinances(expenses, revenues, format) {
    let obj = {};
    switch (format.format) {
      case 'daily':
        expenses.forEach((expense) => {
          const { month, year } = DateHelper.dateSplitter(expense.date);
          if (format.month !== month || format.year !== year) return;
          if (!obj.hasOwnProperty(expense.date)) obj[expense.date] = {};
          obj[expense.date].expense =
            (obj[expense.date].expense || 0) + expense.cost;
        });
        revenues.forEach((revenue) => {
          const { month, year } = DateHelper.dateSplitter(revenue.date);
          if (format.month !== month || format.year !== year) return;
          if (!obj.hasOwnProperty(revenue.date)) obj[revenue.date] = {};
          obj[revenue.date].revenue =
            (obj[revenue.date].revenue || 0) + revenue.revenue;
        });
        break;
      case 'monthly':
        expenses.forEach((expense) => {
          const { month, year } = DateHelper.dateSplitter(expense.date);
          if (format.year !== year) return;
          if (!obj.hasOwnProperty(month)) obj[month] = {};
          obj[month].expense = (obj[month].expense || 0) + expense.cost;
        });
        revenues.forEach((revenue) => {
          const { month, year } = DateHelper.dateSplitter(revenue.date);
          if (format.year !== year) return;
          if (!obj.hasOwnProperty(month)) obj[month] = {};
          obj[month].revenue = (obj[month].revenue || 0) + revenue.revenue;
        });
        break;
      case 'yearly':
        expenses.forEach((expense) => {
          const { year } = DateHelper.dateSplitter(expense.date);
          if (!obj.hasOwnProperty(year)) obj[year] = {};
          obj[year].expense = (obj[year].expense || 0) + expense.cost;
        });
        revenues.forEach((revenue) => {
          const { year } = DateHelper.dateSplitter(revenue.date);
          if (!obj.hasOwnProperty(year)) obj[year] = {};
          obj[year].revenue = (obj[year].revenue || 0) + revenue.revenue;
        });
        break;
    }

    return Object.entries(obj)
      .map(([key, val]) => {
        return {
          date: key,
          revenue: val.revenue || 0,
          expense: val.expense || 0,
        };
      })
      .sort((a, b) => {
        return a.date < b.date ? -1 : 1;
      });
  },
};

export default FinancesFormat;
