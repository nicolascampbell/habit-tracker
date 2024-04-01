import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Typography,
  Paper,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DarkModeIcon from "@mui/icons-material/DarkMode";

interface SettingsProps {
  mode: "light" | "dark";
  onToggleMode: () => void;
}

const Settings: React.FC<SettingsProps> = ({ mode, onToggleMode }) => {
  return (
    <Paper sx={{ width: "100%", p: 2 }}>
      <Typography variant="h5" sx={{ my: 2, textAlign: "center" }}>
        Settings
      </Typography>
      <List component="nav" aria-label="settings options">
        <ListItem onClick={onToggleMode}>
          <ListItemIcon>
            <DarkModeIcon />
          </ListItemIcon>
          <ListItemText id="switch-list-label-dark-mode" primary="Dark Mode" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              onChange={onToggleMode}
              checked={mode === "dark"}
              inputProps={{
                "aria-labelledby": "switch-list-label-dark-mode",
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText
            primary="About"
            secondary="Track your habits in commit units. Version 1.0.0"
          />
        </ListItem>
      </List>
    </Paper>
  );
};

export default Settings;
