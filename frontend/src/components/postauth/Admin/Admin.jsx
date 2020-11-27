import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardHeader,
  List,
  ListItem,
  Avatar,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Typography,
  ListItemSecondaryAction,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Axios from "axios";
import { useSnackbar } from "notistack";

export default function Admin() {
  const { enqueueSnackbar } = useSnackbar();
  const [allUsers, setAllUsers] = useState([]);

  const handleEdit = () => {};

  const handleDeleteUser = (reg_id) => {
    Axios.delete(`http://localhost:8000/api/staff/delete/${reg_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
      },
    }).then((res) => {
      let newAllUsers = [...allUsers];
      newAllUsers = allUsers.filter((user) => user.reg_id !== reg_id);
      setAllUsers(newAllUsers);
      enqueueSnackbar("Deleted!", { variant: "success" });
    });
  };

  useEffect(() => {
    Axios.get("http://localhost:8000/api/staff/all", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
      },
    }).then((res) => setAllUsers(res.data.data));
  }, [enqueueSnackbar]);

  return (
    <Grid container item spacing={1}>
      <Grid container item direction="column" xs={12} md={5} spacing={1}>
        <Grid item>
          <Card>
            <CardHeader
              title="All Users on the platform"
              titleTypographyProps={{ variant: "h4" }}
            />
            <List>
              {allUsers &&
                allUsers.map((user, index) => (
                  <ListItem id={index} key={index}>
                    <ListItemAvatar>
                      <Avatar>
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h6" color="textPrimary">
                          {user.firstName} {user.lastName}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body1" color="textPrimary">
                            {user.reg_id}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {user.email}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteUser(user.reg_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
            </List>
          </Card>
        </Grid>
      </Grid>
      <Grid container item direction="column" xs={12} md={7} spacing={1}>
        <Grid item>
          <Card>
            <CardHeader
              title="Tanmay Pardeshi"
              subheader="tanmaypardeshi@gmail.com"
              avatar={<Avatar>TP</Avatar>}
              titleTypographyProps={{ variant: "h4" }}
              subheaderTypographyProps={{ variant: "h6" }}
            />
          </Card>
        </Grid>
        <Grid item>
          <Card>
            <List dense>
              <ListItem>
                <ListItemText primary="I2K18102554" />
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item></Grid>
      </Grid>
    </Grid>
  );
}
