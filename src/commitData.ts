import dayjs from 'dayjs';
import { faker } from '@faker-js/faker';

interface DayData {
  date: string;
  commits: number;
}

const generateCommitData = (startDate = dayjs()): Promise<DayData[][]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const data: DayData[][] = [];
      const daysPerWeek: number = 7;
      const weeksCount: number = 52;

      for (let w = 0; w < weeksCount; w++) {
        const week: DayData[] = [];
        for (let d = 0; d < daysPerWeek; d++) {
          // dayjs object is immutable, so you can directly add days to it
          const date = startDate.add(w * daysPerWeek + d, 'day');

          const commits: number = faker.datatype.number({ min: 0, max: 30 });
          week.push({
            date: date.format('YYYY-MM-DD'), // Format as "YYYY-MM-DD"
            commits,
          });
        }
        data.push(week);
      }
      resolve(data);
    }, 2000); // Delay of 2 seconds
  });
};}

export default generateCommitData;

