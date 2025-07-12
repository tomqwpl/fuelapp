import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource'; 
import { useEffect, useState } from 'react';
import { Autocomplete, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { AutocompleteElement, FormContainer, SelectElement, TextFieldElement } from 'react-hook-form-mui';
import {DatePickerElement} from 'react-hook-form-mui/date-pickers'
import type { PickerValidDate } from '@mui/x-date-pickers';

const client = generateClient<Schema>();

export interface NewDialogProps {
  open: boolean;
  eventId?: string
  onClose: () => void;
}

interface IdAndName {
  id: string
  name: string
}

export default function EditAttendeesDialog(props: NewDialogProps) {
  const [cars, setCars] = useState<Array<IdAndName>>([]);
  const [originalAttendees, setOriginalAttendees] = useState<Array<IdAndName>>([]);
  const [attendees, setAttendees] = useState<Array<IdAndName>>([]);
  const { onClose, open, eventId } = props;

  useEffect(() => {
    const fetch = async () => {
      const {data, errors} = await client.models.Car.list()
      if (errors) {
        console.log(errors)
      }
      setCars(data.map(l=>({id: "", name: l.name})).sort((a, b)=>a.name.localeCompare(b.name)))
    }

    fetch().catch(console.error)
  }, []);
  
  useEffect(() => {
    if (open) {
      const fetch = async () => {
        const {data, errors} = await client.models.EventCar.list({
          filter: {
            eventId: {
              eq: eventId,
            }
          }
        })
        if (errors) {
          console.log(errors)
        }
        const attendees = data.map(a=>({id: a.id, name: a.carId}))
        setOriginalAttendees(attendees)
        setAttendees(attendees)
      }

      fetch().catch(console.error)
    }
  }, [eventId, open]);  
  
  const handleClose = () => {
    onClose()
  };  

  const handleSubmit = () => {
    const addedAttendees = attendees.filter(a=>a.id==='')
    const deletedAttendees = originalAttendees.filter(c=>!attendees.find(a=>c.id===a.id))
    const submit = async () => {
      await Promise.all(addedAttendees.map(attendee=>{
        return client.models.EventCar.create({
          eventId: eventId!,
          carId: attendee.name,
        })
      }))
      await Promise.all(deletedAttendees.map(attendee=>{
        return client.models.EventCar.delete({
          id: attendee.id,
        })
      }))
    }
    submit().then(handleClose)
  };  

  return (
    <Dialog 
      onClose={handleClose} 
      open={open}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Edit Event Attendees</DialogTitle>
      <DialogContent>
          <Stack>
            <Autocomplete
              multiple
              value={attendees}
              onChange={(_event: any, newValue: IdAndName[]) => {
                setAttendees(newValue);
              }}
              options={cars} 
              getOptionLabel={(option)=>option.name}
              filterSelectedOptions
              renderInput={(params) => <TextField {...params} label="Car" />}
              />
          </Stack>

          <DialogActions>
              <Button onClick={handleClose} variant="outlined">
                Cancel
              </Button>
              <Button onClick={handleSubmit} variant="contained">
                Submit
              </Button>
          </DialogActions>
      </DialogContent>
    </Dialog>
  );
}


