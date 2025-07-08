import { Card, Heading, Text } from '@aws-amplify/ui-react';
import { NavLink } from 'react-router';

export default function AfterCard() {
  return (
    <Card borderRadius="medium"
      maxWidth="20rem"
      variation="outlined">
      <Heading>Fuel Reports</Heading>
      <NavLink to="/reports" end>
      <Text>View fuel reports from events</Text>
      </NavLink>
    </Card>
  )
}
