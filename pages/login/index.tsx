import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageTitle from '@/components/PageTitle';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button,
  styled
} from '@mui/material';
import Footer from '@/components/Footer';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import BaseLayout from '@/layouts/BaseLayout';
import Hero from '@/content/Overview/Hero';
import Logo from '@/components/LogoSign';
import Link from '@/components/Link';
import { Title } from '@mui/icons-material';

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  height: ${theme.spacing(10)};
  margin-bottom: ${theme.spacing(10)};
`
);

const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`
);

function Forms() {
  const { login } = useAuth()
  const [email, setEmail]  = useState('')
  const [password, setPassword]  = useState('')

  return (
    <>
    <OverviewWrapper>
      <HeaderWrapper>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center">
            <Logo />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flex={1}
            >
              <Box />
              <Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </HeaderWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={6} textAlign='center'>
            <Card>
              <CardHeader title="1StopLaundry Login" />
              <Divider />
              <CardContent>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' }
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    <TextField
                      type='email'
                      required
                      id="outlined-required"
                      label="Required"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='email@google.cm'
                    />
                    <br/>
                    <TextField
                      value={password}
                      id="outlined-password-input"
                      label="Password"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    </div>
                    </Box>
                    <Button sx={{ margin: 1 }} variant="contained" onClick={() => {login(email, password)}}>
                      Login
                  </Button>
                  <Button
                  color='secondary'
                  component={Link}
                  href="/sign-up"
                  variant="contained"
                  sx={{ ml: 2 }}
                >
                  Sign Up
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
      </OverviewWrapper>
    </>
  );
}

Forms.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;

export default Forms;
