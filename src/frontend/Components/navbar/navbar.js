import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import './navbar.scss';
import {nav_logo} from '../../assets/index';

import { AuthActions } from '../../redux/actions';
import { useSelector, useDispatch } from 'react-redux';
import { MenuIcon } from '../../assets/index';

function Navbar() {

  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLoginClick = () => {
    navigate('./login');
  };

  const handleLogoClick = () => {
    navigate('/');
  }
  const handleLogoutClick = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    dispatch(AuthActions.logout());

    navigate('/');
  };

  const handkOnClickMenu = () => {
    const navbarRightSide = document.querySelector('.navbar__right');
    navbarRightSide.classList.toggle('visible'); 
    console.log(navbarRightSide);
  }
  return (
    <div className='navbar'>
      <div className='navbar__left'>
        <img src={nav_logo} alt='logo' className='navbar__logo' onClick={handleLogoClick} />
      </div>
      <div className='navbar__menu'  onClick= {handkOnClickMenu}>
        <MenuIcon className='navbar__menu__icon' />
      </div>
      <div className='navbar__right'>
        <Link className='navlinks' to='/'>Home</Link>
        <Link className='navlinks'to='/courses'>Courses</Link>
        <Link className='navlinks'to='/about'>About</Link>
        <Link className='navlinks'to='/contact'>Contact</Link>
        {(auth.user?.role?.name === 'ADMIN' && auth.isAuthenticated) &&
          <Link to="/dashboard">DashBoard</Link>
        }
        <Button type="primary" className="btn btn-primary" onClick={auth.isAuthenticated ? handleLogoutClick : handleLoginClick}>{auth.isAuthenticated ? "Logout" : "Login"}</Button>
      </div>
    </div>
  );
}

export default Navbar;
