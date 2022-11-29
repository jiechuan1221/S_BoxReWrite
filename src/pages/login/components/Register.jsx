import React, { useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  FileMarkdownOutlined,
} from "@ant-design/icons";
import httpUtill from "../../../utils/httpUtil";

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const [logFlag, setLogFlag] = useState(false);
  const emailRef = useRef();
  // 按下登录按键之后
  const onFinish = (values) => {
    setLoading(true);
    delete values.rePassword;
    httpUtill.register(values).then((res) => {
      // console.log(res);
      if (res.code === "0000000009") {
        message.error("The verification code does not exist or has expired !");
      } else if (res.code === "200") {
        message.success("register Successfully ~ Go and log in ~");
        setLogFlag(true);
      } else {
        message.error(
          "There sames have something wrong with your register data ~"
        );
      }
      setLoading(false);
    });
  };

  // 获取注册验证码
  const getEmailCode = () => {
    const email = emailRef.current.input.value;
    if (!email) {
      message.warning("Please enter your email first !");
      return;
    }
    httpUtill.getServerCodeREG(email).then((res) => {
      if (res.data === true) {
        message.success("Send successfully !");
        return;
      }
      if (res.msg === "该账号已存在") {
        message.warn("The account already exists .");
      }
    });
  };

  if (logFlag) {
    return <Navigate to="/" />;
  }

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      style={{ margin: "0px" }}
    >
      {/* 姓 */}
      <Form.Item
        name="firstName"
        rules={[
          {
            required: true,
            message: "Please enter your first name.",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="First Name"
        />
      </Form.Item>

      {/* 名 */}
      <Form.Item
        name="lastName"
        rules={[
          {
            required: true,
            message: "Please enter you last name",
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Last Name"
        />
      </Form.Item>

      {/* 邮箱地址 */}
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please your email address!",
          },
          () => ({
            validator(_, value) {
              const reg = new RegExp("\\w+@\\w+(\\.\\w{2,3})*\\.\\w{2,3}");
              if (!value || reg.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Email address is illegal !"));
            },
          }),
        ]}
      >
        <Input
          id="email"
          prefix={<FileMarkdownOutlined className="site-form-item-icon" />}
          placeholder="email"
          ref={emailRef}
        />
      </Form.Item>

      {/* 组织 */}
      <Form.Item
        name="organization"
        rules={[
          {
            required: false,
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Affiliation"
        />
      </Form.Item>

      {/* 密码 */}
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please enter your password!",
          },
          () => ({
            validator(_, value) {
              const Chinese = new RegExp(
                "/[\\u4E00-\\u9FA5]|[\\uFE30-\\uFFA0]/g"
              );
              const reg = new RegExp(
                "(?!.*[\\u4E00-\\u9FA5\\s])(?!^[a-zA-Z]+$)(?!^[\\d]+$)(?!^[^a-zA-Z\\d]+$)^.{6,20}$"
              );
              if (!value || reg.test(value)) {
                return Promise.resolve();
              }
              if (Chinese.test(value) || /\s/g.test(value)) {
                return Promise.reject(
                  new Error("Cannot contain Cinese characters and spaces !")
                );
              }
              return Promise.reject(
                new Error("Your password strength is too weak.")
              );
            },
          }),
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      {/* 验证密码 */}
      <Form.Item
        name="rePassword"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The two passwords you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Confirm your password"
        />
      </Form.Item>

      {/* 邮箱验证码 */}
      <div
        style={{
          position: "relative",
        }}
      >
        <Form.Item
          name="verificationCode"
          rules={[
            {
              required: true,
              message: "Please enter your code!",
            },
          ]}
          style={{
            width: "72.3%",
          }}
        >
          <Input
            prefix={
              <SafetyCertificateOutlined className="site-form-item-icon" />
            }
            placeholder="Verification Code"
          />
        </Form.Item>
        <Button
          style={{
            width: "28%",
            height: "32px",
            position: "absolute",
            top: 0,
            right: 0,
            cursor: "pointer",
          }}
          onClick={getEmailCode}
        >
          send
        </Button>
      </div>

      {/* 注册 */}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ width: "100%", marginTop: 10 }}
          loading={loading}
        >
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};
