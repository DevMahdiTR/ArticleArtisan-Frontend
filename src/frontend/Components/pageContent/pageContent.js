import React, { useContext, useEffect } from 'react';
import { useAuth } from '../authContext/authContext';
import { useNavigate } from 'react-router-dom';

const PageContent = () => {
  const { user} = useAuth();
  
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
