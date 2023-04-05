import Footer from '@/components/Footer';
import {Register} from '@/services/ant-design-pro/api';
import {LockOutlined, UserOutlined,} from '@ant-design/icons';
import {LoginForm, ProFormText,} from '@ant-design/pro-components';
import {message, Tabs} from 'antd';
import React, {useState} from 'react';
import {history, SelectLang, useModel} from 'umi';
import styles from './index.less';
import {PLANET_LINK, SYSTEM_LOGO} from '@/constants';

const register: React.FC = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [type, setType] = useState<string>('account');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: API.RegisterParams) => {
    const {userPassword,checkPassword} = values;
    //效验密码
    if (userPassword !== checkPassword){
      message.error('两次密码不相同');
      return;
    }
    try {
      // 注册
      const id = await Register({ ...values});
      if (id) {
        const defaultLoginSuccessMessage = '注册成功！';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push('/user/login?redirect=' + redirect);
        return;
      }
    } catch (error: any) {
      const defaultLoginFailureMessage = "注册失败,请重试!";
      message.error(error.message ?? defaultLoginFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang}>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          submitter={{
            searchConfig: {
              submitText: '注册'
            }
          }}
          logo={<img alt="logo" src={SYSTEM_LOGO} />}
          title="注册入口"
          subTitle={<a href={PLANET_LINK}> 强大的疯批用户中心</a>}
          initialValues={{
            autoLogin: true,
          }}

          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab='账户密码注册'
            />
          </Tabs>


          {type === 'account' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder='请输入账号'
                rules={[
                  {
                    required: true,
                    message: '账号是必填项!'
                  },
                  {
                    min:4,
                    max:12,
                    type:'string',
                    message:'账号不能小于4,大于12',
                  }
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder='请输入8-16位密码'
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                  {
                    min:8,
                    max:16,
                    type:'string',
                    message:'密码不能小于8,大于16',
                  }
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder='请输入8-16位密码'
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                  {
                    min:8,
                    max:16,
                    type:'string',
                    message:'两次密码不相同',
                  }
                ]}
              />
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default register;
