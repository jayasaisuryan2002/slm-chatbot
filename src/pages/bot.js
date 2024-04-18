import React from 'react';
import Content from '../components/Content';

const Bot = ({ drawerOpen }) => {
  return (
    <div style={{ backgroundColor: 'orange', minHeight: '100vh' }}>
      <Content drawerOpen={drawerOpen} />
    </div>
  );
};

export default Bot;
