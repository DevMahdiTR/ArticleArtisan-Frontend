import React from 'react';
import { FacebookOutlined, InstagramOutlined, LinkedinOutlined } from '@ant-design/icons';
import "./footer.css";
import { Layout, Row} from 'antd';

const { Footer } = Layout;


const AppFooter = () => {
  return (
    <div className='Footer'>
    <Footer>
      <Row justify={"center"}>
          <div style={{ padding: '20px' }}>
            <h3>About us</h3>
            <p>Adresse : Bizerte, Rue Hsan Nouiri Bloc A 2ème étage Bureau 205</p>
            <p>Téléphone : +216 54 431 803</p>
            <p>Email : ruspinabizerteformation@gmail.com</p>
          </div>
          <div style={{ padding: '20px' }}>
            <h3>Follow us</h3>
            <div>
              <a href="https://www.facebook.com/ruspinaformation" target="_blank" rel="noopener noreferrer">
                <FacebookOutlined style={{ fontSize: '20px', marginRight: '10px' }} />
              </a>
             
              <a href="https://www.instagram.com/ruspina_formation/" target="_blank" rel="noopener noreferrer">
                <InstagramOutlined style={{ fontSize: '20px', marginRight: '10px' }} />
              </a>
              <a href="https://www.linkedin.com/company/ruspina-centre-de-formation/" target="_blank" rel="noopener noreferrer">
                <LinkedinOutlined style={{ fontSize: '20px' }} />
              </a>
            </div>
          </div>
      </Row>
    </Footer>
    </div>
  );
};

export default AppFooter;
