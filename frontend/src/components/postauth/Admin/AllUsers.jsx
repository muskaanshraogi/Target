import React, { useState, useEffect } from 'react';
import {
	Card,
	CardHeader,
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Typography,
	ListItemSecondaryAction,
	IconButton
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import Axios from 'axios';
import { useSnackbar } from "notistack";

export default function AllUsers() {
	
	const { enqueueSnackbar } = useSnackbar();
  
	const [allUsers, setAllUsers] = useState([]);

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
	}, [])


	return (
		<Card>
			 <CardHeader
				title="All Users on the platform"
				titleTypographyProps={{ variant: "h3" }}
			/>
			<List>
				{
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
	)
}