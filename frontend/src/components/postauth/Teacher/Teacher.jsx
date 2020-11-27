import React, { useState, useEffect } from 'react';
import {
    Grid, 
    Card,
    CardHeader,
    CardContent,
    Typography,
    Button,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText
} from '@material-ui/core';
import {
    VpnKey,
} from '@material-ui/icons';
import Axios from 'axios';

export default function Teacher() {

    const [token, setToken] = useState(null);
    const [user, setUser] = useState({
      "firstName": "",
      "lastName": "",
      "email": "",
      "is_admin": false,
      "reg_id": "",
      "division": null,
      "roleName": null,
      "subName": null,
      "year": null
    });

    const handleEdit = () => {}

    useEffect(() => {
      setToken(sessionStorage.getItem("usertoken"))
    }, [])
    
    useEffect(() => {
      if(token) {
        Axios.get(
        `http://localhost:8000/api/staff/${JSON.parse(sessionStorage.getItem("user")).reg_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            }
          }
        )
        .then(res => {
          setUser(res.data.data[0])
        })
      }
    }, [token])

    return (
      <Grid container item spacing={1}>
        <Grid container item direction="column" xs={12} md={4} spacing={1}>
          <Grid item>
            <Card>
              <CardHeader
                title={`${user.firstName} ${user.lastName}`}
                subheader={user.email}
                avatar={<Avatar>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</Avatar>}
                titleTypographyProps={{ variant: "h4" }}
                subheaderTypographyProps={{ variant: "h6" }}
              />
            </Card>
          </Grid>
          <Grid item>
              <Card>
              <CardContent>
                <Typography gutterBottom variant="h6">
                  Registration ID
                </Typography>
              </CardContent>
                  <List dense>
                      <ListItem>
                          <ListItemAvatar>
                              <Avatar>
                                  <VpnKey />
                              </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                              primary={user.reg_id}
                          />
                        </ListItem>
                  </List>
              </Card>
          </Grid>
          <Grid item>
            <Button
              onClick={handleEdit}
              fullWidth
              variant="contained"
              color="primary"
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>
        <Grid container item direction="column" xs={12} md={8} spacing={1}>
          <Grid item>
            <Card>
              <CardHeader
                title="Add Subjects you are teaching"
                titleTypographyProps={{ variant: "h4" }}
              />
            </Card>
          </Grid>
          
          <Grid item>
              <Card>
              <CardContent>
                <Typography gutterBottom variant="h6">
                  Registration ID
                </Typography>
              </CardContent>
                  <List dense>
                      <ListItem>
                          <ListItemAvatar>
                              <Avatar>
                                  <VpnKey />
                              </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                              primary={user.reg_id}
                          />
                        </ListItem>
                  </List>
              </Card>
          </Grid>
        </Grid>
      </Grid>
    )
}