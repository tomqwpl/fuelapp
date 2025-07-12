import { Button, Card, CardActions, CardContent, Stack, Typography } from '@mui/material';
import { generateClient } from 'aws-amplify/api';
import { useEffect, useState } from 'react';
import type { Schema } from '../../amplify/data/resource';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';

const client = generateClient<Schema>();

export default function FuelingStartPage() {
  const [ events, setEvents ] = useState<Array<Schema["Event"]["type"]>>([])
  const navigate = useNavigate();

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD')
    const fetch = async () => {
      const {data, errors} = await client.models.Event.list({
        filter: {
          and: [
            {
              startDate: {
                le: today
              }
            },
            {
              endDate: {
                ge: today
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

  const handleEventClick = (eventId: string) => {
    navigate("/fueling/"+encodeURIComponent(eventId))
  }
  
  return (
    <Stack>
      <Typography variant="h1">
          Today's Events
      </Typography>

      {events.map(event=>(
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h3">
              { event.locationId } 
            </Typography>
            <Typography variant="h5">
              { new Date(event.startDate).toLocaleDateString(undefined, {dateStyle: "full"}) }
            </Typography>
          </CardContent>

          <CardActions>
            <Button variant='contained' onClick={()=>handleEventClick(event.id)}>Select</Button>
          </CardActions>          
        </Card>
      ))}
    </Stack>
  )
}
