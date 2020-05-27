import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Table, Button, Modal, Form, Input, message } from 'antd';
import { connect } from 'dva';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { createCate, updateCate, deleteCate } from './service';

const layout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

const wrapperLayout = {
  wrapperCol: { offset: 11 },
};

const CateList = (Props) => {
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [updateData, setUpdateData] = useState({});
  const [form] = Form.useForm();
  const {
    dispatch,
    data: { cate },
  } = Props;

  useEffect(() => {
    getList();
  }, [page]);

  const getList = () => {
    dispatch({
      type: 'cate/fetchCateList',
      payload: {
        page,
        pageSize: 10,
      },
    });
  };

  const onFinish = async (vals) => {
    let result;
    if (updateData?.id) {
      result = await updateCate({
        ...updateData,
        cate_name: vals.cate_name,
      });
    } else {
      result = await createCate(vals);
    }

    if (result.data.insertId || result.data.changedRows) {
      message.success(`${result.data.changedRows ? '修改' : '添加'}成功`);
      form.resetFields();
      setUpdateData({});
      setVisible(false);
      getList();
    } else {
      message.error('添加失败');
    }
  };

  const fetchDelete = async (vals) => {
    Modal.confirm({
      title: '提示信息',
      icon: <ExclamationCircleOutlined />,
      content: '确认要删除吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const result = await deleteCate(vals);
        if (result.data.affectedRows) {
          message.success('删除成功');
          getList();
        } else {
          message.error('删除失败');
        }
      },
    });
  };

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '主题',
      dataIndex: 'cate_name',
    },
    {
      title: '新建时间',
      dataIndex: 'create_time',
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      render: (_) => {
        return _ || '无';
      },
    },
    {
      title: '编辑',
      render: (_) => {
        return (
          <div>
            <EditOutlined
              onClick={() => {
                setUpdateData(_);
                setVisible(true);
                form.setFieldsValue(_);
              }}
              style={{ fontSize: 20, marginRight: 10 }}
            />
            <DeleteOutlined
              onClick={() => {
                fetchDelete(_);
              }}
              style={{ fontSize: 20 }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeaderWrapper title={false}>
        <Modal
          title="新增主题"
          visible={visible}
          onCancel={() => {
            setVisible(false);
          }}
          footer={null}
        >
          <Form onFinish={onFinish} {...layout} form={form}>
            <Form.Item
              label="主题"
              name="cate_name"
              rules={[{ required: true, message: '请填写主题' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item {...wrapperLayout}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <Card>
          <Button
            type="primary"
            onClick={() => {
              setVisible(true);
            }}
          >
            + 新建主题
          </Button>
        </Card>
        <Table
          dataSource={cate.cateList}
          columns={columns}
          pagination={{
            pageSize: 10,
            total: cate.total,
            showQuickJumper: true,
            onChange: (page) => {
              setPage(page);
            },
            current: page,
            showTotal: (total) => {
              return `共${total}条数据`;
            },
          }}
        />
      </PageHeaderWrapper>
    </div>
  );
};

export default connect((data) => ({
  data,
}))(CateList);
