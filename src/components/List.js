import React, { useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Button } from 'antd';
import Item from '../components/Item';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const List = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(Item.dataSource);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
        id: '',
        username: '',
        fullname: '',
        age: '',
        address: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const handleDelete = (key) => {
    const dataSource =[...data]
    setData(dataSource.filter((item) => item.key !== key))
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
        title: 'UserID',
        dataIndex: 'id',
        editable: true,
      },
      {
        title: 'UserName',
        dataIndex: 'username',
        editable: true,
      },
      {
        title: 'FuLL Name',
        dataIndex: 'fullname',
        editable: true,
      },
      {
        title: 'age',
        dataIndex: 'age',
        editable: true,
      },
      {
        title: 'address',
        dataIndex: 'address',
        editable: true,
      },
    {
      title: 'Operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Button>
              <Button  onClick={cancel}>Cancel</Button>
          </span>
        ) : (
            <span>
           <Button  style={{
                marginRight: 8,
              }}onClick={() => edit(record)}>
            Edit
         </Button>
         <Popconfirm title="Sure to Delete?" onConfirm={() => handleDelete(record.key)}>
          <Button>Delete</Button>
          </Popconfirm>
          </span>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
      />
    </Form>
  );
};

export default List