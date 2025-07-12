import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource'; 
import { Fragment, useEffect, useState } from 'react';
import { DataGrid, type GridRowsProp, type GridColDef } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import AddIcon from '@mui/icons-material/Add';

const client = generateClient<Schema>();

export interface NewDialogProps {
  open: boolean;
  onClose: () => void;
}

function NewDialog(props: NewDialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose()
  };  

  const handleSubmit = (formData: any) => {
    const submit = async () => {
      const { errors } = await client.models.Car.create({name: formData.name})
      if (errors) {
        console.log(errors)
      }
    }
    submit().then(handleClose)
  };  

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Create New Car</DialogTitle>
      <DialogContent>
        <FormContainer
            onSuccess={handleSubmit}>
            <TextFieldElement name="name" label="Name" required autoFocus/>

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


export default function CarManager() {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newDialogOpen, setNewDialogOpen] = useState<boolean>(false)

  useEffect(() => {
    client.models.Car.observeQuery().subscribe({
      next: (data) => {
        setRows(data.items.map(car=>{ return {
          id: car.name,
          name: car.name,
        }}))
        setLoading(false)
      }
    });
  }, []);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 200, sortable: true },
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
            sortModel: [{ field: 'name', sort: 'asc' }],
          },
        }}      
      />
    </Fragment>
  )
}
