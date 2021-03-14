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

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [value, setValue] = useState(null);

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
        console.log(res.data.data[0]);
      })
      .catch((err) => {
        enqueueSnackbar("Could not fetch user", { variant: "error" });
      });
  };

  useEffect(() => {
    getSubject();
  }, []);

  return <div></div>;
}
