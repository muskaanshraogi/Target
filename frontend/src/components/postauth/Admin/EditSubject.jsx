import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@material-ui/core";

export default function EditSubject({
  editSubject,
  setEditSubject,
  allSubjects,
  setAllSubjects,
}) {
	
const handleSubmit = () => {};

const handleChange = () => {};
	
  return (
		<>
		{
			editSubject >= 0 &&
			<Dialog
				aria-labelledby="form-dialog-title"
				open={() => editSubject !== -1}
				onClose={setEditSubject(-1)}
			>
				<DialogTitle id="form-dialog-title">Edit Subject</DialogTitle>
				<form onSubmit={handleSubmit}>
					<DialogContent>
						<TextField
							variant="outlined"
							// onChange= {handleChange}
							margin="normal"
							id="first_name"
							label="First Name"
							type="text"
							autoComplete="First Name"
							value=""
							onChange={handleChange}
							required
							fullWidth
						/>
						<TextField
							// onChange= {handleChange}
							variant="outlined"
							margin="normal"
							id="last_name"
							label="Last Name"
							type="text"
							autoComplete="Last Name"
							value=""
							onChange={handleChange}
							required
							fullWidth
						/>
					</DialogContent>
					<DialogActions>
						<Button autoFocus color="primary" onClick={setEditSubject(-1)}>
							CANCEL
						</Button>
						<Button color="primary" type="submit">
							EDIT
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		}
		</>
  );
}
