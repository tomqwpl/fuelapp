import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource'; 
import React, { useEffect, useState } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

const client = generateClient<Schema>();

function Row(props: { event: RowData }) {
  const { event } = props;
  const [open, setOpen] = useState(false);
  
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setOpen(!open)
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          {new Date(event.startDate).toLocaleDateString(undefined, {dateStyle: "full"})}
        </TableCell>
        <TableCell>{/*event.eventType*/}</TableCell>
        <TableCell>{event.location.name}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Attendees
              </Typography>
              <Stack>
                {event.cars.map((car)=>(
                  <Chip key={car.id} variant='outlined' label={car.car.name}/>
                ))}
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

interface RowData {
  readonly id : string
  readonly startDate : string
  // readonly eventType : "Trackday" | "Raceday" | "Testing" | null
  readonly location: {
      readonly name: string;
  };
  readonly cars: {
    readonly id: string
      readonly car: {
          readonly name: string;
      };
  }[];
}

export default function EventManager() {
  const [events, setEvents] = useState<Array<RowData>>([]);

  useEffect(() => {
    const sub = client.models.Event.observeQuery(
      {
        selectionSet: ["id", /*"eventType",*/ "startDate", "location.name", "cars.id", "cars.car.name"],
      }
    ).subscribe({
      next: (data) => setEvents([...data.items]),
    });
    return () => sub.unsubscribe();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="events table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <Row key={event.id} event={event} />          
          ))}
        </TableBody>
      </Table>      
    </TableContainer>
  )
}
