import React, { useState, useContext } from 'react';
import {
    Grid,
    IconButton,
    MenuItem,
    Divider,
    Typography,
    Drawer,
} from '@mui/material';
import styled from '@emotion/styled';
import { Logout, Person } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import UserContext from '../../context/UserContext';
import { StyledIcon } from '../styled';


const StyledDrawer = styled(Drawer)(() => ({
    '& .MuiPaper-root': {
        width: '30ch'
    },
}));

export default function UserAccountMenu() {
    const [open, setOpen] = useState(false);
    const { logout, currentUser, navigate } = useContext(UserContext);

    const handleClick = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleProfile = () => {
        handleClose();
        navigate(`/profile/${currentUser}`);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <Grid
            item
            width={'4rem'}
            display={'flex'}
        >
            <IconButton
                onClick={handleClick}
                size='small'
                sx={{ marginLeft: 'auto' }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
            >
                <MenuIcon
                    sx={{
                        padding: 0.7,
                        width: 40,
                        height: 40,
                        color: 'primary.muted',
                        '&: hover': {
                            color: 'secondary.main',
                        },
                    }}
                />
            </IconButton>
            <StyledDrawer
                anchor={'right'}
                open={open}
                id='account-menu'
                onClose={handleClose}
            >

                <MenuItem
                    onClick={handleProfile}
                    aria-label='profile'
                >
                    <Person
                        fontSize='medium'
                        sx={{ color: 'primary.muted', marginRight: 1.5, scale: '1.2' }}
                    />
                    <Typography fontSize={'1.2rem'}>Profile</Typography>
                </MenuItem>
                <Divider
                    sx={{ bgcolor: 'primary.dark', width: '90%', alignSelf: 'center' }}
                />
                <MenuItem
                    onClick={handleLogout}
                    aria-label='logout'
                >
                    <StyledIcon>
                        <Logout />
                    </StyledIcon>
                    Logout
                </MenuItem>
            </StyledDrawer>
        </Grid >
    );
}