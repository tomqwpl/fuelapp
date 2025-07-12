import { useAuthenticator } from '@aws-amplify/ui-react';
import { Button, Card, CardContent, Container, Stack, Typography } from '@mui/material';

export default function AccountPage() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const handleLogout = () => {
    signOut()
  }  

  return (
    <Container>
        <Stack>
            <Card sx={{ width: "100%" }}>
                <CardContent>
                    <Typography variant="h4">User Name</Typography>
                    <Typography variant="h5">{user.signInDetails?.loginId}</Typography>
                </CardContent>
            </Card>

            <Button variant="contained" onClick={handleLogout}>Log out</Button>
        </Stack>
    </Container>
  )
}

