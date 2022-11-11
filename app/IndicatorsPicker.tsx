"use client";

import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Avatar,
  Button,
  Stack,
  Card,
  Popover,
  ClickAwayListener,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { indicators } from "./backtest/constants";

import "./globals.css";
import "./IndicatorsPicker.Module.css";
import CustomDrawer from "./CustomDrawer";
import { Box } from "@mui/system";
import { useState } from "react";
import { stringAvatar } from "./utils";

export default function IndicatorsPicker() {
  return (
    <CustomDrawer anchor="left">
      <Profile />
      <div className="drawerInner">
        {indicators.map((indicator, i) => (
          <Accordion
            className="accordion"
            disableGutters
            square
            key={i}
            sx={{
              "&:before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{indicator.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{indicator.description}</Typography>
              <Typography>{indicator.calculation}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </CustomDrawer>
  );
}

const user = {
  username: "denniskuzminer",
  hash: "String",
  favorites: ["TSLA", "AMZN", "AAPL", "GOOGL"],
  strategies: ["mongoose.Schema.Types.ObjectId"],
  backtests: ["mongoose.Schema.Types.ObjectId"],
};

function Profile() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [formOpen, setFormOpen] = useState("");

  const handleLoginFormOpen = () => {
    setFormOpen("Login");
  };

  const handleSignUpFormOpen = () => {
    setFormOpen("Sign up");
  };

  const handleLogoutFormOpen = () => {
    setFormOpen("Logout");
  };

  const handleClickAway = () => {
    setFormOpen("");
  };

  const handleLogout = () => {
    setLoggedIn(!loggedIn);
    handleClickAway();
  };

  const handleStopProp = (e) => {
    e.stopPropagation();
  };

  return (
    <Box>
      <div className="profile-root">
        {loggedIn ? (
          <ClickAwayListener onClickAway={handleClickAway}>
            <Card className="profile" onClick={handleLogoutFormOpen}>
              <Stack className="profile-container" direction="row" spacing={2}>
                <Avatar
                  className="profile-avatar"
                  variant="rounded"
                  {...stringAvatar(user.username)}
                />
                <div className="username-container">
                  <Typography variant="h6" className="username">
                    {user.username}
                  </Typography>
                </div>
              </Stack>
            </Card>
          </ClickAwayListener>
        ) : (
          <ClickAwayListener onClickAway={handleClickAway}>
            <Stack className="login-buttons" direction="row" spacing={2}>
              <Button
                onClick={handleLoginFormOpen}
                className="login-button"
                variant="contained"
              >
                LOGIN
              </Button>
              <Button onClick={handleSignUpFormOpen} variant="contained">
                SIGN UP
              </Button>
            </Stack>
          </ClickAwayListener>
        )}
        <Popover
          className="popover"
          open={!!formOpen}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          {{
            Logout: (
              <Card onClick={handleStopProp} className="logout-popover">
                <Button variant="contained" onClick={handleLogout}>
                  Logout
                </Button>
              </Card>
            ),
            Login: (
              <Card onClick={handleStopProp} className="login-popover">
                <Typography className="login-heading" variant="h5">
                  Login
                </Typography>
                <TextField className="login-text" label="Username" />
                <br />
                <TextField
                  className="login-text"
                  label="Password"
                  type="password"
                />
                <br />
                <Button
                  startIcon={<LockOutlinedIcon />}
                  className="login-form-button"
                  variant="contained"
                  onClick={handleLogout}
                >
                  Login
                </Button>
              </Card>
            ),
            "Sign up": (
              <Card onClick={handleStopProp} className="login-popover">
                <Typography className="login-heading" variant="h5">
                  Sign up
                </Typography>
                <TextField className="login-text" label="Username" />
                <br />
                <TextField
                  className="login-text"
                  label="Password"
                  type="password"
                />
                <br />
                <Button
                  startIcon={<LockOutlinedIcon />}
                  className="login-form-button"
                  variant="contained"
                  onClick={handleLogout}
                >
                  Sign up
                </Button>
              </Card>
            ),
          }[formOpen] || <></>}
        </Popover>
      </div>

      <hr />
    </Box>
  );
}
