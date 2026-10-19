import { AppBar, Logout, UserMenu, useUserMenu } from "react-admin";
import { Link } from "react-router";

import { ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const ProfileMenuItem = () => {
  const userMenu = useUserMenu();
  return (
    <MenuItem component={Link} to="/profile" onClick={userMenu?.onClose}>
      <ListItemIcon>
        <PersonIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Profile</ListItemText>
    </MenuItem>
  );
};

const AppUserMenu = () => (
  <UserMenu>
    <ProfileMenuItem />
    <Logout />
  </UserMenu>
);

const AppAppBar = () => <AppBar userMenu={<AppUserMenu />} />;

export default AppAppBar;
