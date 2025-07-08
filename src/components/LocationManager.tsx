import { Button, Collection, Flex } from '@aws-amplify/ui-react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource'; 
import { useEffect, useState } from 'react';

const client = generateClient<Schema>();

const promptCreateLocation = async () => {
 const name = window.prompt("Location name")
 if (name) {
    await client.models.Location.create({
        name
    })    
 }
}

export default function LocationManager() {
    const [locations, setLocations] = useState<Array<Schema["Location"]["type"]>>([]);

  useEffect(() => {
    client.models.Location.observeQuery().subscribe({
      next: (data) => setLocations([...data.items]),
    });
  }, []);

  return (
    <Flex justifyContent="space-between" direction="column">
        <Button variation='primary' onClick={promptCreateLocation}>
            +New
        </Button>
    <Collection
        type="list"
        direction="row"
        wrap="wrap"
        isPaginated
        isSearchable
        itemsPerPage={12}
        items={locations}
        >
      {(locations, index) => (
        <Button grow="1" key={index}>
          {locations.name}
        </Button>
      )}            
    </Collection>
    </Flex>
  )
}
