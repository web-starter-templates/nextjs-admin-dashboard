import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button,
  styled,
  IconButton,
  Tooltip,
  useTheme,
  CircularProgress
} from '@mui/material';
import Footer from '@/components/Footer';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import BaseLayout from '@/layouts/BaseLayout';
import Logo from '@/components/LogoSign';
import { Visibility } from '@mui/icons-material';

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


function SignUp() {
  const { signup, loading } = useAuth()
  const [firstName, setFirstName]  = useState('')
  const [lastName, setLastName]  = useState('')
  const [email, setEmail]  = useState('')
  const [password, setPassword]  = useState('')
  const [passwordConfirm, setPasswordConfirm]  = useState('')
  const [formValid, setFormValid] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const theme = useTheme();

  useEffect(() => {
    if (email && password && passwordConfirm == password) 
      setFormValid(true)
    else 
      setFormValid(false)
  }, [email, password, passwordConfirm])

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
          <Grid item xs={12} lg={6} textAlign='center'>
            <Card>
              <CardHeader title="1StopLaundry Sign Up" />
              <Divider />
              { !loading && 
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
                      type='text'
                      required
                      id="outlined-required-firstName"
                      label="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      autoComplete='given-name'
                    />
                    <br/>
                    <TextField
                      type='text'
                      required
                      id="outlined-required-lastName"
                      label="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      autoComplete='family-name'
                    />
                    <br/>
                    <TextField
                      type='email'
                      required
                      id="outlined-required"
                      label="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete='email'
                    />
                    <br/>
                    <TextField
                      required
                      value={password}
                      id="new-password"
                      label="Password"
                      type={showPassword ? 'text' : "password"}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                    /> 
                    <Tooltip title="Show Password" arrow>
                      <IconButton
                        sx={{
                          'position': 'absolute',
                          '&:hover': { background: theme.colors.error.lighter },
                          color: theme.palette.info.main,
                          'marginTop': '25px'
                        }}
                        color="inherit"
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <br/>
                    <TextField
                      required
                      value={passwordConfirm}
                      id="new-password-confirm"
                      label="Confirm Password"
                      type="password"
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      autoComplete="new-password"
                    />
                    </div>
                    </Box>
                  <Button
                  disabled={!formValid}
                  color='primary'
                  onClick={() => signup(email, password, firstName, lastName)}
                  variant="contained"
                  sx={{ ml: 2 }}
                >
                  Register
                </Button>
                {/* <Button sx={{ margin: 1 }} variant="contained" href='/login' component={Link} color='secondary'>
                      Login
                  </Button> */}
              </CardContent>
              }
              { loading &&
                <CircularProgress 
                    sx={{
                      'margin': '50px'
                    }}
                />
              }
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
      </OverviewWrapper>
    </>
  );
}

SignUp.getLayout = (page) => <BaseLayout>{page}</BaseLayout>;

export default SignUp;
