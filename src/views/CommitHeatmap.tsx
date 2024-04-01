import React from "react";
import VerticalHeatmap from "../components/VerticalHeatmap";
import { Unstable_Grid2 as Grid, Button, Menu, MenuItem } from "@mui/material";
import { CalendarMonth as CalendarMonthIcon } from "@mui/icons-material";
import { useDeviceContext } from "../utils/DeviceContext";
import { CommitHistory, DayDataMap } from "../utils/types";
import dayjs from "dayjs";
function getYearsArrayFromHistory(dayDataMap: DayDataMap): string[] {
  const years = Object.keys(dayDataMap).map(dateKey => {
    return dayjs(dateKey).year()
  });

  const minYear = Math.min(...years);

  const startYear = minYear; // Extract the year from the ISO date string using dayjs
  const currentYear = dayjs().year(); // Get the current year using dayjs

  const yearsArray: string[] = [];
  for (let year = startYear; year <= currentYear; year++) {
    yearsArray.unshift(String(year)); // Add the year as a string to the array
  }

  return yearsArray;
}
interface CommitHeatMapProps {
  commitHistory: CommitHistory;
}
const CommitHeatMap: React.FC<CommitHeatMapProps> = ({ commitHistory }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedYear, setSelectedYear] = React.useState<string>("current");

  const { isPhone } = useDeviceContext();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (year: string) => {
    setSelectedYear(year);
    setAnchorEl(null);
    // Here you would call generateCommitData for the selected year
    // For the "Past 365 Days", you might need a special handling
  };

  const timeOptions: string[] = React.useMemo(() => {
    return getYearsArrayFromHistory(commitHistory.history);
  }, [commitHistory]);


  const [startDate, endDate, descending] = React.useMemo(() => {
    let startDate,
      endDate,
      descending = false;
    if (selectedYear === "current") {
      // Last 365 days
      startDate = dayjs().subtract(365, "days");
      endDate = dayjs();
      descending = true;
    } else {
      startDate = dayjs(`${selectedYear}-01-01`);
      endDate = dayjs(`${selectedYear}-12-31`);
    }
    return [startDate, endDate, descending];
  }, [selectedYear]);

  return (
    <Grid
      container
      xs={12}
      justifyContent={"center"}
      sx={{ width: "100%", height: "100%" }}
    >
      <Grid
        xs={12}
        md={7}
        m={2}
        display={"flex"}
        justifyContent={"end"}
        alignItems={"center"}
        maxHeight={60}
      >
        <Button
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          color="primary"
          variant="outlined"
          onClick={handleClick}
          endIcon={<CalendarMonthIcon />}
        >
          {selectedYear === 'current' ? 'Past 365 days' : selectedYear}
        </Button>
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          color="primary"
          open={open}
          onClose={() => handleClose(selectedYear)}

        >
          <MenuItem
            key={"till_now"}
            selected={"current" === selectedYear}
            onClick={() => handleClose("current")}
          >
            Past 365 days
          </MenuItem>
          {timeOptions.map((year) => (
            <MenuItem
              key={year}
              selected={year === selectedYear}
              onClick={() => handleClose(year)}
            >
              {year}
            </MenuItem>
          ))}
        </Menu>
      </Grid>
      <Grid
        xs={12}
        md={7}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        pb={2}
      >
        {isPhone ? (
          <VerticalHeatmap
            history={commitHistory.history}
            startDate={startDate}
            endDate={endDate}
            descending={descending}
          />
        ) : (
          // <Heatmap history={selectedHistory} />
          <div></div>
        )}
      </Grid>
    </Grid>
  );
};

export default CommitHeatMap;
