"use client";

import { Box, LinearProgress } from "@mui/material";
import FilterDramaIcon from "@mui/icons-material/FilterDrama";

const Loader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        paddingTop: "10%",
      }}
    >
      <Box
        width="15wv"
        height="15wv"
        justifyContent="center"
        alignItems="center"
      >
        <FilterDramaIcon
          fontSize="large"
          sx={{
            width: "10vw",
            height: "10vw",
          }}
        />
        <LinearProgress />
      </Box>
    </Box>
  );
};

export default Loader;
