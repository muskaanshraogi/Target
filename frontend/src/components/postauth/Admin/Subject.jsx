import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  makeStyles,
  Button,
  TableContainer,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Table,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
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
  loading: {
    marginTop: "2%",
    marginLeft: "50%",
  },
}));

export default function Subject(props) {
  const classes = useStyles();
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();
  const [openDelete, setOpenDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState(null);
  const [staff, setStaff] = useState(null);
  const [value, setValue] = useState(null);

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
        setStaff(res.data.data);
        setSubject({
          subId: data.subId,
          subName: data.subName,
          acadYear: data.acadYear,
          year: data.year,
        });
        setLoading(false);
      })
      .catch((err) => {
        enqueueSnackbar("Could not fetch user", { variant: "error" });
      });
  };

  const handleDelete = () => {
    let values = value.split(" ");
    Axios.post(
      `${process.env.REACT_APP_HOST}/api/faculty/delete/${values[0]}`,
      {
        subject: values[2],
        division: values[1],
        acadYear: props.match.params.acadYear,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        setOpenDelete(false);
        getSubject();
      })
      .catch((err) => {
        enqueueSnackbar("Could not unassign relation", { variant: "error" });
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
          {loading ? (
            <>
              <CircularProgress color="secondary" className={classes.loading} />
            </>
          ) : (
            <>
              {staff.length ? (
                <Grid item spacing={2} style={{ marginTop: "1%" }}>
                  <Typography variant="h5" style={{ color: "#193B55" }}>
                    <b>Staff List:</b>
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table aria-label="caption table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center" className={classes.title}>
                            Registration ID
                          </TableCell>
                          <TableCell align="center" className={classes.title}>
                            Name
                          </TableCell>
                          <TableCell align="center" className={classes.title}>
                            Division
                          </TableCell>
                          <TableCell align="center" className={classes.title}>
                            Role
                          </TableCell>
                          <TableCell align="center" className={classes.title}>
                            {" "}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {staff.map((subject, index) => (
                          <TableRow key={subject.subId}>
                            <TableCell align="center" className={classes.text}>
                              {subject.reg_id}
                            </TableCell>
                            <TableCell align="center" className={classes.text}>
                              {subject.firstName} {subject.lastName}
                            </TableCell>
                            <TableCell align="center" className={classes.text}>
                              {subject.division}
                            </TableCell>
                            <TableCell align="center" className={classes.text}>
                              {subject.role_id === 1
                                ? "Coordinator"
                                : "Teacher"}
                            </TableCell>
                            <TableCell align="center" className={classes.text}>
                              <Button
                                value={`${subject.reg_id} ${subject.division} ${subject.subName}`}
                                variant="outlined"
                                color="secondary"
                                onClick={(e) => {
                                  setOpenDelete(!openDelete);
                                  setValue(e.currentTarget.value);
                                }}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              ) : (
                <Grid item spacing={2} style={{ marginTop: "1%" }}>
                  <Paper>
                    <Typography
                      variant="h5"
                      style={{ color: "#193B55", padding: "1%" }}
                    >
                      <b>No staff members assigned yet</b>
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </>
          )}
          <Dialog
            open={openDelete}
            onClose={() => setOpenDelete(!openDelete)}
            BackdropProps={{
              classes: {
                root: classes.backDrop,
              },
            }}
          >
            <DialogTitle id="alert-dialog-title">
              {"Unaasign subject?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to unassign this role?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenDelete(!openDelete)}
                color="primary"
              >
                No
              </Button>
              <Button onClick={handleDelete} color="primary" autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
}
