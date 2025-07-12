import { generateClient } from "aws-amplify/api";
import { Fragment, useEffect, useState } from "react";
import { Box, Collapse, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from "@mui/material";
import type { Schema } from "../../amplify/data/resource";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const client = generateClient<Schema>();

interface FuelReportProps {
    eventId: string
}

interface FuelSummary {
    car: string
    total: number
    fuelings: Array<Schema["Fuel"]["type"]>
}

function Row(props: { data: FuelSummary }) {
    const { data } = props
    const [open, setOpen] = useState(false);

    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell sx={{width: 10}}> 
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>                
                <TableCell>
                    {data.car}
                </TableCell>
                <TableCell align="right">{data.total}l</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Fuelings
                            </Typography>
                            <Table size="small" aria-label="fuelings">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>When</TableCell>
                                        <TableCell>By Who</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.fuelings.map((fueling) => (
                                        <TableRow key={fueling.id}>
                                            <TableCell>{new Date(fueling.when).toLocaleTimeString()}</TableCell>
                                            <TableCell>{fueling.addedBy}</TableCell>
                                            <TableCell align="right">{fueling.quantity}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    )
}

export default function FuelReport(props: FuelReportProps) {
  const { eventId } = props;
  const [ loading, setLoading ] = useState(true)
  const [ fuel, setFuel ] = useState<Array<FuelSummary>>([])
  const [ total, setTotal ] = useState<number>(0);

  useEffect(() => {
    const sub = client.models.Fuel.observeQuery({
        filter: {
            eventId: {
                eq: eventId,
            }
        }
    }).subscribe({
      next: (data) => {
        const summaries : { [car: string] : FuelSummary; } = {};
        let total: number = 0;

        data.items.forEach(i=>{
            let s = summaries[i.carId];
            if (!s) {
                s = { car: i.carId, total: 0, fuelings: []}
                summaries[i.carId] = s
            }
            s.fuelings.push(i)
            s.total += i.quantity
            total += i.quantity
        })

        const summaryArray = Object.values(summaries).sort((a, b) => a.car.localeCompare(b.car))
        setFuel(summaryArray)
        setTotal(total)
      }
    });
    return () => sub.unsubscribe();    
  }, [eventId]);

  if (!fuel || fuel.length==0) {
    return <Typography>No fuel has been logged for this event</Typography>
  }

  return (
    <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell sx={{width: 10}} />
                <TableCell>Car</TableCell>
                <TableCell align="right">Total Fuel</TableCell>
            </TableRow>
            </TableHead>

            <TableBody>
                {fuel.map(f=><Row key={f.car} data={f}/>)}
                <TableRow>
                    <TableCell/>
                    <TableCell>Total for Event</TableCell>
                    <TableCell align="right">{total}l</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer>
  );  
}