"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0E1011",
    },
    primary: {
      main: "#6BEBA5",
    },
    secondary: {
      main: "#fff",
    },
  },
  typography: {
    // fontFamily: ["Alegreya Sans SC", "sans-serif"].join(","),
    fontFamily: ["Josefin Sans", "sans-serif"].join(","),

    // secondary: {
    //   // fontFamily: ["Josefin Sans", "sans-serif"].join(","),
    //   fontFamily: ["League Script", "cursive"].join(","),
    // },
  },
});
