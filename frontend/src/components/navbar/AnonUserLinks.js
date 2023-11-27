import React, { useContext } from 'react';
import UserContext from '../../context/UserContext';
import { PrimaryButton } from '../styled';
import { Grid } from '@mui/material';

export default function AnonUserLinks() {
    const { navigate } = useContext(UserContext);

    const handleLoginClick = () => {
        navigate('/login');
    };

    // const handleSignUpClick = () => {
    //   navigate('/signup');
    // };

    return (
        <Grid item>
            {/* <Grid
          container
          direction='row'
          alignItems='center'
          justifyContent='flex-end'
          height='100%'
        >
          <Grid
            item
            marginRight={1}
          > */}
            <PrimaryButton
                size='small'
                className='main-button'
                onClick={handleLoginClick}>
                Login
            </PrimaryButton>
            {/* </Grid>
          <Grid item>
            <Button
              size='small'
              variant='text'
              className='main-button'
              sx={{
                color: 'primary.muted',
                '&:hover': {
                  color: 'secondary.main',
                },
              }}
              onClick={handleSignUpClick}
            >
              Sign Up
            </Button>
          </Grid>
        </Grid> */}
        </Grid>
    );
}