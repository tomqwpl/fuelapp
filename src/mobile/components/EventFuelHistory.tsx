import { DataGrid, type GridColDef, type GridRowsProp } from "@mui/x-data-grid";
import { generateClient } from "aws-amplify/api";
import { useEffect, useState } from "react";
import type { Schema } from '../../../amplify/data/resource';
import { Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

const client = generateClient<Schema>();

interface EventFuelHistoryProps {
    eventId: string
}

export default function EventFuelHistory(props: EventFuelHistoryProps) {
  const { eventId } = props;
  const [ loading, setLoading ] = useState(true)
  const [ fuel, setFuel ] = useState<Array<Schema["Fuel"]["type"]>>([])

  useEffect(() => {
    const sub = client.models.Fuel.observeQuery({
        filter: {
            eventId: {
                eq: eventId,
            }
        }
    }).subscribe({
      next: (data) => { 
        setFuel([...data.items])
      }
    });
    return () => sub.unsubscribe();    
  }, [eventId]);

  if (!fuel || fuel.length==0) {
    return <Typography>No fuel has been logged yet</Typography>
  }

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
        <Table>
            <TableBody>
                {fuel.map(f=>(
                    <TableRow key={f.id}>
                        <TableCell>
                            {f.carId}
                            <br/>
                            <Typography variant="caption">{f.addedBy} {new Date(f.createdAt).toLocaleTimeString()} </Typography>
                        </TableCell>
                        <TableCell align="right">{f.quantity}l</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
  );  
}