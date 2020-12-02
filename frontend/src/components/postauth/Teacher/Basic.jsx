import React from "react";
import { Grid, Card, CardHeader, Avatar, makeStyles, colors } from "@material-ui/core";


const useStyles = makeStyles(theme => ({
	avatar: {
		color: theme.palette.getContrastText(colors.blue[600]),
		backgroundColor: colors.blue[600]
	},  
}))

export default function Basic({ user }) {
  const classes = useStyles();
  return (
    <Grid item>
      <Card>
        <CardHeader
          title={`${user.firstName} ${user.lastName}`}
          subheader={user.email}
          avatar={
            <Avatar className={classes.avatar}>
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
