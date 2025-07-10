import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource'; 
import { Fragment, useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams, type GridRowsProp } from '@mui/x-data-grid';
import { FormContainer, SelectElement, TextFieldElement } from 'react-hook-form-mui';
import {DatePickerElement} from 'react-hook-form-mui/date-pickers'


const client = generateClient<Schema>();

export interface NewDialogProps {
  open: boolean;
  onClose: () => void;
}

function NewDialog(props: NewDialogProps) {
  const [locations, setLocations] = useState<Array<Schema["Location"]["type"]>>([]);
  const { onClose, open } = props;

  useEffect(() => {
    const fetch = async () => {
      const {data, errors} = await client.models.Location.list()
      if (errors) {
        console.log(errors)
      }
      setLocations(data)
    }

    fetch().catch(console.error)
  }, []);
  
  
  const handleClose = () => {
    onClose()
  };  

  const handleSubmit = (formData: any) => {
    const submit = async () => {
      const { errors } = await client.models.Location.create({name: formData.name})
      if (errors) {
        console.log(errors)
      }
    }
    submit().then(handleClose)
  };  

  const eventTypes = client.enums.EventType.values()

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Create New Event</DialogTitle>
      <DialogContent>
        <FormContainer
            onSuccess={handleSubmit}>

          <DatePickerElement name="startDate" label="Date" required/>
          <TextFieldElement name="duration" label="Duration" type="number" required/>
          <SelectElement name="eventType" label="Type" required options={eventTypes}/>
          <SelectElement name="location" label="Circuit" required options={locations.map(l=>l.name)}/>

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


export default function EventManager() {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newDialogOpen, setNewDialogOpen] = useState<boolean>(false)

  useEffect(() => {
    const sub = client.models.Event.observeQuery(
      {
        selectionSet: ["id", "eventType", "startDate", "location.name", "cars.car.name"],
      }
    ).subscribe({
      next: (data) => {
        setRows(data.items.map(event=>{ return {
          id: event.id,
          date: event.startDate,
          location: event.location.name,
          type: event.eventType,
          attendees: event.cars.map(car=>car.car.name)
        }}))
        setLoading(false)
      }
    });
    return () => sub.unsubscribe();
  }, []);

  const columns: GridColDef[] = [
    { field: "date", 
      headerName: "Date", 
      width: 200, 
      sortable: true, 
      valueFormatter: (_value, row) => {
        return new Date(row.date).toLocaleDateString(undefined, {dateStyle: "full"});
      },
    },
    {
      field: "type",
      headerName: "Type",
      width: 200,
      sortable: true,
    },
    {
      field: "location",
      headerName: "Circuit",
      width: 200,
      sortable: true,
    },
    {
      field: "attendees",
      headerName: "Attendees",
      width: 400,
      renderCell: (params: GridRenderCellParams<any, string[]>) => (
        (params.value||[]).map(car=>(
          <Chip label={car}/>
        ))
      )
    }
  ];

  const handleNewButtonClick = () => {
    setNewDialogOpen(true)
  }
  const handleNewDialogClose = () => {
    setNewDialogOpen(false)
  }

  return (
    <Fragment>
      <NewDialog 
        open={newDialogOpen}
        onClose={handleNewDialogClose}/> 
      <Button
        variant='contained' 
        startIcon={<AddIcon/>} 
        onClick={handleNewButtonClick}>New</Button>

      <DataGrid
        rows={rows} 
        columns={columns} 
        loading={loading}
        showToolbar
        initialState={{
          sorting: {
            sortModel: [{ field: 'date', sort: 'asc' }],
          },
        }}
      />
    </Fragment>
  )
}
