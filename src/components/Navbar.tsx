import React, {ReactElement, useContext} from "react";
import {useLocation, withRouter} from "react-router";
import {Link} from "react-router-dom";
import styled from "styled-components";
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import {Spacing} from "./StyledComponents";
import Button from "./Button";
import {AppContext} from "../AppContext";

const NavbarStyle = styled.div`
  padding: 20px 20px;
  background: #7c6354;
  min-height: 50px;
  text-align: center;
  color: #f8fcda;
  margin-bottom: 30px;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  cursor: pointer;
`;

type AccountMenuProps = {
  avatar: string | null | undefined;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  signOutUser: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const AccountMenu = ({ avatar, handleImageChange, signOutUser }: AccountMenuProps): ReactElement => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log(avatar)
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Typography sx={{ minWidth: 100 }}>Contact</Typography>
        <Typography sx={{ minWidth: 100 }}>Profile</Typography>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {avatar && <Avatar src={avatar}/>}
          </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem component={Link} to={{ pathname: "/login", state: { logout: true } }}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

const NavBar = (): ReactElement => {
  const location = useLocation();
  const { currentUser, signOutUser, updateAvatar } = useContext(AppContext);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null && e.target.files.length > 0) {
      const rawImage = e.target.files[0];
      // fetches the extension name of the image
      // gets the last index of the '.' and adds 1 to it
      // returns a substring of all character to the left after this index
      const ext = rawImage.name.substr(rawImage.name.lastIndexOf(".") + 1);
      const image = new Blob([rawImage], { type: "image" });

      updateAvatar({ image, ext });
    }
  };

  return (
    <NavbarStyle>
      <Spacing>
        <AccountMenu
          avatar={currentUser?.avatar}
          handleImageChange={handleImageChange}
          signOutUser={signOutUser}
        />
      </Spacing>
    </NavbarStyle>
  );
};

export default withRouter(NavBar);
