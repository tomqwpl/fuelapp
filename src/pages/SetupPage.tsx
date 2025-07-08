import { Flex, Tabs } from '@aws-amplify/ui-react';
import LocationManager from '../components/LocationManager';

export default function SetupPage() {
  return (
    <Flex direction="column" gap="2rem">
      <Tabs.Container defaultValue="1">
        <Tabs.List spacing="equal">
          <Tabs.Item value="1">Events</Tabs.Item>
          <Tabs.Item value="2">Locations</Tabs.Item>
          <Tabs.Item value="3">Cars/Drivers</Tabs.Item>
        </Tabs.List>
        <Tabs.Panel value="1"></Tabs.Panel>
        <Tabs.Panel value="2"><LocationManager/></Tabs.Panel>
        <Tabs.Panel value="3"></Tabs.Panel>
      </Tabs.Container>
    </Flex>
  )
}
