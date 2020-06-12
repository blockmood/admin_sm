import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Table, Button, Modal, Form, Input, message, Radio, Select, Upload } from 'antd';
import { connect } from 'dva';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getNewsList, createNews, updateNews, deleteNews, uploadToken } from './service';

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

const uploadLayout = {
  wrapperCol: { offset: 3 },
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
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [recommend, setRecommend] = useState('否');
  const [hot, setHot] = useState('否');

  const {
    dispatch,
    mapStateProps: { cate, tag },
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
      title: '标签',
      dataIndex: 'tag_id',
      render: (_) => {
        let name;
        tag.tagList.map((item) => {
          if (item.id == _) {
            name = item.tag_name;
          }
        });
        return name;
      },
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
      render: (_) => {
        if (_.indexOf(',') != -1) {
          return _.split(',').map((item) => {
            return (
              <a href={item} target="_blank" style={{ display: 'block', marginTop: 5 }}>
                <img src={item} style={{ width: 50 }} />
              </a>
            );
          });
        }
        return (
          <a href={_} target="_blank">
            <img src={_} style={{ width: 50 }} />
          </a>
        );
      },
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
                form.setFieldsValue(_);
                setUpdateData(_);
                setContent(_.content);
                setVisible(true);
                setRecommend(_.is_recommend == 1 ? '是' : '否');
                setHot(_.is_hot == 1 ? '是' : '否');
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

    if (!tag.tagList.length) {
      dispatch({
        type: 'tag/fetchTagList',
        payload: {
          page,
          pageSize: 10,
        },
      });
    }

    fetchNewsList();
  }, [page]);

  useEffect(() => {
    fetchToken();
  }, []);

  const fetchNewsList = async () => {
    const result = await getNewsList({
      page,
      pageSize: 10,
    });
    setTotal(result.total);
    setData(result.data);
  };

  const fetchToken = async () => {
    const result = await uploadToken();
    setToken(result.token);
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
        tag_id: e.tag_id,
        cate_id: cateId,
        is_recommend: recommend == '是' ? 1 : 0,
        is_hot: hot == '是' ? 1 : 0,
        cover_img: e.cover_img,
        content,
      });
    } else {
      result = await createNews({
        ...e,
        is_recommend: recommend == '是' ? 1 : 0,
        is_hot: hot == '是' ? 1 : 0,
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

  const uploadProps = {
    name: 'file',
    action: 'http://up-z2.qiniup.com',
    data: {
      fileName: name,
      token,
    },
    beforeUpload: (info) => {
      setName(info.name);
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        const imgUrl = info.fileList.map((item) => {
          return `http://img.yswfw.cn/${item.response?.key}`;
        });
        form.setFieldsValue({
          cover_img: imgUrl.toString(),
        });
      }
      if (info.file.status === 'done') {
      } else if (info.file.status === 'error') {
      }
    },
  };

  return (
    <div>
      <PageHeaderWrapper title={false}>
        <Modal
          title="新增新闻"
          visible={visible}
          onCancel={() => {
            form.resetFields();
            setVisible(false);
            setContent('');
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
              label="标签"
              name="tag_id"
              rules={[{ required: true, message: '请选择标签' }]}
            >
              <Select placeholder="请选择标签" allowClear>
                {tag.tagList.map((item, index) => {
                  return <Option value={item.id}>{item.tag_name}</Option>;
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
            <Form.Item label="封面图" name="cover_img">
              <Input style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item {...uploadLayout}>
              <Upload {...uploadProps} multiple>
                <Button type="primary">上传</Button>
              </Upload>
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
            <Form.Item label="推荐" rules={[{ required: true, message: '请选择选项' }]}>
              <Radio.Group
                options={['是', '否']}
                onChange={(e) => {
                  setRecommend(e.target.value);
                }}
                value={recommend}
              />
            </Form.Item>
            <Form.Item label="热门" rules={[{ required: true, message: '请选择选项' }]}>
              <Radio.Group
                options={['是', '否']}
                onChange={(e) => {
                  setHot(e.target.value);
                }}
                value={hot}
              />
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
