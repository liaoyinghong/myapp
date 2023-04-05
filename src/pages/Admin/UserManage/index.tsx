import {PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable,TableDropdown} from '@ant-design/pro-components';
import {Button, Image} from 'antd';
import {useRef} from 'react';
import {searchUsers} from "@/services/ant-design-pro/api";


const columns: ProColumns<API.CurrentUser>[] = [
  {
    title: 'id',
    dataIndex: 'id',
    //valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '头像',
    dataIndex: 'avatarUrl',
    render:(_,record) => (
      <div>
      <Image src={record.avatarUrl} width={100}  />
      </div>
    ),

    copyable:true
  },
  {
    title: '用户名',
    dataIndex: 'username',
    ellipsis: true,
    tip: '标题过长会自动收缩',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
    copyable: true,
    ellipsis: true,
  },
  {
    title: '性别',
    dataIndex: 'gender',
    ellipsis: true,
    valueEnum: {
      1: {
        text: '男',
      },
      0: {
        text: '女',
      },
    }
  },
  {
    title: '电话',
    dataIndex: 'phone',
    ellipsis: true,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    ellipsis: true,
  },
  {
    title: '权限',
    dataIndex: 'userRole',
    ellipsis: true,
    valueEnum: {
      2: {
        text: '群主',
      },
      1: {
        text: '管理员',
      },
      0: {
        text: '用户',
      },
    }
  },
  {
    title: '状态',
    dataIndex: 'userStatus',
    ellipsis: true,
    valueEnum: {
      1: {
        text: '已封号',
      },
      0: {
        text: '正常',
      },
    }
  },
  {
    title: '是否删除',
    dataIndex: 'isDelete',
    ellipsis: true,
    valueEnum: {
      1: {
        text: '已删除',
      },
      0: {
        text: '否',
      },
    }
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'createTime',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true,
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        };
      },
    },
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      /*<a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,*/
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(sort, filter);
        const userList = await searchUsers();
        return {
          data: userList
        }
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {

          //listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"
      toolBarRender={() => [
        <Button key="button" icon={<PlusOutlined/>} type="primary">
          新建
        </Button>,
      ]}
    />
  );
};
