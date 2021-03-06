import React, { useEffect } from "react";
import {
  makeStyles,
  colors,
  Tabs,
  Tab,
  Box,
  Button,
  Typography,
  Select,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { Redirect } from "react-router-dom";
import Axios from "axios";
import AllUsers from "./AllUsers";
import Subjects from "./Subjects";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    margin: "0%",
  },
  tab: {
    padding: "0 2%",
    margin: 0,
    position: "relative",
    width: "100%",
    backgroundColor: colors.grey[900],
  },
  buttonDg: {
    backgroundColor: "#193B55",
    color: "#ffffff",
    margin: "1% 2% 0 0",
  },
  button: {
    margin: "1% 2% 0 0",
  },
  backDrop: {
    backdropFilter: "blur(3px)",
    backgroundColor: "rgba(69,69,69,0.9)",
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
  const { enqueueSnackbar } = useSnackbar();

  const [value, setValue] = React.useState(0);
  const [year, setYear] = React.useState([]);
  const [acadYear, setAcadYear] = React.useState("");
  const [clearYear, setClearYear] = React.useState(false);
  const [resetDb, setResetDb] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSelect = (e) => {
    setAcadYear(e.target.value);
  };

  const handleClose = () => {
    setResetDb(false);
    setClearYear(false);
  };

  const handleDelete = () => {
    if (clearYear) {
      Axios.delete(
        `${process.env.REACT_APP_HOST}/api/final/clear/${acadYear}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      )
        .then((res) => {
          enqueueSnackbar(`Delete successful`, { variant: "success" });
        })
        .catch((error) => {
          enqueueSnackbar("Could not delete data", { variant: "error" });
        });
    } else if (resetDb) {
      Axios.delete(`${process.env.REACT_APP_HOST}/api/final/reset`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      })
        .then((res) => {
          enqueueSnackbar(`Database reset`, { variant: "success" });
          setRedirect(true);
        })
        .catch((error) => {
          enqueueSnackbar("Could not reset database", { variant: "error" });
        });
    }

    handleClose();
  };

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_HOST}/api/final/acadYear`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
      },
    }).then((res) => {
      setYear(res.data.data);
    });
  }, []);

  return (
    <div className={classes.root}>
      {redirect ? <Redirect to="/" /> : null}
      <div
        style={{
          float: "right",
          display: "inline-flex block",
          width: "36%",
          marginBottom: "1%",
        }}
      >
        <Select
          variant="outlined"
          style={{ width: "22%" }}
          className={classes.button}
          value={acadYear}
          onChange={handleSelect}
        >
          <option aria-label="None" value="" />
          {year.map((y) => (
            <option value={y.acadYear} style={{ padding: "3px" }}>
              {y.acadYear}
            </option>
          ))}
        </Select>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => {
            setClearYear(true);
          }}
        >
          Clear Academic Year
        </Button>
        <Button
          className={classes.buttonDg}
          variant="contained"
          color='secondary'
          onClick={() => {
            setResetDb(true);
          }}
        >
          Reset Database
        </Button>
      </div>
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
      <Dialog
        open={resetDb || clearYear}
        onClose={handleClose}
        BackdropProps={{
          classes: {
            root: classes.backDrop,
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {clearYear ? (
              <p>
                Are you sure you want to delete all data for the academic year{" "}
                <b>{acadYear}</b>?
              </p>
            ) : null}
            {resetDb ? (
              <p>
                Are you sure you want to reset the database? It will permanently
                delete all your staff and subject records.
              </p>
            ) : null}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="primary"
            style={{ paddingTop: "8px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="primary"
            style={{ backgroundColor: "#f50057", color: "#ffffff" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
