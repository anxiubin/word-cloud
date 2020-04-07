import React, {useState} from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import AppBar from '@material-ui/core/AppBar';
import Drawer from '@material-ui/core/Drawer';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: 'auto',
    }
}
 
function AppShell({classes, children}) {
    const [toggle, setToggle] = useState(false);
    const handleDrawerToggle = () => {
        setToggle(prevValue => !prevValue);
    }

    return (
        <>
            <div className={classes.root}>
                <AppBar position="static">
                    <IconButton className={classes.menuButton} color="inherit" onClick={handleDrawerToggle}>
                        <MenuIcon/>
                    </IconButton>
                </AppBar>
                <Drawer open={toggle}>
                    <MenuItem onClick={handleDrawerToggle}>
                        <Link component={RouterLink} to="/">홈</Link>
                    </MenuItem>
                    <MenuItem onClick={handleDrawerToggle}>
                        <Link component={RouterLink} to="/texts">텍스트 관리</Link>
                    </MenuItem>
                    <MenuItem onClick={handleDrawerToggle}>
                        <Link component={RouterLink} to="/words">단어 관리</Link>
                    </MenuItem>
                </Drawer>
            </div>
            <div id="content" style={{margin: 'auto', marginTop: '20px'}}>
                {children}
            </div>
        </>
    );
}

export default withStyles(styles)(AppShell);