import React, { useEffect, useState } from "react";
import { List, Button, Popconfirm, message } from "antd";
import { DeleteOutlined, QuestionCircleOutlined } from "@ant-design/icons";

import httpUtill from "../../../utils/httpUtil";

export default function FileList(props) {
  const setResArray = props.setResArray;
  const setDownCal = props.setDownCal;
  const setIsComming = props.setIsComming;
  const [totalPage, setTotalPage] = useState(5);
  const [fileData, setFileData] = useState(null);
  const [curPage, setCurPage] = useState(1);
  // 获取缓存在本地的文件列表数据
  const time = props.time;

  // 用于获取文件列表第一页
  useEffect(() => {
    const page = parseInt(localStorage.getItem("fileList_pageId"));
    if (page) {
      setCurPage(page);
    }
    // 如果当前有进行计算的文件，则保留其文件内数据，并且展示出来
    const resArray = sessionStorage.getItem("mainPage_resArray");
    if (resArray) {
      const data = JSON.parse(resArray);
      setResArray(data);
    }
    const pageId = localStorage.getItem("fileList_pageId") || 1;
    httpUtill.getFileList(pageId, 5).then((res) => {
      setTotalPage(res.data.total);
      setFileData(res.data.records);
    });
  }, [time]);

  // 获取指定页的文件
  const getCurrentPage = (page) => {
    setFileData(null);
    localStorage.setItem("fileList_pageId", page);
    setCurPage(page);
    httpUtill.getFileList(page, 5).then((res) => {
      setTotalPage(res.data.total);
      setFileData(res.data.records);
    });
  };
  // 删除指定的文件
  const onConfirm = (item) => {
    const calFileId = sessionStorage.getItem("mainPage_listId");
    if (JSON.stringify(item.id) === calFileId) {
      message.warn(
        "The current file is being calculated and cannot be deleted !"
      );
      return;
    }
    const pageId = localStorage.getItem("fileList_pageId");
    httpUtill.deleteSingleFileData(item.id).then((res) => {
      if (res.data) {
        httpUtill
          .getFileList(pageId, 5)
          .then((res) => {
            setFileData(res.data.records);
            setTotalPage(res.data.total);
            // 如果删除的是本次列表的最后一条数据
            if (res.data.records.length === 0) {
              localStorage.setItem("fileList_pageId", pageId - 1);
              httpUtill.getFileList(pageId - 1, 5).then((res) => {
                setFileData(res.data.records);
              });
            }
          })
          .finally(() => {
            message.success("Success to delete the file ~");
          });
      } else {
        message.error(
          "The file does not exist or has been deleted, please refresh to check !"
        );
      }
    });
  };
  // 用于更改全局变量mainPage_fileData, 文件的计算结果保存
  const sendFileData = (item) => {
    // 无论计算的是不是正在计算的文件，跳转到第一个详情页
    const anchorElement = document.getElementById("detail");
    if (anchorElement) {
      anchorElement.scrollIntoView({ behavior: "smooth" });
    }

    // 如果进行新的计算的文件和上一次计算的文件相同，则直接使用之前的数据
    if (item.id === parseInt(sessionStorage.getItem("mainPage_listId"))) {
      if (sessionStorage.getItem("mainPage_fileData") !== "null") {
        return;
      }
    }
    // 清零计算状态
    setDownCal(false);
    // 新的计算设置Lp组件未进入视图区域
    setIsComming(false);
    setResArray(item.data);

    // 保存获取到的这个文件本身的数据、文件的计算数据、文件的id号，用于进行特殊标识、保存文件名
    const resData = JSON.stringify(item.data);
    sessionStorage.setItem("mainPage_resArray", resData);
    sessionStorage.setItem("mainPage_fileData", null);
    sessionStorage.setItem("mainPage_listId", item.id);
    sessionStorage.setItem("mainPage_fileName", item.name);

    httpUtill
      .getSingleFileRes(item.id)
      .then((res) => {
        const data = JSON.stringify(res.data.singleTest);
        sessionStorage.setItem("mainPage_fileData", data);
      })
      .finally(() => {
        setDownCal(true);
      });
  };

  return (
    <div className="ctn-right-center">
      <div className="list-top">Uploaded file list</div>
      <List
        className="list-show"
        size="large"
        bordered
        dataSource={fileData ? fileData : ""}
        loading={fileData ? false : true}
        pagination={{
          simple: true,
          current: curPage,
          pageSize: 5,
          total: totalPage,
          onChange: getCurrentPage,
        }}
        renderItem={(item) => {
          // 通过记录下来的id号标识正在计算的文件，并对当前文件进行标识
          let color = "";
          let color1 = "";
          let color2 = "";
          let color3 = "";
          const id = sessionStorage.getItem("mainPage_listId");
          if (parseInt(id) === item.id) {
            color = "rgba(243, 174, 0, 0.6)";
            color1 = "#009d00";
            color2 = "#295c82";
          }
          return (
            <List.Item className="list-item" style={{ backgroundColor: color }}>
              <div className="fileName">
                <div className="Span" title={item.name}>
                  {item.name}
                </div>
              </div>
              <div className="file-btn">
                <div className="showData">
                  <Button
                    type="text"
                    block
                    onClick={() => {
                      setIsComming(false);
                      setResArray([]);
                      setTimeout(() => {
                        setResArray(item.data);
                      }, 0);
                    }}
                    style={{ color: color3 }}
                  >
                    <span style={{ color: color1 }}>show</span>
                  </Button>
                </div>
                <div className="showRes">
                  <Button type="text" onClick={sendFileData.bind(null, item)}>
                    <span style={{ color: color2 }}>calculate</span>
                  </Button>
                </div>
                <div className="delete">
                  <Popconfirm
                    title="Are you sure ?"
                    placement="left"
                    onConfirm={onConfirm.bind(null, item)}
                    icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  >
                    <Button type="text" block>
                      <DeleteOutlined style={{ color: color3 }} />
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </List.Item>
          );
        }}
      />
      <div className="list-bottom">
        You have {time} calculation opportunities.
      </div>
    </div>
  );
}
