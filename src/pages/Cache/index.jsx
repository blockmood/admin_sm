import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Input, Form, Button, message } from 'antd';
import { deleteCache } from './service';

export default () => {
  const onFinish = async (e) => {
    if (!e.type.trim()) {
      alert('请输入清除字段');
      return;
    }
    let result = deleteCache(e);
    if (result.status == 200) {
      message.success('清除成功');
    } else {
      message.error('清除失败');
    }
  };
  return (
    <PageHeaderWrapper title={false}>
      <Card>
        <Form onFinish={onFinish}>
          <Form.Item name="type">
            <Input placeholder="字段支持 today|tomorrow|week|nextweek|month|year" />
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
