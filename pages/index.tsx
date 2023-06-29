import {
  Typography,
  Box,
  Card,
  Container,
  Button,
  styled
} from '@mui/material';
import type { ReactElement } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';

import Link from 'src/components/Link';
import Head from 'next/head';

import Logo from 'src/components/LogoSign';
import Hero from 'src/content/Overview/Hero';
import SidebarLayout from '@/layouts/SidebarLayout';
import { useAuth } from '@/contexts/AuthContext';
import Label from '@/components/Label';

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  height: ${theme.spacing(10)};

`
);

const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
    padding-bottom: ${theme.spacing(10)};
`
);

function Overview() {

  const { user } = useAuth()

  if (!user) return <></>

  return (
    <OverviewWrapper>
      <Head>
        <title>NextJS Starter</title>
      </Head>
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Typography textAlign="center" variant="inherit">
           
          Welcome to the NextJS Dashboard, <b>{ user.firstName}</b>
          { !user.roles.length && 
          <>
            <br/><br/>
            <Label color="info" >
            We'll activate your account shortly.
            </Label>
          </>
          }
          
        </Typography>
      </Container>
    </OverviewWrapper>
  );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
