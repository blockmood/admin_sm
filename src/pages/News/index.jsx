import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Table, Button, Modal, Form, Input, message, Radio, Select, Upload } from 'antd';
import { connect } from 'dva';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getNewsList, createNews, updateNews, deleteNews } from './service';

const { Option } = Select;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

const wrapperLayout = {
  labelCol: { span: 0 },
  wrapperCol: { span: 21 },
};

const News = (props) => {
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState('');
  const [form] = Form.useForm();
  const [updateData, setUpdateData] = useState({});
  const [cateId, setCateId] = useState(0);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);

  const {
    dispatch,
    mapStateProps: { cate },
  } = props;

  const options = ['是', '否'];
  const hots = ['是', '否'];

  form.setFieldsValue({
    is_recommend: '否',
    is_hot: '否',
  });

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: '主题',
      dataIndex: 'cate_name',
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '副内容',
      width: 200,
      dataIndex: 'sub_content',
      render: (_) => {
        return <span>{_?.substr(0, 30)}</span>;
      },
    },
    {
      title: '图片',
      dataIndex: 'cover_img',
    },
    {
      title: '是否推荐',
      dataIndex: 'is_recommend',
      render: (_) => {
        return <div>{_ ? '是' : '否'}</div>;
      },
    },
    {
      title: '热门',
      dataIndex: 'is_hot',
      render: (_) => {
        return <div>{_ ? '是' : '否'}</div>;
      },
    },
    {
      title: '编辑',
      render: (_) => {
        return (
          <div>
            <EditOutlined
              onClick={() => {
                cate.cateList.map((item) => {
                  if (item.cate_name == _.cate_name) {
                    setCateId(item.id);
                  }
                });
                setUpdateData(_);
                setContent(_.content);
                setVisible(true);
                form.setFieldsValue({
                  ..._,
                  is_recommend: _.is_recommend == 1 ? '是' : '否',
                  is_hot: _.is_hot == 1 ? '是' : '否',
                });
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

    fetchNewsList();
  }, [page]);

  const fetchNewsList = async () => {
    const result = await getNewsList({
      page,
      pageSize: 10,
    });
    setTotal(result.total);
    setData(result.data);
  };

  const fetchDelete = async (vals) => {
    Modal.confirm({
      title: '提示信息',
      icon: <ExclamationCircleOutlined />,
      content: '确认要删除吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const result = await deleteNews(vals);
        if (result.data.affectedRows) {
          message.success('删除成功');
          fetchNewsList();
        } else {
          message.error('删除失败');
        }
      },
    });
  };

  const onFinish = async (e) => {
    let result;
    if (updateData?.id) {
      result = await updateNews({
        ...updateData,
        cate_id: cateId,
        is_recommend: e.is_recommend == '是' ? 1 : 0,
        is_hot: e.is_hot == '是' ? 1 : 0,
        cover_img: e.cover_img,
        content,
      });
    } else {
      result = await createNews({
        ...e,
        is_recommend: e.is_recommend == '是' ? 1 : 0,
        is_hot: e.is_hot == '是' ? 1 : 0,
        content,
      });
    }

    if (result.status == 200) {
      message.success('保存成功');
      fetchNewsList();
      setVisible(false);
      form.resetFields();
    } else {
      message.error('保存失败');
    }
  };

  return (
    <div>
      <PageHeaderWrapper title={false}>
        <Modal
          title="新增新闻"
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
              rules={[{ required: true, message: '请选择主题' }]}
            >
              <Select placeholder="请选择主题" allowClear>
                {cate.cateList.map((item, index) => {
                  return <Option value={item.id}>{item.cate_name}</Option>;
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="标题"
              name="title"
              rules={[{ required: true, message: '请填写标题' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="简介"
              name="sub_content"
              rules={[{ required: true, message: '请填写简介' }]}
            >
              <TextArea />
            </Form.Item>
            <Form.Item label="缩略图" name="cover_img">
              <Input style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="内容"
              name="content"
              rules={[{ required: true, message: '请填写内容' }]}
              {...wrapperLayout}
            >
              <CKEditor
                editor={ClassicEditor}
                data={content}
                onInit={(editor) => {
                  const data = editor.getData();
                  setContent(data);
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setContent(data);
                }}
              />
            </Form.Item>
            <Form.Item
              label="推荐"
              name="is_recommend"
              rules={[{ required: true, message: '请选择选项' }]}
            >
              <Radio.Group>
                {options.map((item, index) => {
                  return (
                    <Radio key={index} value={item}>
                      {item}
                    </Radio>
                  );
                })}
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="热门"
              name="is_hot"
              rules={[{ required: true, message: '请选择选项' }]}
            >
              <Radio.Group>
                {hots.map((item, index) => {
                  return (
                    <Radio key={index} value={item}>
                      {item}
                    </Radio>
                  );
                })}
              </Radio.Group>
            </Form.Item>
            <Form.Item>
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
              form.resetFields();
            }}
          >
            + 新增新闻
          </Button>
        </Card>
        <Table rowKey="id" dataSource={data} columns={columns} />
      </PageHeaderWrapper>
    </div>
  );
};

export default connect((mapStateProps) => ({
  mapStateProps,
}))(News);
