import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Input, Form, Button, message } from 'antd';
import { deleteCache } from './service';

export default () => {
  const onFinish = async (e) => {
    if (!e.type) {
      alert('请输入清除字段');
      return;
    }
    let result = deleteCache(e);
    message.success('清除成功');
  };
  return (
    <PageHeaderWrapper title={false}>
      <Card>
        <h1>today|tomorrow|week|nextweek|month|year</h1>
        <Form onFinish={onFinish}>
          <Form.Item name="type">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageHeaderWrapper>
  );
};
