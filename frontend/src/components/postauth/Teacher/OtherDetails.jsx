import React from "react";
import {
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  Typography,
  ListItemText,
  Avatar,
  makeStyles,
  colors,
} from "@material-ui/core";

import { VpnKey, AccessibilityNew } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
	avatar: {
		color: theme.palette.getContrastText(colors.blue[600]),
		backgroundColor: colors.blue[600]
	},  
}))


export default function OtherDetails({ user }) {
  const classes = useStyles();
  return (
    <Grid item>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h6">
            Other Details
          </Typography>
        </CardContent>
        <List dense>
          <ListItem>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <VpnKey />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="h6" color="textPrimary">
                  Registration ID
                </Typography>
              }
              secondary={
                <Typography variant="body1" color="textPrimary">
                  {user.reg_id}
                </Typography>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                <AccessibilityNew />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="h6" color="textPrimary">
                  Admin User
                </Typography>
              }
              secondary={
                <Typography variant="body1" color="textPrimary">
                  {user.is_admin === 1 ? "Yes" : "No"}
                </Typography>
              }
            />
          </ListItem>
        </List>
      </Card>
    </Grid>
  );
}
