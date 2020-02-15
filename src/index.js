import React from 'react';
import './index.css';
import Cadastro from './formulario.js';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';

import { Layout } from 'antd';

const { Header, Content } = Layout;

class SiderDemo extends React.Component {

  render() {
    return (
      <Layout>
        
        <Layout>
            
          <Header style={{ background: '#fff', padding: 0 }}>
          <h1 className="titulo" >Capacitação 2020 - Férias</h1>
            
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
            }}
          >
            <Cadastro/>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

ReactDOM.render(<SiderDemo />, document.getElementById('root'));