import { Card, Heading, Text } from '@aws-amplify/ui-react';
import { NavLink } from 'react-router';

export default function BeforeCard() {
  return (
    <Card borderRadius="medium"
      maxWidth="20rem"
      variation="outlined">
      <Heading>Before</Heading>
      
      <NavLink to="/setup" end>
        <Text>Set up events, cars, etc</Text>
      </NavLink>
    </Card>
  )
}
