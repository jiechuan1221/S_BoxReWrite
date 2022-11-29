import React, { Fragment, useEffect, useState, Suspense, lazy } from "react";

// 自己组件引入
import "./index.scss";
import calDefaultData from "../../../../static/calRes.json";
import RowItem from "./RowItem";

export function Lp(props) {
  const isComming = props.isComming;
  const [lp, setLp] = useState(null);
  const index = calDefaultData["LpIndex"];
  // 计算的一些结果数据
  let MaxVal = 0;
  let MaxCount = 0;

  useEffect(() => {
    const sessionLp = JSON.parse(sessionStorage.getItem("mainPage_fileData"));
    if (sessionLp) {
      setLp(sessionLp.lp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 接收到数据之后开始计算
  if (lp) {
    let calArray = [];
    if (lp !== "" && lp !== undefined) {
      //先转为一维数组
      (lp ? lp : calDefaultData.Bic).forEach((item) => {
        calArray = [...calArray, ...item];
      });
      MaxVal = calArray[2];
      calArray.forEach((val) => {
        MaxVal = MaxVal < val ? val : MaxVal;
      });
      MaxCount = Math.abs(MaxVal / 256.0 - 0.5);
    }
  }
  //   生成头部的小方块
  const HeadItem = () => {
    return index[0].map((item) => {
      let bgc = "";
      if (item === 0) {
        bgc = "rgb(61, 61, 90)";
      }
      return (
        <div className="head-item" key={item} style={{ backgroundColor: bgc }}>
          {item}
        </div>
      );
    });
  };
  //   生成表格左边的坐标
  const ContentIndexItem = () => {
    return index[1].map((item) => {
      return (
        <div className="tab-con-indexItem" key={item}>
          {item}
        </div>
      );
    });
  };

  return (
    <Fragment>
      <div className="content3" id="LP">
        <div className="top-table">
          <div className="t-square"></div>
          <div className="t-name">LP</div>
        </div>
        <div className="bottom-table">
          {/* 左边展示具体数据表格 */}
          <div className="content-left">
            <div className="textExplain">
              The linear approximation probability (LP) is used to measure the
              resistance of an S-box to the linear attack. It measures the
              maximum value of the imbalance of an event by comparing the parity
              of the inputs bits indexed by the mask Tx and the parity of the
              output bits indexed by the mask Ty .
            </div>
            <div className="content-table">
              <div className="table-box">
                <div className="table-header">
                  <HeadItem />
                </div>
                <div className="table-content">
                  <div className="tab-con-index">{<ContentIndexItem />}</div>
                  <div className="tab-con-content">
                    <RowItem />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右边展示最大最小值等数据 */}
          <div className="content-right">
            <div className="cnt-rgt-res">
              <div className="cnt-rgt-res-center">
                <div className="head">Analysis of Lp</div>
                <div className="value">
                  <div className="top">
                    {/* 结果分析计算的值 */}
                    <div className="val-item">
                      <div className="fang">
                        <div className="center"></div>
                      </div>
                      <div className="val">Max Count : {MaxVal}</div>
                    </div>
                    <div className="val-item">
                      <div className="fang">
                        <div className="center"></div>
                      </div>
                      <div className="val">Max Value : {MaxCount}</div>
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
