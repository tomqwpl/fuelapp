import { Button, Collection, Flex } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource'; 
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';

const client = generateClient<Schema>();

const promptCreateCar = async () => {
 const name = window.prompt("Driver/car name")
 if (name) {
    const {errors} = await client.models.Car.create({
        name
    })    

    if (errors) {
        console.log(errors)
    }
 }
}

export default function CarManager() {
    const [cars, setCars] = useState<Array<Schema["Car"]["type"]>>([]);

  useEffect(() => {
    client.models.Car.observeQuery().subscribe({
      next: (data) => setCars([...data.items].sort((a, b)=>a.name.localeCompare(b.name))),
    });
  }, []);

  return (
    <Flex justifyContent="space-between" direction="column">
        <Button variation='primary' onClick={promptCreateCar}>
            +New
        </Button>
    <Collection
        type="list"
        direction="row"
        wrap="wrap"
        isPaginated
        isSearchable
        itemsPerPage={12}
        items={cars}
        >
      {(cars, index) => (
        <NavLink key={index} to={`/car/${encodeURIComponent(cars.id)}`}>
          {cars.name}
        </NavLink>
      )}            
    </Collection>
    </Flex>
  )
}
