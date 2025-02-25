import { Button, Checkbox, Form, Input, FormProps, App } from 'antd';
import { login } from '../interfaces';
import { useNavigate } from 'react-router';

type FieldType = {
  username?: string;
  password?: string;
  remember?: boolean;
};

export function Login() {
  const { message } = App.useApp();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      await login(values.username!, values.password!);
      message.success('登录成功');
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
    } catch (error) {
      console.log(error);
      message.error('登录失败');
    }
  };
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo,
  ) => {
    console.log('Failed:', errorInfo);
    message.error('登录失败');
  };
  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 400, margin: '200px auto' }}
      initialValues={{ remember: true }}
      autoComplete="off"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item<FieldType>
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: '请输入用户名',
          },
        ]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item<FieldType>
        name="password"
        label="密码"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input placeholder="请输入密码" />
      </Form.Item>
      <Form.Item<FieldType>
        name="remember"
        valuePropName="checked"
        label={null}
      >
        <Checkbox>记住密码</Checkbox>
      </Form.Item>
      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
  );
}
