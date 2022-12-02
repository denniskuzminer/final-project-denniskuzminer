"use client";

import { Drawer } from "@mui/material";
import { rightDrawerWidth, leftDrawerWidth } from "./backtest/constants";

interface DrawerProps {
  anchor: "left" | "right";
  children: React.ReactNode;
}

export default function CustomDrawer(props: DrawerProps) {
  const { anchor, children } = props;
  const width = anchor === "left" ? leftDrawerWidth : rightDrawerWidth;

  return (
    <Drawer
      sx={{
        width: width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: width,
          boxSizing: "border-box",
        },
        position: "relative",
      }}
      variant="permanent"
      anchor={anchor}
    >
      {children}
    </Drawer>
  );
}
