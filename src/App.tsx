import React, { useState } from "react";
import { Box, CssBaseline, ThemeProvider, Paper } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import SettingsIcon from "@mui/icons-material/Settings";
import { getTheme } from "./theme";
import { DeviceProvider } from "./utils/DeviceContext";
import CommitHeatMap from "./views/CommitHeatmap";
import Settings from "./views/Settings";
import CommitTab from "./views/CommitTab";
import "./App.scss";
import { CommitHistory } from "./utils/types";
import { useCommitHistory } from "./utils/useCommitHistory";
import { useMode } from "./utils/useMode";
interface TabContainerProps {
  visibility: boolean;
  children: React.ReactNode;
  unmount?: boolean;
}
const TabContainer: React.FC<TabContainerProps> = ({ visibility, children, unmount = false }) => {
  return (
    <Box
      sx={{
        display: visibility ? "block" : "none",
        width: "100%",
        height: "100%",
      }}
    >
      {unmount && !visibility ? null : children}
    </Box>
  );
};
const App: React.FC = () => {
  const [tab, setTab] = useState("add");
  //@ts-ignore
  const [mode, setMode]: ["light" | "dark", Function] = useMode()

  //@ts-ignore
  const [commitHistory, updateCommitHistory, loading, error]: [CommitHistory, Function, boolean, any] = useCommitHistory()

  const handleTabChange = (_: React.ChangeEvent<{}>, newTab: string) => {
    setTab(newTab);
  };
  React.useEffect(() => {
    const adjustHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", adjustHeight);
    adjustHeight(); // Call on initial render

    return () => window.removeEventListener("resize", adjustHeight);
  }, []);
  const toggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };
  const theme = getTheme(mode);
  return (
    <ThemeProvider theme={theme}>
      <DeviceProvider>
        <CssBaseline />
        <div
          className="main-content"
          style={{ height: "calc(var(--vh, 1vh) * 100)" }}
        >
          <div className="tab-content">
            <TabContainer visibility={tab === "history"} unmount>
              <CommitHeatMap commitHistory={commitHistory} />
            </TabContainer>
            <TabContainer visibility={tab === "settings"}>
              <Settings mode={mode} onToggleMode={toggleMode} />
            </TabContainer>
            <TabContainer visibility={tab === "add"}>
              <CommitTab
                commitHistory={commitHistory}
                updateCommitHistory={updateCommitHistory}
              />
            </TabContainer>
          </div>
          <Paper
            sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
            elevation={3}
          >
            <BottomNavigation value={tab} onChange={handleTabChange} showLabels>
              <BottomNavigationAction
                label="Streak"
                value="history"
                //@ts-ignore
                icon={<LocalFireDepartmentIcon color="orange" />}
                sx={{
                  "&.Mui-selected": {
                    color: "orange",
                  },
                }}
              />
              <BottomNavigationAction
                label="Add Commit"
                value="add"
                icon={<AddCircleIcon fontSize="large" />}
              />
              <BottomNavigationAction
                label="Settings"
                value="settings"
                icon={<SettingsIcon />}
              />
            </BottomNavigation>
          </Paper>
        </div>
      </DeviceProvider>
    </ThemeProvider>
  );
};

export default App;
