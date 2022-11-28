import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// 登录注册
import Login from "./login";
// 找回密码
import Find from "./login/components/findPassword";
// 计算以及上传文件页面
import Show from "./content/MainPage";

export default function Main() {
  return (
    <Routes>
      {/* 上传文件 */}
      <Route path="/MainPage/Show/*" element={<Show />} />
      {/* 找回密码 */}
      <Route path="/Login/find" element={<Find />} />
      {/* 登录注册 */}
      <Route path="/Login/*" element={<Login />} />
      <Route path="/" element={<Navigate to="/Login" />} />;
      <Route path="*" element={<Navigate to="/Login" />} />
    </Routes>
  );
}
