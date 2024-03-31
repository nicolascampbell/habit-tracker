import { faker } from '@faker-js/faker';

interface DayData {
  date: string;
  commits: number;
}

const generateCommitData = (): Promise<DayData[][]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const data: DayData[][] = [];
      const startDate: Date = new Date('2023-01-01');
      const daysPerWeek: number = 7;
      const weeksCount: number = 52;

      for (let w = 0; w < weeksCount; w++) {
        const week: DayData[] = [];
        for (let d = 0; d < daysPerWeek; d++) {
          const date: Date = new Date(startDate);
          date.setDate(date.getDate() + w * daysPerWeek + d);

          const commits: number = faker.datatype.number({ min: 0, max: 30 });
          week.push({
            date: date.toISOString().split('T')[0], // Format as "YYYY-MM-DD"
            commits,
          });
        }
        data.push(week);
      }
      console.log(data)
      resolve(data);
    }, 2000); // Delay of 2 seconds
  });
};

export default generateCommitData;

