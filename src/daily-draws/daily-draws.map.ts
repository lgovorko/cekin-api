import * as moment from 'moment';

export const dailyDrawData = [
  {
    drawDate: moment().format('YYYY-MM-DD'),
  },
  {
    drawDate: moment()
      .add(1, 'day')
      .format('YYYY-MM-DD'),
  },
  {
    drawDate: moment()
      .add(2, 'day')
      .format('YYYY-MM-DD'),
  },
  {
    drawDate: moment()
      .add(3, 'day')
      .format('YYYY-MM-DD'),
  },
  {
    drawDate: moment()
      .add(4, 'day')
      .format('YYYY-MM-DD'),
  },
  {
    drawDate: moment()
      .add(5, 'day')
      .format('YYYY-MM-DD'),
  },
  {
    drawDate: moment()
      .add(6, 'day')
      .format('YYYY-MM-DD'),
  },
  {
    drawDate: moment()
      .add(7, 'day')
      .format('YYYY-MM-DD'),
  },
  {
    drawDate: moment()
      .add(8, 'day')
      .format('YYYY-MM-DD'),
  },
  {
    drawDate: moment()
      .add(9, 'day')
      .format('YYYY-MM-DD'),
  },
  {
    drawDate: moment()
      .add(10, 'day')
      .format('YYYY-MM-DD'),
  },
];
