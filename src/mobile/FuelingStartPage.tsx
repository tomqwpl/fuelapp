import { Box, Button, Card, CardActions, CardContent, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { generateClient } from 'aws-amplify/api';
import { useEffect, useState } from 'react';
import type { Schema } from '../../amplify/data/resource';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router';

const client = generateClient<Schema>();

export default function FuelingStartPage() {
  const [ events, setEvents ] = useState<Array<Schema["Event"]["type"]>>([]);
  const [ loading, setLoading ] = useState<boolean>(true);
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
        setLoading(false)
        setEvents(data)
      }
    }
    fetch().catch(console.error)
  }, []);

  const handleEventClick = (eventId: string) => {
    navigate("/fueling/"+encodeURIComponent(eventId))
  }

  return (
    <Stack spacing={1}>
      <Typography variant="h4">
          Today's Events
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : events.map(event=>(
        <Card variant="outlined" key={event.id}>
          <CardContent>
            <Typography variant="h5">
              { event.locationId } 
            </Typography>
            <Typography>
              { new Date(event.startDate).toLocaleDateString(undefined, {dateStyle: "full"}) }
            </Typography>
          </CardContent>

          <CardActions>
            <Box sx={{ ml: "auto" }}/>
            <Button 
              variant='contained' 
              onClick={()=>handleEventClick(event.id)}>
                Select
            </Button>
          </CardActions>          
        </Card>
      ))}
    </Stack>
  )
}
