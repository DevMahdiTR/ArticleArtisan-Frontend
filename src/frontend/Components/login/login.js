import React, { useState } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LoginService } from "../../service/auth/AuthService"

import { AuthActions } from '../../redux/actions';
import { useDispatch } from 'react-redux';
import './login.css';


const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleDataChange = (event) =>{
      const {name, value} = event.target;
      setLoginData({
          ...loginData,
          [name] : value
      })
  };

  const handleSubmit = (e)=>{
      LoginService(loginData).then((res)=>{
          localStorage.setItem('token', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(res.data.userEntityDTO));
          dispatch(AuthActions.login(
            {
              user: res.data.userEntityDTO,
              token : res.data.accessToken,
              refreshToken : res.data.refreshToken,
            }
          ));
          navigate('/');

      }).catch((e)=>{
        console.log(e);
      })
    }
    const handleSignUpClick = () => {
      navigate('/signup');
    };

  return (
    <div className='loginfo__container'>
      <div className='loginfo'>
        <Form name="login-form" className='login-form' onFinish={handleSubmit}>
          <Typography.Title>Login</Typography.Title>
          <label>Email</label>
          <Form.Item
            className='email'
            name="email"
            rules={[
              { required: true, message: 'Ce champ est obligatoire' },
              {type: 'email', message: 'Veuillez entrer un email valide'}]}
          >
            <Input name="email" value={loginData.email} onChange={(e) => handleDataChange(e)} />
          </Form.Item>
          <label>Password</label>
          <Form.Item
            className='password'
            name="password"
            rules={[{ required: true, message: 'Ce champ est obligatoire' }]}
          >
            <Input.Password name="password" value={loginData.password} onChange={(e) => handleDataChange(e)}  />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" style = {{marginRight :'10px' }}>Login</Button>
            <Button type="primary" onClick={handleSignUpClick} >
              SignUp
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
