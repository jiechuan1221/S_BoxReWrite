import React, { Fragment, useEffect, useState } from "react";

// 自己组件引入
import "./index.scss";
import calDefaultData from "../../../../static/calRes.json";

export function Bic() {
  const [bic, setBic] = useState(null);
  const [bicStatus, setBicStatus] = useState(false);
  const index = calDefaultData["B&SIndex"];
  // 计算的一些结果数据
  let MinVal = 0;
  let AvgVal = 0;
  let Var = 0;

  useEffect(() => {
    const sesseionBic = JSON.parse(sessionStorage.getItem("mainPage_fileData"));
    if (sesseionBic) {
      setBic(sesseionBic.bic);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 获取计算数值Min，Avg，Var
  if (bic) {
    let calArray = [];
    if (bic !== "" && bic !== undefined) {
      //先转为一维数组
      (bic ? bic : calDefaultData.Bic).forEach((item) => {
        calArray = [...calArray, ...item];
      });
      MinVal = calArray[1];
      calArray.forEach((val) => {
        if (val === 0) {
          return;
        }
        MinVal = MinVal > val ? val : MinVal;
        AvgVal = AvgVal + val;
      });
      AvgVal = AvgVal / 56;
      calArray.forEach((val) => {
        if (val === 0) {
          return;
        }
        Var = Var + Math.pow(val - AvgVal, 2);
      });
      Var = Var / 55;
      Var = Math.sqrt(Var);
      AvgVal = AvgVal.toFixed(5);
      Var = Var.toFixed(5);
    }
  }
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
  // 右边index小方块
  const RightIndexItem = () => {
    return index[1].map((item) => {
      return (
        <div className="rightItem" key={`${item}`}>
          {item}
        </div>
      );
    });
  };
  // 获取具体小方块
  const DetailItemCol = (data) => {
    return data.data.map((item) => {
      let key = Math.random() * 10;
      return (
        <div className="detailItem" key={key} tabIndex={item}>
          {item}
        </div>
      );
    });
  };
  const DetailItem = () => {
    let key = 0;
    return (bic ? bic : calDefaultData.Bic).map((item) => {
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
      <div className="content1" id="BIC-Nonlinearity">
        <div className="top-table">
          <div className="t-square"></div>
          <div className="t-name">BIC-Nonlinearity</div>
        </div>
        <div className="bottom-table">
          {/* 左边展示具体数据表格 */}
          <div className="content-left">
            <div className="textExplain">
              1111zheg这个适用于展示Bic页面的数据
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
              <div className="cnt-rgt-res-center">
                <div className="head">Analysis of Bic</div>
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
