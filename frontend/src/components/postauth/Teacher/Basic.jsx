import React from "react";
import { Grid, Card, CardHeader, Avatar } from "@material-ui/core";

export default function Basic({ user }) {
  return (
    <Grid item>
      <Card>
        <CardHeader
          title={`${user.firstName} ${user.lastName}`}
          subheader={user.email}
          avatar={
            <Avatar>
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </Avatar>
          }
          titleTypographyProps={{ variant: "h4" }}
          subheaderTypographyProps={{ variant: "h6" }}
        />
      </Card>
    </Grid>
  );
}
