import React from "react";
import generateCommitData from "../commitData"; // Adjust the import path as necessary
import Heatmap from "../components/Heatmap";
import VerticalHeatmap from "../components/VerticalHeatmap";
import { Unstable_Grid2 as Grid, Button, Menu, MenuItem } from "@mui/material";
import {
  CalendarMonth,
  CalendarMonth as CalendarMonthIcon,
} from "@mui/icons-material";
import { useDeviceContext } from "../utils/DeviceContext";

interface DayData {
  date: string;
  commits: number;
}

const CommitHeatMap: React.FC = () => {
  const [commitData, setCommitData] = React.useState<DayData[][]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedYear, setSelectedYear] =
    React.useState<string>("Past 365 Days");
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

  React.useEffect(() => {
    // Assuming generateCommitData is adjusted to accept year or range
    generateCommitData().then((data) => {
      setCommitData(data);
      setIsLoading(false);
    });
  }, [selectedYear]);

  const years = ["Past 365 Days", "2023", "2022", "2021"]; // Example years, dynamically generate based on your data

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
        display={"flex"}
        justifyContent={"end"}
        alignItems={"center"}
      >
        <Button
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          color="secondary"
          onClick={handleClick}
          endIcon={<CalendarMonthIcon />}
        >
          {selectedYear}
        </Button>
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose(selectedYear)}
          PaperProps={{
            style: {
              maxHeight: 48 * 4.5,
              width: "20ch",
            },
          }}
        >
          {years.map((year) => (
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
      >
        {isPhone ? (
          <VerticalHeatmap data={commitData} isLoading={isLoading} />
        ) : (
          <Heatmap data={commitData} isLoading={isLoading} />
        )}
      </Grid>
    </Grid>
  );
};

export default CommitHeatMap;
