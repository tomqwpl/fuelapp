import { Button, Card, Collection, Flex } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource'; 
import { useEffect, useState } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

const client = generateClient<Schema>();

export default function EventManager() {
  const [events, setEvents] = useState<Array<Schema["Event"]["type"]>>([]);
  const [locations, setLocations] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const sub = client.models.Event.observeQuery().subscribe({
      next: (data) => setEvents([...data.items]),
    });
    return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
    const sub = client.models.Location.observeQuery().subscribe({
      next: (data) => {
        const locationMap = new Map<string, string>();
        data.items.forEach(location => {
            locationMap.set(location.id, location.name)
        })
        setLocations(locationMap)
      }
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
            <TableRow
              key={event.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                {new Date(event.startDate).toLocaleDateString(undefined, {dateStyle: "full"})}
              </TableCell>
              <TableCell>{event.eventType}</TableCell>
              <TableCell>{locations.get(event.locationId) || event.locationId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>      
    </TableContainer>
  )
}
