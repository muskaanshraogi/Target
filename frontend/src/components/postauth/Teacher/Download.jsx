import { Button, Link } from '@material-ui/core';
import React from 'react';
import { Link as RDRLink} from 'react-router-dom';

export default function Download() {
    return (
        <Button
            style={{margin: '4px'}}
            variant="contained"
            color="primary"
            
        >
            <Link style={{color:'black'}} component={RDRLink} to={{ pathname: "https://docs.google.com/spreadsheets/d/1Y67H0YvGP9zi_KZmB1keH5UMf47eQwM0Wjr7crDmaeQ/edit#gid=0" }} target="_blank">
                Download a sample worksheet from here!
            </Link>
        </Button>
    )
}