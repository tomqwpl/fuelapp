import { Heading } from '@aws-amplify/ui-react';
import { ListItemText, MenuItem, Select, Stack, Typography, type SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/api';
import dayjs from 'dayjs';
import FuelReport from '../components/FuelReport';

const client = generateClient<Schema>();

interface EventSelectProps {
  value: string
  onChange: (value: string) => void
}

function EventSelect(props: EventSelectProps) {
  const { value, onChange } = props
  const [ events, setEvents ] = useState<Array<Schema["Event"]["type"]>>([])

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD')
    const fetch = async () => {
      const {data, errors} = await client.models.Event.list({
        filter: {
          and: [
            {
              endDate: {
                le: today
              }
            }
          ]
        }
      })

      if (errors) {
        console.log(errors)
      }
      if (data) {
        setEvents(data)
      }
    }
    fetch().catch(console.error)
  }, []);


  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as string);
  };

  return (<Select
    value={value}
    onChange={handleChange}
    displayEmpty
    >
      {events.map(event=>(
        <MenuItem value={event.id}>
          <ListItemText primary={event.locationId} secondary={new Date(event.startDate).toLocaleDateString(undefined, {dateStyle: "full"})}/>
        </MenuItem>
      ))}
    </Select>
  )
}


export default function ReportsPage() {
  const [ eventId, setEventId ] = useState<string>("")

  const handleChange = (value : string) => {
    setEventId(value)
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Event Fuel Report</Typography>
      <EventSelect value={eventId} onChange={handleChange}/>
      {!eventId ? (
        <Typography variant="h5">Select event to show fuel report</Typography>
      ) : (
        <FuelReport eventId={eventId}/>
      )}
    </Stack>
  )
}
