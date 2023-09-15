import React from "react";
import { Button, Form, Input, message} from "antd";
import './contact.css';
import TextArea from "antd/es/input/TextArea";

import { useSelector } from "react-redux";
import {sendEmail} from '../../service/conatct/ContactService';
import { useNavigate } from "react-router-dom";
function Contact() {

    const auth = useSelector(state => state.auth);
    const navigate = useNavigate();
    const onFinish = (values) => {
        if(auth.isAuthenticated){
            sendermail(auth.user.email , values.message);
        }else
        {
            navigate('/login')
        }
    }


    const sendermail = async (senderEmail , msg) => {
        try{
            const res = await sendEmail(senderEmail , msg);
            console.log(res);
            message.success('Email sent successfully');
        }
        catch(error){
            message.error('Error while sending email');
            console.log(error);
        }

    }

    return(
        <><div className="contact">
            <div className="leftSide" >
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d396.8680457215902!2d9.87000165841973!3d37.27274634245744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12e31fcd2b81a37f%3A0x99e04275dc6a4893!2sRuspina%20Formation%20Bizerte!5e0!3m2!1sen!2stn!4v1694264481099!5m2!1sen!2stn" className="contact__left__map"   allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <div className="rightSide">
                <h1>Contact Us</h1>
                <Form id="contact-form" method="Post" onFinish={onFinish}>
                    
                    <label htmlFor="name">Full Name</label>
                    <Form.Item name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
                    <Input name="name" placeholder="Enter full name.." type="text"/>
                    </Form.Item>

                    <label htmlFor="email">Email</label>
                    <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                    <Input name="email" placeholder="Enter email.." type="email"/>
                    </Form.Item>

                    <label htmlFor="message">Message</label>
                    <Form.Item name="message" rules={[{ required: true, message: 'Please input your message!' }]}>
                    <TextArea rows="6" placeholder="Enter message..." name="message" required ></TextArea>
                    </Form.Item>

                    <Button htmlType="submit" type="primary"> Send Message</Button>
                </Form>
            </div>
        </div></>
    )
}
export default Contact;