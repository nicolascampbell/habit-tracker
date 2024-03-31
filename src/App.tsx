import React, { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import SettingsIcon from "@mui/icons-material/Settings";
import { getTheme } from "./theme";
import { DeviceProvider } from "./utils/DeviceContext";
import CommitHeatMap from "./views/CommitHeatmap";
import Settings from "./views/Settings";
import "./App.scss";

const App: React.FC = () => {
  const [tab, setTab] = useState("history");
  const [mode, setMode] = useState<"light" | "dark">("light");

  const handleTabChange = (event: React.ChangeEvent<{}>, newTab: string) => {
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
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
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
            {tab === "history" && <CommitHeatMap />}
            {tab === "settings" && (
              <Settings mode={mode} onToggleMode={toggleMode} />
            )}
            {/* Render other components based on the tab */}
          </div>
          <BottomNavigation value={tab} onChange={handleTabChange} showLabels>
            <BottomNavigationAction
              label="Streak"
              value="history"
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
              icon={<AddBoxIcon />}
            />
            <BottomNavigationAction
              label="Settings"
              value="settings"
              icon={<SettingsIcon />}
            />
          </BottomNavigation>
        </div>
      </DeviceProvider>
    </ThemeProvider>
  );
};

export default App;
