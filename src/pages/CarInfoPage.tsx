import { Heading, Placeholder } from '@aws-amplify/ui-react';
import { useParams } from 'react-router';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource'; 
import { useEffect, useState } from 'react';

const client = generateClient<Schema>();

export default function CarInfoPage() {
  let { carId } = useParams();
  const [car, setCar] = useState<Schema["Car"]["type"] | undefined>(undefined);

  useEffect(() => {
    if (carId) {
      const fetchData = async () => {
        const { data, errors } = await client.models.Car.get({ name: carId })
        if (errors) throw errors
        if (data) setCar(data)
      }

      fetchData().catch(console.error)
    }
  }, []);  

  if (!car) {
    return <Placeholder/>
  }
  return (
    <Heading>
        Info about car/driver {car.name}
    </Heading>
  )
}
