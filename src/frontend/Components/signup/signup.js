import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, notification } from 'antd';
import {RegisterService} from '../../service/auth/AuthService'
import "./signup.css";


const SignUp = () => {
  const [signupData, setSignupData] = useState({
    email: '',
    fullName: '',
    address: '',
    phoneNumber: '',
    password: ''
  });
  const [isSignUpSuccessful, setIsSignUpSuccessful] = useState(false);

  const regexs = {
    passwordRegex: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/,
    emailRegex: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
    phoneNumberRegex: /^\+?\d{8,}$/,
  };


  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  const validatePassword = (_,password) => {
    if (regexs.passwordRegex.test(password)) {
        return Promise.resolve();
    } 
    return Promise.reject('Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character');

  };

  const validateEmail = (rule , email) => {
      if(regexs.emailRegex.test(email)){
          return Promise.resolve();
      }
      return Promise.reject('Please enter a valid email');
  }
  const validatePhoneNumber = (rule , phoneNumber) => {
    if(regexs.phoneNumberRegex.test(phoneNumber)){
      return Promise.resolve();
  }
  return Promise.reject('Please enter a valid phone number');
  }
  const validateConfirmPassword = (rule ,confirmPassword) => {
    if (confirmPassword !== signupData.password) {
      return Promise.reject('Passwords do not match');
    }
    return Promise.resolve();
  }

  const register = async () => {
    try {
      const response = await RegisterService(signupData);
      
      notification.info({ message: 'Please check your email for verification.' , placement: 'topRight', duration: 30});
      message.success('Sign up successful! ');
    } catch (error) {
      console.log(error);
      message.error('Sign up failed. Please try again.');
    }
  }
  const onFinish = (values) => {
    register(signupData);
    setIsSignUpSuccessful(true);
  };



  return (
    <div className="inscrireinfo">
      <Form name="signup-form" className='signup-form' onFinish={onFinish}>
        <Typography.Title>Sign Up</Typography.Title>
        <label>Email</label>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { validator: validateEmail}
            
          ]}
        >
          <Input name="email" onChange={(e) => handleDataChange(e)} />
        </Form.Item>
        <label>Full Name</label>
        <Form.Item

          name="fullName"
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input  name="fullName" value={signupData.fullName} onChange={(e) => handleDataChange(e)} />
        </Form.Item>
        <label>Address</label>

        <Form.Item
          name="address"
          rules={[{ required: true, message: 'Please enter your address' }]}
        >
          <Input  name="address" onChange={(e) => handleDataChange(e)} />
        </Form.Item>
        <label>Phone Number</label>

        <Form.Item
          name="phoneNumber"
          rules={[
            { required: true, message: 'Please enter your Phone Number' },
            { validator: validatePhoneNumber},
          ]}
        >
          <Input   name="phoneNumber" onChange={(e) => handleDataChange(e)} />
        </Form.Item>
        <label>Password</label>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { validator: validatePassword}
          ]}
        >

          <Input.Password  name="password" onChange={(e) => handleDataChange(e)} />
        </Form.Item>
        <label>Confirm Password</label>

        <Form.Item
          name="confirmPassword"
          rules={[
            { required: true, message: 'Please confirm your password' },
            { validator: validateConfirmPassword },
          ]}
        >
          <Input.Password  name="confirmPassword" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Sign Up
          </Button>
        </Form.Item>

      </Form>
    </div>
  );
};

export default SignUp;
