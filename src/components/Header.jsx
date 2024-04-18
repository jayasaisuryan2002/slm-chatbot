import React from 'react'
import { Box, Button, styled, Typography } from "@mui/material";
import { Link } from 'react-router-dom'
import headerImg from '../assets/pexels-binyamin-mellish-186078 (2).png'

const Header = () => {

    const CustomBox = styled(Box)(({ theme }) => ({
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        gap: theme.spacing(2),
        paddingTop: theme.spacing(8),
        backgroundColor: 'orange',
        minHeight: '100vh',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
        }
    }));

    const BoxText = styled(Box)(({ theme }) => ({
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(4),
        paddingTop: 0,
        [theme.breakpoints.down('md')]: {
            flex: '1',
            textAlign: 'center',
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            alignItems: 'center',
        },
    }));

    const BoxImage = styled(Box)(({ theme }) => ({
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '100px', 
        marginTop: '-10%',
        [theme.breakpoints.down('md')]: {
            flex: '2',
            textAlign: 'center',
            paddingBottom: '40%'
        },
        '@media (width: 1024px) and (height: 1366px)': {
            paddingBottom: '1000px'
        },
        '@media (width: 912px) and (height: 1368px)': {
            paddingBottom: '1000px'
        }
    }));

    return (
        <CustomBox component='header'>
            <BoxText
                component='section'
            >
                <Typography
                    variant='h2'
                    component='h1'
                    sx={{
                        fontWeight: 700,
                        color: '#fff',
                    }}
                >
                    Internal Policy ChatBot
                </Typography>

                <Typography
                    variant='body1'
                    component='p'
                    sx={{
                        py: 3,
                        lineHeight: 1.6,
                        color: '#fff',
                    }}
                >
                    Try our PwC Policy Chatbot,
                    It's Fast & Secured.
                </Typography>

                <Box>
                    <Button
                        variant='contained'
                        component={Link}
                        to={'/bot'}
                        sx={{
                            mr: 2,
                            px: 4,
                            py: 1,
                            fontSize: '0.9rem',
                            textTransform: 'capitalize',
                            borderRadius: 0,
                            borderColor: '#14192d',
                            color: '#fff',
                            backgroundColor: '#14192d',
                            "&&:hover": {
                                backgroundColor: "#343a55"
                            },
                            "&&:focus": {
                                backgroundColor: "#343a55"
                            }
                        }}
                    >
                        Explore Now
                    </Button>

                </Box>
            </BoxText>

            <BoxImage>
                <img
                    src={headerImg}
                    alt="headerImg"
                    style={{
                        width: "100%",
                        maxWidth: "600px",
                    }}
                />
            </BoxImage>

        </CustomBox>
    )
}

export default Header

