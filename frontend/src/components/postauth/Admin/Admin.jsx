import React from "react";
import {
  makeStyles,
  colors,
  Tabs,
  Tab,
  Box,
  Typography,
} from "@material-ui/core";

import AllUsers from "./AllUsers";
import Subjects from "./Subjects";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    margin: "0%",
  },
  tab: {
    padding: 0,
    margin: 0,
    position: "relative",
    backgroundColor: colors.grey[900],
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Admin() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        variant="fullWidth"
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example"
        className={classes.tab}
      >
        <Tab label="Staff" {...a11yProps(0)} />
        <Tab label="Subjects" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <AllUsers />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Subjects />
      </TabPanel>
    </div>
  );
}
