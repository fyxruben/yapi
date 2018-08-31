import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, message } from 'antd'
import axios from 'axios';

const FormItem = Form.Item;

class AddUserForm extends Component {

  static propTypes = {
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false
    };
  }

  addUser = ({email, password}) => {
    axios
      .post('/api/user/add', {
        email, password
      })
      .then(
        res => {
          if (res.data.errcode === 0) {
            message.success('添加成功');
            this.props.onSubmit();
            this.props.form.resetFields();
          } else {
            message.error(res.data.errmsg);
          }
        },
        err => {
          message.error(err.message);
        }
      );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.addUser({email: values.email, password: values.password})
      }
    });
  }

  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致啊!');
    } else {
      callback();
    }
  };

  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    };
    const { getFieldDecorator } = this.props.form;

    return <Form onSubmit={this.handleSubmit}>
      <FormItem label="Email" {...formItemLayout}>
        {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: '请输入email!',
                pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,})+$/
              }
            ]
          })(
            <Input placeholder="Email" />
          )
        }
      </FormItem>
      {/* 密码 */}
      <FormItem {...formItemLayout} label="密码">
        {getFieldDecorator('password', {
          rules: [
            {
              required: true,
              message: '请输入密码!'
            },
            {
              validator: this.checkConfirm
            }
          ]
        })(
          <Input
            type="password"
            placeholder="Password"
          />
        )}
      </FormItem>

      {/* 密码二次确认 */}
      <FormItem {...formItemLayout} label="确认密码">
        {getFieldDecorator('confirm', {
          rules: [
            {
              required: true,
              message: '请再次输入密码密码!'
            },
            {
              validator: this.checkPassword
            }
          ]
        })(
          <Input
            type="password"
            placeholder="Confirm Password"
          />
        )}
      </FormItem>
      <FormItem wrapperCol={{ span: 24, offset: 8 }}>
        <Button onClick={this.props.onCancel} style={{ marginRight: "10px" }} >取消</Button>
        <Button
          type="primary"
          htmlType="submit"
        >
          提交
        </Button>
      </FormItem>
    </Form>
  }
}

export default Form.create()(AddUserForm)