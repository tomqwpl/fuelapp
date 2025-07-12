import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource'; 
import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { FormContainer, SelectElement, TextFieldElement } from 'react-hook-form-mui';
import {DatePickerElement} from 'react-hook-form-mui/date-pickers'
import type { PickerValidDate } from '@mui/x-date-pickers';

const client = generateClient<Schema>();

export interface NewDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function NewEventDialog(props: NewDialogProps) {
  const [locations, setLocations] = useState<Array<string>>([]);
  const { onClose, open } = props;

  useEffect(() => {
    const fetch = async () => {
      const {data, errors} = await client.models.Location.list()
      if (errors) {
        console.log(errors)
      }
      setLocations(data.map(l=>l.name).sort())
    }

    fetch().catch(console.error)
  }, []);
  
  
  const handleClose = () => {
    onClose()
  };  

  const handleSubmit = (formData: any) => {
    const d: PickerValidDate = formData.startDate;
    const dur: number = formData.duration

    const submit = async () => {
      const { errors } = await client.models.Event.create({
        locationId: formData.location,
        eventType: formData.eventType,
        startDate: d.format('YYYY-MM-DD'),
        endDate: d.add(dur, 'day').format('YYYY-MM-DD'),
      })
      if (errors) {
        console.log(errors)
      }
    }
    submit().then(handleClose)
  };  

  const eventTypeOptions = client.enums.EventType.values().map(t=>({ id: t, label: t }))
  const locationOptions = locations.map(l=>({id: l, label: l}))

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Create New Event</DialogTitle>
      <DialogContent>
        <FormContainer
            defaultValues={{duration: 1}}
            onSuccess={handleSubmit}>

          <Stack>
            <DatePickerElement name="startDate" label="Date" required/>
            <TextFieldElement name="duration" label="Duration (days)" type="number" required/>
            <SelectElement name="eventType" label="Type" required options={eventTypeOptions}/>
            <SelectElement name="location" label="Circuit" required options={locationOptions}/>
          </Stack>

          <DialogActions>
              <Button onClick={handleClose} variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Submit
              </Button>
          </DialogActions>
        </FormContainer>
      </DialogContent>
    </Dialog>
  );
}


