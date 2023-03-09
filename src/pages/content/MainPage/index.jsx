import React, { useEffect, Fragment, useState } from "react";
import { Navigate } from "react-router-dom";
import { Divider, Button, Upload, message, Spin, Space } from "antd";
import { StarOutlined, UploadOutlined } from "@ant-design/icons";
import cookies from "react-cookies";

// 自己的组件
import httpUtill from "../../../utils/httpUtil";
import "./index.scss";
import Table from "./table";
import FileList from "./fileList";
import { Nonlinearity, Sac, Bic, SOB, Lp, Dp } from "../CalPage";
import { btnClickExport } from "../../../utils/downLoadFile";
import { downModuleTxt } from "../../../utils/downModuleTxt";
import logo from "../../../static/s-box1.png";

const nvgName = [
  "Nonlinearity",
  "SAC",
  "BIC-Nonlinearity",
  "BIC-SAC",
  "DP",
  "LP",
];

export default function UploadAndShow() {
  const [File, setFile] = useState(false);
  const [resArray, setResArray] = useState([]);
  const [time, setTime] = useState(50);
  const [fileData, setFileData] = useState(null);
  const [user, setUser] = useState(null);
  // 判断文件是否计算完毕
  const [downCal, setDownCal] = useState(true);
  // 判断Lp是否进入可视区域
  const [isComming, setIsComming] = useState(false);
  // 判断是否上传了新的文件

  // 用于判断是否登录
  useEffect(() => {
    localStorage.setItem("fileList_pageId", 1);
    // 获取登录状态
    httpUtill.getRegisterStatus().then((res) => {
      if (res.data) {
        setTime(res.data.times);
        setUser(res.data.firstName + res.data.lastName);
      }
    });
  }, []);

  // 用于判断上传文件状态
  const Props = {
    onChange({ file }) {
      if (file.status !== "uploading") {
        message.success(
          "Success to add your file, this will take a chance to calculate."
        );
        // 清零当前文件的数据
        setResArray([]);
        setIsComming(false);
        setDownCal(false);

        setFile(file.originFileObj);
        const formdata = new FormData();
        formdata.append("file", file.originFileObj);
        httpUtill.getFileArray(formdata).then((res) => {
          setResArray(res.data);
          const resData = JSON.stringify(res.data);
          sessionStorage.setItem("mainPage_resArray", resData);
          sessionStorage.setItem("mainPage_listId", null);
          sessionStorage.setItem("mainPage_fileName", "Current file");
          // 用于更改上传计算次数
          httpUtill.getRegisterStatus().then((res) => {
            if (res.data) {
              setTime(res.data.times);
            }
          });
          setDownCal(true);
          sessionStorage.removeItem("mainPage_fileData");
        });
      }
    },
  };

  // 点击计算单个文件结果
  const Calculate = () => {
    if (!File) {
      message.warn(
        "You currently do not have any files that can be calculated"
      );
      return;
    }
    setIsComming(false);
    setDownCal(false);
    const data = resArray;
    message.loading(
      "Start to get the calculate result, please wait a minute ~"
    );
    // 获取单次计算结果
    httpUtill.getSingleRes({ data: data }).then((res) => {
      const data = JSON.stringify(res.data);
      sessionStorage.setItem("mainPage_fileData", data);
      setFileData(res.data);
      message.success("Successfully to get the calculate result ~");
      // 设置计算状态为true
      setDownCal(true);
      // 跳转到第一个详情页
      const anchorElement = document.getElementById("detail");
      if (anchorElement) {
        anchorElement.scrollIntoView({ behavior: "smooth" });
      }
    });
    setFile(null);
  };

  // 用于控制用户退出登录的函数
  const forExit = () => {
    httpUtill.checkLogout();
  };

  // 下载计算结果
  const downResFile = () => {
    btnClickExport(JSON.parse(sessionStorage.getItem("mainPage_fileData")));
  };

  // 滚动监听，判断Lp是否进入可视区域
  const scroll = () => {
    const ele = document.getElementById("LpItem");
    if (!ele || isComming) {
      return;
    }
    const documentclientHeight = document.getElementById("ctn").clientHeight; //元素顶端到可见区域(网页）顶端的距离
    const htmlElementclientTop = document
      .getElementById("LpItem")
      .getBoundingClientRect().top; //网页指定元素进入可视区域
    if (documentclientHeight >= htmlElementclientTop - 85) {
      //TODo执行你要做的操作
      if (sessionStorage.getItem("mainPage_fileData")) {
        message.loading(
          "The Lp Component is a little bit large, please wait a minute."
        );
      }

      setIsComming(true);
      return;
    }
  };

  // 去到对应位置
  const GoRightWay = (name) => {
    // 跳转到第一个详情页
    const anchorElement = document.getElementById(name);
    if (anchorElement) {
      anchorElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 如果未登录跳转至登录界面
  if (!cookies.load("token")) {
    return <Navigate to="/Login" />;
  }

  return (
    <Fragment>
      <div className="uploadShow">
        {/* 展示名称，跳转登录和退出登录 */}
        <div className="header">
          <div className="h-left">
            <div
              className="showName"
              onClick={GoRightWay.bind(null, "content")}
            >
              <img src={logo} alt="S-Box" className="Img" />
              <span>S-Box Performance Analysis</span>
            </div>
            <div className="Exit">
              <div className="login">
                <span>{user ? user : "welcom"}</span>
              </div>
              |
              <div className="eText">
                <Button type="text" onClick={forExit}>
                  Exit
                </Button>
              </div>
            </div>
          </div>
          <div className="h-right">
            {nvgName.map((item) => {
              if (item === "LP") {
                return (
                  <div
                    className="item"
                    key={item}
                    onClick={GoRightWay.bind(null, "LpItem")}
                  >
                    {item}
                  </div>
                );
              }
              return (
                <div
                  className="item"
                  key={item}
                  onClick={GoRightWay.bind(null, item)}
                >
                  {item}
                </div>
              );
            })}
          </div>
        </div>

        <div className="content" id="ctn" onScroll={scroll}>
          {/* 控件和标题 */}
          <div className="control" id="content">
            <div className="title">
              <span>
                Here, we only provide the evaluation service for 8*8 S-Box.
                Please click &nbsp;“Upload S-Box”&nbsp; button to choose your
                S-Box, then click &nbsp;“Calculate”&nbsp; Button to get the
                corresponding evaluation results. Please note the uploaded S-Box
                must conform to our format. Click&nbsp;&nbsp;
                <span onClick={downModuleTxt} className="down">
                  HERE
                </span>
                &nbsp;&nbsp; to download the format template, which is an
                example of AES S-Box.
              </span>
            </div>
            <div className="controlElement">
              <div className="cle-left">
                <Upload
                  {...Props}
                  className="scan-import1"
                  maxCount={1}
                  showUploadList={false}
                >
                  {/* 上传文件按钮 */}
                  {File ? (
                    <Button
                      icon={<StarOutlined />}
                      block
                      className="cle-left-btn1"
                    >
                      Upload S-Box Sucess
                    </Button>
                  ) : (
                    <Button
                      icon={<UploadOutlined />}
                      block
                      className="cle-left-btn"
                    >
                      Upload S-Box
                    </Button>
                  )}
                </Upload>

                {/* 开始计算按钮 */}
                <div className="scan-import2">
                  {fileData ? (
                    <Button
                      type="primary"
                      className="cle-left-btn"
                      onClick={Calculate}
                    >
                      Calculate
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      className="cle-left-btn"
                      onClick={Calculate}
                    >
                      Calculate
                    </Button>
                  )}
                </div>
              </div>

              {/* 右边的下载计算结果按钮 */}
              <div className="cle-right">
                <div className="scan-import3">
                  <Button className="cle-left-btn" onClick={downResFile}>
                    Download Results
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          {/* 展示表格 */}
          <div className="c-bottom">
            <div className="content-left">{<Table data={resArray} />}</div>
            <div className="content-right">
              {
                <FileList
                  setResArray={setResArray}
                  time={time}
                  setDownCal={setDownCal}
                  setIsComming={setIsComming}
                />
              }
            </div>
          </div>

          {/* 具体计算页面 */}
          <div id="detail">
            {downCal ? (
              <Fragment>
                <Nonlinearity />
                <Sac />
                <Bic />
                <SOB />
                <Dp />
                <div id="LpItem">{isComming ? <Lp /> : "&nbsp;"}</div>
              </Fragment>
            ) : (
              <div className="detail-table">
                Loding
                <Space size="middle">
                  <Spin size="large" className="icon" />
                </Space>
              </div>
            )}
          </div>

          {/* 底部说明文字 */}
          <div className="true-bottom">
            <div className="b-top">About us: </div>
            <div className="b-bottom">
              This is a free online tool for evaluating 8 * 8 S-Box, which is
              designed by Dr. Yong Wang, Chongqing University of Posts and
              Telecommunications, Chongqing, 400065, China. Some postgraduates
              and undergraduates joined in the development of this Tool. They
              are Mr. Peng Lei, Ms. Mingyue Wang, Mr. Cong Lu and Ms. Xingyue
              Xu. We hope this tool can bring you convenience to research S-Box.
              If you have any problem when using it, feel free to contact
              me,&nbsp;
              <span className="email">wangyong1@cqupt.edu.cn</span> , or &nbsp;
              <span className="email">wangyong_cqupt@163.com</span>.
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
