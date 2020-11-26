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
import Axios from 'axios';
import { useSnackbar } from 'notistack';

export default function Admin() {

	const { enqueueSnackbar } = useSnackbar()
	const [token, setToken] = useState(null);
	const [allUsers, setAllUsers] = useState([]);

	const handleEdit = () => {}

	const handleDeleteUser = (event) => {
		console.log(event.target.id);
	}
	
	useEffect(() => {
		setToken(sessionStorage.getItem("usertoken"))
	}, []);

	useEffect(() => {
		Axios.get(
			"http://localhost:8000/api/staff/all",
			{
				headers : {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				}
			}
		)
		.then(res => setAllUsers(res.data.data))
	}, [token, enqueueSnackbar])

	

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
						{
							allUsers && allUsers.map((user, index) => (
								<ListItem
									id={index}
									key={index}
								>
									<ListItemAvatar>
										<Avatar>
											{user.firstName.charAt(0)}{user.lastName.charAt(0)}
										</Avatar>
									</ListItemAvatar>
									<ListItemText
										primary={
											<Typography
												variant="h6"
												color="textPrimary"
											>
												{user.firstName} {user.lastName}
											</Typography>
										}
										secondary={
											<React.Fragment>
												<Typography
													variant="body1"
													color="textPrimary"
												>
													{user.reg_id}
												</Typography>
												<Typography
													variant="body2"
													color="textSecondary"
												>
													{user.email}
												</Typography>
											</React.Fragment>
										}
									/>
									<ListItemSecondaryAction>
										<IconButton edge="end" aria-label="delete" onClick={handleDeleteUser}>
											<DeleteIcon />
										</IconButton>
									</ListItemSecondaryAction>
								</ListItem>
							))
						}
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
        <Grid item>
        </Grid>
      </Grid>

    </Grid>
  );
}
