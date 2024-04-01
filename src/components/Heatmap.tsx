import React from "react";
import Tooltip from "@mui/material/Tooltip";


interface HeatMapProps {
  //@ts-ignore
  data: DayData[][];
  isLoading: boolean;
}

const HeatMap: React.FC<HeatMapProps> = ({ data, isLoading }) => {
  const cellSize = 15;
  const cellMargin = 2;
  const weekMargin = 5;
  const weeksCount = 52;
  const daysPerWeek = 7;
  const weekdays = ["", "Mon", "", "Wed", "", "Fri", ""];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  // Assuming data starts from January and ends in December

  const getFillColor = (commits: number): string => {
    if (commits > 20) return "#216e39";
    if (commits > 10) return "#30a14e";
    if (commits > 5) return "#40c463";
    if (commits > 0) return "#9be9a8";
    return "#ebedf0";
  };

  const svgHeight = daysPerWeek * (cellSize + cellMargin) + 40; // Adding extra space for month and day labels
  const svgWidth = weeksCount * (cellSize + cellMargin) + (weeksCount - 1) * weekMargin + 60; // Adding extra for left and right padding
  const monthPositions = months.map(
    (_, index) => index * (52 / 12) * (cellSize + cellMargin + weekMargin),
  );
  const emptyData = Array.from({ length: weeksCount }, () =>
    Array.from({ length: daysPerWeek }, () => ({ date: '', commits: 0 }))
  );
  const displayData = isLoading ? emptyData : data;
  return (
    <div className="heat-map-container">
      <svg width={svgWidth} height={svgHeight} >
        <g transform="translate(15, 30)">
          <g>
            {weekdays.map((day, index) => (
              <text
                key={index}
                x="-10"
                y={(index + 1) * (cellSize + cellMargin)}
                dy=".32em"
                className="calender-labels"
              >
                {day}
              </text>
            ))}
          </g>
          <g>
            {months.map((month, index) => (
              <text
                key={month}
                x={monthPositions[index] + 30}
                y="-10"
                className="calender-labels"
              >
                {month}
              </text>
            ))}
          </g>
          <g>
            {displayData.map((week, weekIndex) =>
              week.map((day, dayIndex) => (
                <Tooltip
                  key={`${weekIndex}-${dayIndex}`}
                  title={
                    !isLoading
                      ? `${day.date}: ${day.commits} commits`
                      : "Loading..."
                  }
                  placement="top"
                  arrow
                >
                  <rect
                    className="smooth-svg calender-day"
                    width={cellSize}
                    height={cellSize}
                    x={weekIndex * (cellSize + cellMargin + weekMargin) + 30}
                    y={dayIndex * (cellSize + cellMargin)}
                    fill={!isLoading ? getFillColor(day.commits) : "#e0e0e0"}
                    rx="2"
                    ry="2"
                    data-date={day.date} 
                    data-commits={day.commits}
                  />
                </Tooltip>
              )),
            )}
          </g>
        </g>
      </svg>
    </div>);
};

export default HeatMap;
