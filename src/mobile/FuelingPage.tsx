import { Fab, Skeleton, Stack, styled, Typography } from '@mui/material';
import { generateClient } from 'aws-amplify/api';
import { useEffect, useState } from 'react';
import type { Schema } from '../../amplify/data/resource';
import { useParams } from 'react-router';
import EventFuelHistory from './components/EventFuelHistory';
import AddIcon from '@mui/icons-material/Add';
import AddFuelDialog from './components/AddFuelDialog';

const client = generateClient<Schema>();

export default function FuelingPage() {
  const { eventId } = useParams();
  const [ event, setEvent ]  = useState<Schema["Event"]["type"]>()
  const [ eventCars, setEventCars ] = useState<Array<Schema["EventCar"]["type"]>>([])
  const [ addFuelDialogOpen, setAddFuelDialogOpen ] = useState(false)

  useEffect(() => {
    if (eventId) {
      const fetch = async () => {
        const {data, errors} = await client.models.Event.get({
          id: eventId
        })

        if (errors) {
          console.log(errors)
        }
        if (data) {
          setEvent(data)
        }
      }
      fetch().catch(console.error)
    }
  }, [eventId]);

  useEffect(() => {
    const fetch = async () => {
      const {data, errors} = await client.models.EventCar.list({
        filter: {
          eventId: {
            eq: eventId
          }
        }
      })

      if (errors) {
        console.log(errors)
      }
      if (data) {
        setEventCars(data)
      }
    }
    fetch().catch(console.error)
  }, []);

  if (!eventId || !event) {
    return <Skeleton variant="rectangular" width={210} height={118} />
  }

  const handleAddButtonClick = () => {
    setAddFuelDialogOpen(true)
  }
  const handleAddFuelDialogClose = () => {
    setAddFuelDialogOpen(false)
  }

  return (
    <Stack spacing={1}>
      <Typography variant="h3">
        { event.locationId } 
      </Typography>
      <Typography variant="h5">
        { new Date(event.startDate).toLocaleDateString(undefined, {dateStyle: "full"}) }
      </Typography>

      <EventFuelHistory eventId={eventId}/>

      <Fab
        color="primary" 
        aria-label="add" 
        sx={{
          position: "absolute",
          bottom: 76,
          right: 16
        }}
        onClick={handleAddButtonClick}>
        <AddIcon/>
      </Fab>
      <AddFuelDialog open={addFuelDialogOpen}
        eventId={eventId}
        onClose={handleAddFuelDialogClose}/> 
    </Stack>
  )
}
