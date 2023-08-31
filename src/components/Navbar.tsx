import React, { ReactElement, useContext, useState, ChangeEvent, MouseEvent } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Settings from '@mui/icons-material/Settings';
import SourceIcon from '@mui/icons-material/Source';
import Logout from '@mui/icons-material/Logout';
import { Spacing } from "./StyledComponents";
import { AppContext } from "../AppContext";
import styles from "./styles.module.css";

const NavbarStyle = styled.div`
  padding: 0 10px 5px 0;
  margin-right: 50px;
  background: #B89E47;
  min-height: 46px;
  text-align: center;
  color: #f8fcda;
  width: 100%;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
`;

interface NavProps {
  setSettingsDialogType: (val: string) => void;
}

interface AccountMenuProps extends NavProps {
  avatar: string | null | undefined;
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  signOutUser: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const AccountMenu = (props: AccountMenuProps): ReactElement => {

  const { avatar, setSettingsDialogType, handleImageChange, signOutUser } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const location = useLocation();

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        {location.pathname !== '/home' && location.pathname !== '/login' && (
          <Link to="/home" style={{ textDecoration: 'none', float: 'right' }}>
            <Typography
              sx={{ minWidth: 100, color: '#f8fcda', float: 'right', fontWeight: 'bold', ml: 5 }}
              component='h4'
            >
              Home
            </Typography>
          </Link>
        )}
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 'auto', mr: 6 }}
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
        <MenuItem onClick={() => setSettingsDialogType('sheetIds')}>
          <ListItemIcon>
            <SourceIcon fontSize="small" />
          </ListItemIcon>
          Sheet IDs
        </MenuItem>
        <MenuItem onClick={() => setSettingsDialogType('mapCenter')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Map Settings
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

interface NavBarProps extends NavProps {

}

const NavBar: React.FunctionComponent<NavBarProps & RouteComponentProps> = (props: NavBarProps) => {

  const { currentUser, signOutUser, updateAvatar } = useContext(AppContext);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
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
          setSettingsDialogType={props.setSettingsDialogType}
          avatar={currentUser?.avatar}
          handleImageChange={handleImageChange}
          signOutUser={signOutUser}
        />
      </Spacing>
    </NavbarStyle>
  );
};

export default withRouter(NavBar);
