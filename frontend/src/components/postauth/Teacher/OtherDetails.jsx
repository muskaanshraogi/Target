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
} from "@material-ui/core";

import { VpnKey, AccessibilityNew } from "@material-ui/icons";

export default function OtherDetails({ user }) {
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
              <Avatar>
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
              <Avatar>
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
