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
  CircularProgress,
} from "@material-ui/core";
import { BiArrowBack } from "react-icons/bi";
import Axios from "axios";
import { useHistory } from "react-router";
import React, { useState, useEffect } from "react";
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

export default function User(props) {
  const classes = useStyles();
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [value, setValue] = useState(null);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleDelete = () => {
    let values = value.split(" ");

    Axios.post(
      `${process.env.REACT_APP_HOST}/api/faculty/delete/${props.match.params.reg_id}`,
      {
        subject: values[0],
        division: values[1],
        acadYear: values[2],
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
        getUser();
      })
      .catch((err) => {
        enqueueSnackbar("Could not unassign relation", { variant: "error" });
      });
  };

  const handleSubmit = () => {
    Axios.post(
      `${process.env.REACT_APP_HOST}/api/staff/admin/${!admin}/${
        props.match.params.reg_id
      }`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        setAdmin(!admin);
        handleOpen();
        enqueueSnackbar("Admin status updated", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar("Could not change admin status", { variant: "error" });
      });
  };

  const getUser = () => {
    Axios.get(
      `${process.env.REACT_APP_HOST}/api/staff/${props.match.params.reg_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        setUser(res.data.data);
        setAdmin(res.data.data[0].is_admin);
        setLoading(false);
      })
      .catch((err) => {
        enqueueSnackbar("Could not fetch user", { variant: "error" });
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      {user && (
        <div style={{ paddingTop: "3%" }}>
          <Typography variant="h5" style={{ color: "#193B55" }}>
            <b>
              <Button
                style={{ padding: "0", width: "2%" }}
                onClick={() => history.push("/home/admin/staff")}
              >
                <BiArrowBack style={{ fontSize: "20px" }} />
              </Button>
              {user[0].firstName} {user[0].lastName}
            </b>
          </Typography>
          <Grid
            container
            spacing={1}
            style={{ paddingBottom: "2%", marginTop: "1px", paddingLeft: "0" }}
          >
            <Grid item xs={4}>
              <Paper className={classes.paper}>
                Registration ID :{" "}
                <b style={{ color: "#E50058" }}>{user[0].reg_id}</b>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.paper}>
                Email : <b style={{ color: "#E50058" }}>{user[0].email}</b>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.paper}>
                Admin :{" "}
                {admin ? (
                  <b style={{ color: "#E50058" }}>Yes</b>
                ) : (
                  <b style={{ color: "#E50058" }}>No</b>
                )}
              </Paper>
            </Grid>
            <Button
              color="primary"
              variant="outlined"
              onClick={handleOpen}
              style={{ marginTop: "2%", marginLeft: "0.5%" }}
            >
              {admin ? "Remove Admin" : "Make Admin"}
            </Button>
          </Grid>
          {loading ? (
            <>
              <CircularProgress color="secondary" className={classes.loading} />
            </>
          ) : (
            <>
              {user[0].subId ? (
                <Grid item spacing={2} style={{ marginTop: "1%" }}>
                  <Typography variant="h5" style={{ color: "#193B55" }}>
                    <b>Subjects:</b>
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table aria-label="caption table">
                      <TableHead>
                        <TableRow>
                          <TableCell align="center" className={classes.title}>
                            ID
                          </TableCell>
                          <TableCell align="center" className={classes.title}>
                            Subject
                          </TableCell>
                          <TableCell align="center" className={classes.title}>
                            Year
                          </TableCell>
                          <TableCell align="center" className={classes.title}>
                            Division
                          </TableCell>
                          <TableCell align="center" className={classes.title}>
                            Role
                          </TableCell>
                          <TableCell align="center" className={classes.title}>
                            Academic Year
                          </TableCell>
                          <TableCell align="center" className={classes.title}>
                            {" "}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {user.map((subject, index) => (
                          <TableRow key={subject.subId}>
                            <TableCell align="center" className={classes.text}>
                              {subject.subId}
                            </TableCell>
                            <TableCell align="center" className={classes.text}>
                              {subject.subName}
                            </TableCell>
                            <TableCell align="center" className={classes.text}>
                              {subject.year}
                            </TableCell>
                            <TableCell align="center" className={classes.text}>
                              {subject.division}
                            </TableCell>
                            <TableCell align="center" className={classes.text}>
                              {subject.roleName.split(" ")[1]}
                            </TableCell>
                            <TableCell align="center" className={classes.text}>
                              {subject.acadYear}
                            </TableCell>
                            <TableCell align="center" className={classes.text}>
                              <Button
                                value={`${subject.subName} ${subject.division} ${subject.acadYear}`}
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
                      <b>No subjects assigned yet</b>
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </>
          )}

          <Dialog
            open={open}
            onClose={handleOpen}
            BackdropProps={{
              classes: {
                root: classes.backDrop,
              },
            }}
          >
            <DialogTitle id="alert-dialog-title">{"Admin Status"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {user[0].is_admin
                  ? "Are you sure you want to remove this user as admin?"
                  : "Are you sure you want to make this user an admin?"}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleOpen} color="primary">
                No
              </Button>
              <Button onClick={handleSubmit} color="primary" autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
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
