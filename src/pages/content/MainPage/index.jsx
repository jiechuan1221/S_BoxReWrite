import React, { useEffect, Fragment, useState } from "react";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
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
  // 判断文件是否计算完毕
  const [downCal, setDownCal] = useState(true);
  // 判断Lp是否进入可视区域
  const [isComming, setIsComming] = useState(false);
  // 判断是否上传了新的文件

  // 用于判断是否登录
  useEffect(() => {
    // 获取登录状态
    httpUtill.getRegisterStatus().then((res) => {
      if (res.data) {
        setTime(res.data.times);
      }
    });
  }, []);

  // 用于判断上传文件状态
  const Props = {
    onChange({ file }) {
      if (file.status !== "uploading") {
        message.success("success to add your file");
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
          const data = res.data;
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
        });
      }
    },
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
    if (documentclientHeight >= htmlElementclientTop - 60) {
      //TODo执行你要做的操作
      message.loading(
        "The Lp Component is a little bit large, please wait a minute."
      );
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
              S-Box Performance Analysis
            </div>
            <div className="Exit">
              <div className="login">
                <Link to="/Login">Login</Link>
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
            <div className="title"></div>
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
                      className="cle-left-btn"
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

                {/* 开始计算按钮
                <div className="scan-import2">
                  {fileData ? (
                    <Button
                      type="primary"
                      className="cle-left-btn"
                      onClick={Calculate}
                    >
                      Show evaluation results
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      className="cle-left-btn"
                      onClick={Calculate}
                    >
                      Show evaluation results
                    </Button>
                  )}
                </div> */}
              </div>

              {/* 右边的两个下载按钮 */}
              <div className="cle-right">
                <div className="scan-import3">
                  <Button className="cle-left-btn" onClick={downModuleTxt}>
                    Download Module File
                  </Button>
                </div>
                <div className="scan-import4">
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
                <div id="LpItem">{isComming ? <Lp /> : ""}</div>
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
        </div>
      </div>
    </Fragment>
  );
}
