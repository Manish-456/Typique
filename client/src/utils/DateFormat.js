import moment from 'moment';

const DateFormat = (createdAt) => {
    const createdAtDate = moment(createdAt)
  return  createdAtDate.fromNow()
}
export default DateFormat;
