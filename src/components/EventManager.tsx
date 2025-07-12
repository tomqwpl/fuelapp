import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource'; 
import { Fragment, useEffect, useRef, useState } from 'react';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Autocomplete, Box, Button, TextField, } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRowModes, useGridApiRef, type GridColDef, type GridRenderCellParams, type GridRowId, type GridRowModesModel, type GridRowsProp } from '@mui/x-data-grid';
import NewEventDialog from './NewEventDialog';
import EditAttendeesDialog from './EditAttendeesDialog';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const client = generateClient<Schema>();

export default function EventManager() {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [loadingEventCars, setLoadingEventCars] = useState<boolean>(true);
  const [newDialogOpen, setNewDialogOpen] = useState<boolean>(false)
  const [attendeesDialogOpen, setAttendeesDialogOpen] = useState<boolean>(false)
  const [editingEventId, setEditingEventId] = useState<string|undefined>(undefined)
  const [locations, setLocations] = useState<Array<string>>([]);
  const [cars, setCars] = useState<Array<string>>([]);

  useEffect(() => {
    let events: Array<Schema["Event"]["type"]> = []
    let eventCars: Array<Schema["EventCar"]["type"]> = []

    const calculateRows = () => {
      const rows = events.map(event => {
        const attendees = eventCars.filter(ec => ec.eventId==event.id).map(ec=>ec.carId)
        return {
          id: event.id,
          date: event.startDate,
          location: event.locationId,
          type: event.eventType,
          attendees: attendees,
        }
      })
      setRows(rows)
    }

    const eventsSub = client.models.Event.observeQuery().subscribe({
      next: (data) => {
        events = data.items
        calculateRows()
        setLoadingEvents(false)
      }
    });

    const eventCarsSub = client.models.EventCar.observeQuery().subscribe({
      next: (data) => {
        eventCars = data.items
        calculateRows()
        setLoadingEventCars(false)
      }
    });

    return () => {
      eventsSub.unsubscribe();
      eventCarsSub.unsubscribe()
    }
  }, []);

  useEffect(() => {
    const sub = client.models.Location.observeQuery().subscribe({
      next: (data) => {
        setLocations(data.items.map(l=>l.name).sort())
      }
    });
    return () => sub.unsubscribe();    
  }, []);
  
  useEffect(() => {
    const sub = client.models.Car.observeQuery().subscribe({
      next: (data) => {
        setCars(data.items.map(l=>l.name).sort())
      }
    });
    return () => sub.unsubscribe();    
  }, []);
  
  const handleEditAttendeesClick  = (id: GridRowId) => () => {
    setEditingEventId(id as string)
    setAttendeesDialogOpen(true)
  };

  const handleDeleteClick = (id: GridRowId) => () => {
  };

  const columns: GridColDef[] = [
    { field: "date", 
      headerName: "Date", 
      type: 'date',
      width: 200, 
      sortable: true, 
      editable: true,
      valueGetter: (_value, row) => {
        return new Date(row.date);
      },
      valueFormatter: (value: Date, _row) => {
        return value.toLocaleDateString(undefined, {dateStyle: "full"});
      },
    },
    {
      field: "type",
      headerName: "Type",
      width: 200,
      sortable: true,
      editable: true,
      type: 'singleSelect',
      valueOptions: client.enums.EventType.values()
    },
    {
      field: "location",
      headerName: "Circuit",
      width: 200,
      sortable: true,
      editable: true,
      type: 'singleSelect',
      valueOptions: locations,
    },
    {
      field: "attendees",
      headerName: "Attendees",
      width: 400,
      editable: true,
      display: 'flex',
      renderCell: (params: GridRenderCellParams<any, string[]>) => (
        (params.value||[]).map(car=>(
          <Chip label={car}/>
        ))
      ),
      renderEditCell: (params: GridRenderCellParams<any, string[]>) => (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', pr: 2 }}>
          <Autocomplete 
            multiple
            defaultValue={params.value}
            options={cars}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField {...params} 
                variant="standard"
                label="Attendees" 
                placeholder='Cars'/>
            )}
          />
      </Box>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DirectionsCarIcon />}
            label="Edit Attendees"
            className="textPrimary"
            onClick={handleEditAttendeesClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },    
  ];

  const handleNewButtonClick = () => {
    setNewDialogOpen(true)
  }
  const handleNewDialogClose = () => {
    setNewDialogOpen(false)
  }

  const handleAttendeesDialogClose = () => {
    setAttendeesDialogOpen(false)
  }

  return (
    <Fragment>
      <NewEventDialog
        open={newDialogOpen}
        onClose={handleNewDialogClose}/> 
      <EditAttendeesDialog
        open={attendeesDialogOpen}
        eventId={editingEventId}
        onClose={handleAttendeesDialogClose}/> 
      <Button
        variant='contained' 
        startIcon={<AddIcon/>} 
        onClick={handleNewButtonClick}>New</Button>

      <DataGrid
        rows={rows} 
        columns={columns} 
        loading={loadingEvents || loadingEventCars}
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
