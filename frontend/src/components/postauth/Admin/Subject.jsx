import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  makeStyles,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TableContainer,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Table,
} from "@material-ui/core";
import { BiArrowBack } from "react-icons/bi";
import Axios from "axios";
import { useHistory } from "react-router";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    fontSize: "18px",
  },
  backDrop: {
    backdropFilter: "blur(3px)",
    backgroundColor: "rgba(69,69,69,0.9)",
  },
  title: {
    fontSize: "17px",
    color: "#E50058",
  },
  text: {
    fontSize: "16px",
  },
}));

export default function Subject(props) {
  const classes = useStyles();
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();

  const [subject, setSubject] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  const getSubject = () => {
    Axios.get(
      `${process.env.REACT_APP_HOST}/api/subject/get/details/${props.match.params.subId}/${props.match.params.acadYear}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        let data = res.data.data[0];
        setSubject({
          subId: data.subId,
          subName: data.subName,
          acadYear: data.acadYear,
          year: data.year,
        });
      })
      .catch((err) => {
        enqueueSnackbar("Could not fetch user", { variant: "error" });
      });
  };

  useEffect(() => {
    getSubject();
  }, []);

  return (
    <div>
      {subject && (
        <div style={{ paddingTop: "3%" }}>
          <Typography variant="h5" style={{ color: "#193B55" }}>
            <b>
              <Button
                style={{ padding: "0", width: "2%" }}
                onClick={() => history.push("/home/admin/subjects")}
              >
                <BiArrowBack style={{ fontSize: "20px" }} />
              </Button>
              {subject.subName}
            </b>
          </Typography>
          <Grid
            container
            spacing={1}
            style={{ paddingBottom: "2%", marginTop: "1px", paddingLeft: "0" }}
          >
            <Grid item xs={4}>
              <Paper className={classes.paper}>
                Subject ID : <b style={{ color: "#E50058" }}>{subject.subId}</b>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.paper}>
                Academic Year :{" "}
                <b style={{ color: "#E50058" }}>{subject.acadYear}</b>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.paper}>
                Year : <b style={{ color: "#E50058" }}>{subject.year}</b>
              </Paper>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}
