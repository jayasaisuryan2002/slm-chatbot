import React, { useState } from 'react';
import { styled, useTheme, Drawer, Divider, List, IconButton, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 5),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const itemList = [
  {
    text: "Home",
    icon: <HomeIcon />,
    to: "/"
  }
];

const MainContent = styled('div')({
  flexGrow: 1,
  position: 'relative', 
});

const Overlay = styled('div')(({ open }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 999, 
  display: open ? 'block' : 'none', 
}));

const DrawerItem = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCloseDrawerAndNavigate = () => {
    setOpen(false); 
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="end"
        onClick={handleDrawerOpen}
        sx={{ ...(open && { display: 'none' }) }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        sx={{
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {itemList.map((item) => (
            <ListItem 
              key={item.text} 
              component={Link} 
              to={item.to}
              onClick={handleCloseDrawerAndNavigate} 
              sx={{
                color: '#414141',
                "&:hover": {
                  backgroundColor: '#e9e5e5',
                  color: '#1c2859',
                }
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

   
      <MainContent>
      
        <Overlay open={open} onClick={handleDrawerClose} />
      </MainContent>
    </>
  );
};

export default DrawerItem;