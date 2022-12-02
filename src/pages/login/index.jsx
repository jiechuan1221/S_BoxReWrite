import React from "react";
import BG from "../../utils/BG";
import styles from "./index.module.css";
import { User, Register, ServerLog } from "./components/index";
import { Tabs } from "antd";

export default function Login() {
  return (
    <div>
      <div className={styles["login-wrap"]}>
        <div className={styles["login-top"]}>S-Box Performance Analysis</div>
        <Tabs
          className={styles["login-select-form"]}
          defaultActiveKey="1"
          centered={true}
          tabBarGutter={39} 
          items={[
            {
              label: `Log In by Password`,
              key: "1",
              children: <User />,
              className: styles["login-select-form-content"],
            },
            {
              label: `Log In by Verification`,
              key: "2",
              children: <ServerLog />,
              className: styles["login-select-form-content"],
            },
            {
              label: `Register`,
              key: "3",
              children: <Register />,
              className: styles["login-select-form-content"],
            },
          ]}
        />
        <BG />
      </div>
    </div>
  );
}
