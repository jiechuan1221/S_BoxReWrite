import React, { Fragment, useEffect, useState } from "react";

// 自己组件引入
import "./index.scss";
import calDefaultData from "../../../../static/calRes.json";

export function SOB() {
  const [SOB, setSOB] = useState(null);
  const [SOBStatus, setSobStatus] = useState(false);
  const index = calDefaultData["B&SIndex"];
  // 计算的一些结果数据
  let MinVal = 0;
  let AvgVal = 0;
  let Var = 0;

  useEffect(() => {
    const sessionSOB = JSON.parse(sessionStorage.getItem("mainPage_fileData"));
    if (sessionSOB) {
      setSOB(sessionSOB.sac_OF_BIC);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 头部小方块
  const HeaderItem = () => {
    return index[0].map((item) => {
      return (
        <div className="headerItem" key={`${item}`}>
          {item}
        </div>
      );
    });
  };

  // 获取具体小方块
  const DetailItemCol = (data) => {
    return data.data.map((item) => {
      let key = Math.random() * 10;
      let value = 0;
      if (item !== " ") {
        value = item.toFixed(6);
      } else {
        value = item;
      }
      return (
        <div className="detailItem" key={key} tabIndex={item}>
          {value}
        </div>
      );
    });
  };
  const DetailItem = () => {
    let key = 0;
    return (SOB ? SOB : calDefaultData.Bic).map((item) => {
      key = key + 1;
      return (
        <div className="detailRow" key={key}>
          {<DetailItemCol data={item} />}
        </div>
      );
    });
  };

  return (
    <Fragment>
      <div className="content6" id="BIC-SAC">
        <div className="top-table">
          <div className="t-square"></div>
          <div className="t-name">BIC-SAC</div>
        </div>
        <div className="bottom-table">
          {/* 左边展示具体数据表格 */}
          <div className="content-left">
            <div className="textExplain">
              1111zheg这个适用于展示SOB页面的数据
            </div>
            <div className="table-border">
              <div className="content-table">
                <div className="headerIndex">{<HeaderItem />}</div>

                <div className="tbl-cnt">
                  <div className="detail">{<DetailItem />}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 右边展示最大最小值等数据 */}
          <div className="content-right">
            <div className="cnt-rgt-res">
              {/* 调用这个函数计算最小值，平均值和方差 */}
              <div className="cnt-rgt-res-center">
                <div className="head">Analysis of Sac_of_bic</div>
                <div className="value">
                  <div className="top">
                    <div className="val-item">
                      <div className="fang">
                        <div className="center"></div>
                      </div>
                      <div className="val">Min Value : {MinVal}</div>
                    </div>
                    <div className="val-item">
                      <div className="fang">
                        <div className="center"></div>
                      </div>
                      <div className="val">Average : {AvgVal}</div>
                    </div>
                    <div className="val-item">
                      <div className="fang">
                        <div className="center"></div>
                      </div>
                      <div className="val">Variance : {Var}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
