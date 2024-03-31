import { createTheme, ThemeOptions } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      fire: {
        main: "#FBB741",
      },
      primary: {
        main: "#663399",
      },
      ...(mode === "dark" && {
        background: {
          default: "#121212",
          paper: "#1e1e1e",
        },
      }),
    },
  } as ThemeOptions);
