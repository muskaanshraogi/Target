import React, { useState } from 'react';
import {
    Grid, 
    Card,
    CardHeader,
    Button,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText
} from '@material-ui/core';
import {
    VpnKey,
    Phone
} from '@material-ui/icons';

export default function Teacher() {

    const [mobile, setMobile] = useState([9922704483, 9922704483, 9922704483]);
    const handleEdit = () => {}

    return (
    <Grid container item spacing={1}>
      <Grid container item direction="column" xs={12} md={4} spacing={1}>
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
                        <ListItemAvatar>
                            <Avatar>
                                <VpnKey />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary="I2K18102554"
                        />
                    </ListItem>
                    {
                        mobile.map((m, index) => (
                            <ListItem key={index}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <Phone/>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={m}
                                />
                            </ListItem>
                        ))
                    }
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
    </Grid>
    )
}