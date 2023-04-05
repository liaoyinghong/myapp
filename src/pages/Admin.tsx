import {PageHeaderWrapper} from '@ant-design/pro-components';
import React from 'react';

const Admin: React.FC = (prop) => {
  const children = prop;
  return (
    <PageHeaderWrapper
      content={'这个页面只有管理员才能查看'}>
      {children}
    </PageHeaderWrapper>
  );
};

export default Admin;
