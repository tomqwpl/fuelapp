import { Heading, Placeholder } from '@aws-amplify/ui-react';
import { useParams } from 'react-router';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource'; 
import { useEffect, useState } from 'react';

const client = generateClient<Schema>();

export default function LocationInfoPage() {
  let { locationId } = useParams();
  const [location, setLocation] = useState<Schema["Location"]["type"] | undefined>(undefined);

  useEffect(() => {
    if (locationId) {
      const fetchData = async () => {
        const { data, errors } = await client.models.Location.get({ name: locationId })
        if (errors) throw errors
        if (data) setLocation(data)
      }

      fetchData().catch(console.error)
    }
  }, []);  

  if (!location) {
    return <Placeholder/>
  }
  return (
    <Heading>
        Info about location {location.name}
    </Heading>
  )
}
