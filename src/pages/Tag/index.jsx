import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Form, Modal, Input, Select, message, Table } from 'antd';
import { connect } from 'dva';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { createTag, deleteTag, updateTag } from './service';

const { Option } = Select;

const layout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

const wrapperLayout = {
  wrapperCol: { offset: 11 },
};

const Tag = (props) => {
  const {
    dispatch,
    data: { cate, tag },
  } = props;

  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [isEid, setIsEID] = useState(0);
  const [form] = Form.useForm();

  console.log(props.data);

  useEffect(() => {
    if (!cate.cateList.length) {
      dispatch({
        type: 'cate/fetchCateList',
        payload: {
          page,
          pageSize: 10,
        },
      });
    }
    if (!tag.tagList.length) {
      dispatch({
        type: 'tag/fetchTagList',
        payload: {
          page,
          pageSize: 10,
        },
      });
    }
  }, []);

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
    },
    {
      title: '标签',
      dataIndex: 'tag_name',
    },
    {
      title: '新建时间',
      dataIndex: 'create_time',
      render: (_) => {
        return moment(Number(_)).format('YYYY-MM-DD');
      },
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      render: (_) => {
        return moment(Number(_)).format('YYYY-MM-DD') || '无';
      },
    },
    {
      title: '编辑',
      render: (_) => {
        return (
          <div>
            <EditOutlined
              onClick={() => {
                setIsEID(_.id);
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

  const getList = () => {
    dispatch({
      type: 'tag/fetchTagList',
      payload: {
        page,
        pageSize: 10,
      },
    });
  };

  const fetchDelete = async (vals) => {
    Modal.confirm({
      title: '提示信息',
      icon: <ExclamationCircleOutlined />,
      content: '确认要删除吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const result = await deleteTag(vals);
        if (result.data.affectedRows) {
          message.success('删除成功');
          getList();
        } else {
          message.error('删除失败');
        }
      },
    });
  };

  const onFinish = async (e) => {
    let result;
    if (isEid) {
      result = await updateTag({ ...e, id: isEid });
      message.success('修改成功');
      setVisible(false);
      setIsEID(0);
      getList();
      return;
    }
    result = await createTag(e);
    if (result.data.insertId) {
      message.success('添加成功');
      setVisible(false);
      getList();
    }
  };

  return (
    <div>
      <PageHeaderWrapper title={false}>
        <Card>
          <Modal
            title="新增标签"
            visible={visible}
            onCancel={() => {
              setVisible(false);
            }}
            footer={null}
          >
            <Form onFinish={onFinish} {...layout} form={form}>
              <Form.Item
                label="主题"
                name="cate_id"
                rules={[{ required: true, message: '请填写主题' }]}
              >
                <Select placeholder="请选择主题">
                  {cate.cateList.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.cate_name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label="标签"
                name="tag_name"
                rules={[{ required: true, message: '请填写标签' }]}
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
          <Button
            type="primary"
            onClick={() => {
              setVisible(true);
            }}
          >
            + 新建标签
          </Button>
        </Card>
        <Table
          dataSource={tag.tagList}
          columns={columns}
          rowKey="id"
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
}))(Tag);
