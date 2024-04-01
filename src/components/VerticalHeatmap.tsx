import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { DayData, DayDataMap } from "../utils/types";
interface HeatMapProps {
  history: DayDataMap;
  isLoading: boolean;
  startDate: Dayjs;
  endDate: Dayjs;
  descending: boolean;
}
import isoWeek from "dayjs/plugin/isoWeek";
import dayjs, { Dayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";
import utc from "dayjs/plugin/utc";
import { Typography } from "@mui/material";
dayjs.extend(utc);
dayjs.extend(weekday);
dayjs.extend(isoWeek);

function formatDate(datetime: string) {
  // console.log(datetime, dayjs(datetime).utc(true).format("DD.MM.YY"))
  return dayjs(datetime).format("DD.MM.YY");
}
const TooltipTitle = ({ datetime, commits }) => {
  return (
    <React.Fragment>
      <Typography variant="subtitle2">{formatDate(datetime)}</Typography>
      {commits && (
        <Typography variant="caption">
          {`${commits.length} commits`}
        </Typography>
      )}{" "}
    </React.Fragment>
  );
};
const generateEmptyDataForPeriod = (
  startDate: Dayjs,
  endDate: Dayjs,
  reversed: boolean,
) => {
  const weeks: DayData[][] = [];
  let currentDate = startDate.add(1, "day").utc().startOf("isoWeek"); // Adjusted to the start of the week
  const endDay = endDate.endOf("day"); // Ensure the comparison includes the end of the last day

  while (currentDate.isBefore(endDay)) {
    const week: DayData[] = [];
    for (let i = 0; i < 7; i++) {
      if (currentDate.isAfter(startDate) && currentDate.isBefore(endDay)) {
        week.push({
          datetime: currentDate.startOf("day").toISOString(),
          commits: [],
          currentHabits: [],
        });
      } else {
        week.push({
          datetime: "",
          commits: [],
          currentHabits: [],
        });
      }
      currentDate = currentDate.add(1, "day"); // Move to the next day
    }
    // Only add the week if it contains any days (might be empty at the end of the range)
    if (week.length > 0) {
      if (reversed) {
        weeks.unshift(week);
      } else {
        weeks.push(week);
      }
    }
  }

  return weeks;
};

const useGenerateEmptyData = (
  startDate: Dayjs,
  endDate: Dayjs,
  descending: boolean,
) => {
  return React.useMemo(() => {
    return generateEmptyDataForPeriod(startDate, endDate, descending);
  }, [startDate, endDate, descending]);
};
const getThreeCharMonthNames = () => {
  // Generate an array for each month (0 through 11)
  return Array.from({ length: 12 }, (_, monthIndex) =>
    dayjs().month(monthIndex).format("MMM"),
  );
};

const monthNames = getThreeCharMonthNames();
function getMonthsArrayFromDate(
  startDate: Dayjs,
  endDate: Dayjs,
  descending: boolean,
): string[] {
  const monthsDiff = endDate.diff(startDate, "month") + 1;

  const monthsArray: string[] = [];
  for (let i = 0; i <= monthsDiff; i++) {
    // Get the month name for each month from the start date to the current date
    const currentDate = startDate.add(i, "month");
    const monthName = monthNames[currentDate.month()];
    if (descending) monthsArray.unshift(monthName);
    else if (currentDate.isSame(startDate, "year")) monthsArray.push(monthName);
  }
  return monthsArray;
}
const isDateInCurrentWeek = (datetime: string): boolean => {
  const date = dayjs(datetime);
  const now = dayjs();

  // Check if the year and week of the year match for the given date and the current date
  return date.isoWeek() === now.isoWeek() && date.year() === now.year();
};
function getFillColor(commits: number | null) {
  if (!commits) return "#ebedf0";
  if (commits > 20) return "#216e39";
  if (commits > 10) return "#30a14e";
  if (commits > 5) return "#40c463";
  if (commits > 0) return "#9be9a8";
  return "#ebedf0";
}
const VerticalHeatmap: React.FC<HeatMapProps> = ({
  history,
  startDate,
  endDate,
  descending,
}) => {
  const emptyData = useGenerateEmptyData(startDate, endDate, descending);
  const cellSize = 20;
  const cellMargin = 2;
  const weekMargin = 5;
  const weeksCount = 52;
  const daysPerWeek = 7;
  const getTwoCharDayNames = () => {
    const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
      dayjs()
        .isoWeekday(i + 1)
        .format("dd"),
    );
    return daysOfWeek;
  };
  const handleGetFillColor = React.useCallback(
    (commits: number | null): string => getFillColor(commits),
    [],
  );

  const svgHeight = daysPerWeek * (cellSize + cellMargin) + 60;
  const svgWidth =
    weeksCount * (cellSize + cellMargin) + (weeksCount - 1) * weekMargin + 80;
  const months: string[] = React.useMemo(() => {
    return getMonthsArrayFromDate(startDate, endDate, descending);
  }, [startDate, endDate, descending]);
  const monthPositions = React.useMemo(() => {
    return months.map(
      (_, index) => index * (52 / 12) * (cellSize + cellMargin + weekMargin),
    );
  }, [months]);
  const currentMonth = React.useMemo(() => monthNames[dayjs().month()], []);
  return (
    <svg width={svgHeight} height={svgWidth}>
      <g transform="translate(40, 15)">
        <g>
          {getTwoCharDayNames().map((day, index) => (
            <text
              key={index}
              y="0"
              x={index * (cellSize + cellMargin)}
              dx=".32em"
              className="calender-labels vertical"
            >
              {day}
            </text>
          ))}
        </g>
        <g>
          {months.map((month, index) => (
            <text
              key={`label-${index}-${month}`}
              y={monthPositions[index] + 30}
              x="-30"
              className={`calender-labels ${currentMonth === month ? "active" : ""}`}
            >
              {month}
            </text>
          ))}
        </g>
        <g>
          {emptyData.map((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const commits = history?.[formatDate(day.datetime)]?.commits;
              return (
                <Tooltip
                  key={`${weekIndex}-${dayIndex}`}
                  title={
                    <TooltipTitle datetime={day.datetime} commits={commits} />
                  }
                  placement="top"
                  arrow
                >
                  <rect
                    className={` smooth-svg calender-day ${isDateInCurrentWeek(day.datetime) ? "active" : ""}`}
                    style={{
                      visibility: day.datetime === "" ? "hidden" : "visible",
                    }}
                    height={cellSize}
                    width={cellSize}
                    y={weekIndex * (cellSize + cellMargin + weekMargin) + 10}
                    x={dayIndex * (cellSize + cellMargin)}
                    fill={handleGetFillColor(commits?.length)}
                    rx="2"
                    ry="2"
                    data-date={day.datetime}
                    data-commits={day.commits}
                  />
                </Tooltip>
              );
            }),
          )}
        </g>
      </g>
    </svg>
  );
};

export default VerticalHeatmap;
