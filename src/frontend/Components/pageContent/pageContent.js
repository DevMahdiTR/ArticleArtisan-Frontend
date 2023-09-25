import {useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PageContent = () => {

  const { user} = useSelector((state) => state.auth);
  
  const navigate = useNavigate();


  useEffect(() => {
    console.log(user);
    if (user.role?.name === 'ADMIN') {
      
      navigate('/dashboard' );
    }
  });
  return (
    <div className='body'>
    </div>
  );
};

export default PageContent;
