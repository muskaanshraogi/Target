import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardHeader,
  Button,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Axios from "axios";
import { useSnackbar } from "notistack";

export default function Subjects({ user }) {
  const { enqueueSnackbar } = useSnackbar();
  const [mySubjects, setMySubjects] = useState([]);
  const [index, setIndex] = useState("");

  const handleIndex = (e) => {
    let subName = e.target.innerHTML.split(" ").pop();
    setIndex(subName);
  };

  const handleDeleteSubject = (data) => {
    let reg_id = JSON.parse(sessionStorage.getItem("user")).reg_id;
    let token = sessionStorage.getItem("usertoken");
    Axios.post(
      `http://localhost:8000/api/faculty/delete/${reg_id}`,
      {
        subject: data.subName,
        division: data.division,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        let newAllSubjects = [...mySubjects];
        newAllSubjects = mySubjects.filter((s) => s.subId !== data.subId);
        setMySubjects(newAllSubjects);
        enqueueSnackbar("Deleted entry", { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar("Could not delete entry", { variant: "error" });
      });
  };

  const handleFileChange = (e) => {
    let date = new Date().toISOString().split("T")[0];
    date = formatDate(date);
    let acadYear = formatAcadYear(formatDate(new Date().toLocaleDateString()));
    const fileType = e.target.value.split(".").pop();
    let fileName = e.target.value.split("\\").pop();

    if (fileType === "xlsx" || fileType === "xls") {
      enqueueSnackbar("Uploading...", {
        variant: "info",
      });
      let data = new FormData();
      data.append("file", e.target.files[0]);
      data.append("filename", fileName);
      data.append("submittedOn", date);
      data.append("acadYear", acadYear);

      Axios.post(
        `http://localhost:8000/api/report/add/${index}/${
          JSON.parse(sessionStorage.getItem("user")).reg_id
        }`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
          },
        }
      )
        .then((res) => {
          enqueueSnackbar("Uploaded file", {
            variant: "success",
            persist: false,
          });
        })
        .catch((err) => {
          enqueueSnackbar("Could not upload file", {
            variant: "error",
            persist: false,
          });
        });
    } else {
      enqueueSnackbar("Only .xlsx format is allowed", { variant: "warning" });
      return;
    }
  };

  const formatDate = (date) => {
    date = date.replace("/", "-");
    date = date.replace("/", "-");
    return date;
  };

  const formatAcadYear = (date) => {
    let year = date.split("-").pop();
    let next = parseInt(year) + 1;
    let last = next.toString().slice(2, 4);
    return `${year}-${last}`;
  };

  useEffect(() => {
    Axios.get(
      `http://localhost:8000/api/subject/teacher/${
        JSON.parse(sessionStorage.getItem("user")).reg_id
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("usertoken")}`,
        },
      }
    )
      .then((res) => {
        setMySubjects(res.data.data);
      })
      .catch((err) => {
        enqueueSnackbar("Could not fetch my subjects", { variant: "error" });
      });
  }, [enqueueSnackbar]);

  return (
    <>
      <Grid item>
        <Card>
          <CardHeader
            title="Your Subjects"
            titleTypographyProps={{ variant: "h4" }}
          />
          <TableContainer component={Paper}>
            <Table aria-label="caption table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Subject ID</TableCell>
                  <TableCell align="center">Subject Name</TableCell>
                  <TableCell align="center">Year</TableCell>
                  <TableCell align="center">Division</TableCell>
                  <TableCell align="center">Role</TableCell>
                  <TableCell align="center">Upload</TableCell>
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mySubjects.map((subject, index) => (
                  <TableRow key={subject.subId}>
                    <TableCell align="center">{subject.subId}</TableCell>
                    <TableCell align="center">{subject.subName}</TableCell>
                    <TableCell align="center">{subject.year}</TableCell>
                    <TableCell align="center">{subject.division}</TableCell>
                    <TableCell align="center">
                      {subject.role_id === 1 ? "Teacher" : "Coordinator"}
                    </TableCell>
                    <TableCell align="center">
                      <input
                        type="file"
                        id="fileUploadButton"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                      <label htmlFor={"fileUploadButton"}>
                        <Button
                          color="primary"
                          variant="outlined"
                          component="span"
                          onClick={handleIndex}
                        >
                          Upload worksheet for {subject.subName}
                        </Button>
                      </label>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteSubject(subject)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Grid>
    </>
  );
}
