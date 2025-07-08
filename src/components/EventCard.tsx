import { Card, Heading, Text } from '@aws-amplify/ui-react';
import { NavLink } from 'react-router';

export default function EventCard() {
  return (
    <Card borderRadius="medium"
      maxWidth="20rem"
      variation="outlined">
      <Heading>On the day</Heading>
      <NavLink to="/fueling" end>
      <Text>Enter fuel when at an event</Text>
      </NavLink>
    </Card>
  )
}
