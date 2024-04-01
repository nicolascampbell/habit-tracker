import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(weekday);
dayjs.extend(isoWeek);
export function formatDate(datetime: string | undefined) {
  // console.log(datetime, dayjs(datetime).utc(true).format("DD.MM.YY"))
  if (!datetime) return ''
  return dayjs(datetime).format("DD.MM.YY");
}
