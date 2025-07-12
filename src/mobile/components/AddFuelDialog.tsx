import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, List, Stack, TextField, Typography } from "@mui/material";
import { generateClient } from "aws-amplify/api";
import { useEffect, useState } from "react";
import type { Schema } from '../../../amplify/data/resource';
import { useAuthenticator } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

export interface AddFuelDialogProps {
  open: boolean;
  eventId: string
  onClose: () => void;
}

export default function AddFuelDialog(props: AddFuelDialogProps) {
  const { onClose, open, eventId } = props;
  const [ eventCars, setEventCars ] = useState<Array<Schema["EventCar"]["type"]>>([])
  const [ selectedCar, setSelectedCar ] = useState<string|undefined>()
  const [ quantity, setQuantity ] = useState(0)
  const { user } = useAuthenticator()

  const handleClose = () => {
    setQuantity(0);
    setSelectedCar(undefined)
    onClose()
  };  
  
  const handleSubmit = () => {
    const submit = async () => {
      const { errors } = await client.models.Fuel.create({
        eventId: eventId,
        carId: selectedCar!,
        when: new Date().toISOString(),
        quantity: quantity,
        addedBy: user.signInDetails?.loginId!
      })
      if (errors) {
        console.log(errors)
      }
    }
    submit().then(handleClose)
  }

  const addQuantity = (amount: number) => {
    setQuantity(quantity+amount)
  }
  
  interface AddQuantityButtonProps {
    amount: number
  }
  function AddQuantityButton(props: AddQuantityButtonProps) {
    const { amount } = props
    return <Grid><Chip label={`+${amount}L`}
            onClick={()=>addQuantity(amount)}
        />
    </Grid>
  }

  function ClearQuantityButton() {
    return <Grid><Chip label={`Clear`}
            onClick={()=>setQuantity(0)}
        />
    </Grid>
  }  

  useEffect(() => {
    if (open) {
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
            setEventCars(data) //.sort((a, b)=>a.carId.localeCompare(b.carId)))
        }
        }
        fetch().catch(console.error)
    } else {
        setEventCars([])
    }
  }, [open]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add Fuel</DialogTitle>
      <DialogContent>

        <Stack spacing={2}>
            <Typography>Car:</Typography>
            <Grid container spacing={1}>
                {eventCars.map(c=>(
                    <Grid key={c.id}>
                        <Chip 
                            key={c.carId}
                            label={c.carId} 
                            color={c.carId===selectedCar ? "primary" : undefined}
                            onClick={()=>setSelectedCar(c.carId)}
                        />
                    </Grid>
                ))}
            </Grid>

            <Typography>Quantity: {quantity}L</Typography>
            <Grid container spacing={1}>
                <AddQuantityButton amount={10}/>
                <AddQuantityButton amount={5}/>
                <AddQuantityButton amount={2}/>
                <AddQuantityButton amount={1}/>
                <ClearQuantityButton/>
            </Grid>

        </Stack>

        <DialogActions>
            <Button onClick={handleClose} variant="outlined">
            Cancel
            </Button>
            <Button 
                type="submit" 
                variant="contained" 
                disabled={!selectedCar || quantity===0}
                onClick={handleSubmit}>
            Confirm
            </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
    )
}