import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource'; 
import { Fragment, useEffect, useState } from 'react';
import { DataGrid, type GridRowsProp, type GridColDef } from '@mui/x-data-grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {FormContainer, TextFieldElement} from 'react-hook-form-mui'

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
      const { errors } = await client.models.Location.create({name: formData.name})
      if (errors) {
        console.log(errors)
      }
    }
    submit().then(handleClose)
  };  

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Create New Location</DialogTitle>
      <DialogContent>
        <FormContainer
            onSuccess={handleSubmit}>
            <TextFieldElement name="name" label="Name" required/>

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

export default function LocationManager() {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newDialogOpen, setNewDialogOpen] = useState<boolean>(false)

  useEffect(() => {
    client.models.Location.observeQuery().subscribe({
      next: (data) => {
        setRows(data.items.map(location=>{ return {
          name: location.name,
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
