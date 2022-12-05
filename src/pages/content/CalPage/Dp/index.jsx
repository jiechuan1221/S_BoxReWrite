import React, { Fragment, useEffect, useState } from "react";

// 自己组件引入
import "./index.scss";
import calDefaultData from "../../../../static/calRes.json";

export function Dp() {
  const DefArray = calDefaultData["Dp"];
  const [dp, setDp] = useState(null);
  const index = calDefaultData["DpIndex"];
  // 计算的一些结果数据
  let MaxVal = 0;

  useEffect(() => {
    const sessionDp = JSON.parse(sessionStorage.getItem("mainPage_fileData"));
    if (sessionDp) {
      setDp(sessionDp.dp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (dp) {
    let calArray = [];
    if (dp !== "" && dp !== undefined) {
      //先转为一维数组
      (dp ? dp : calDefaultData.Bic).forEach((item) => {
        calArray = [...calArray, ...item];
      });
      MaxVal = calArray[0];
      calArray.forEach((val) => {
        MaxVal = MaxVal < val ? val : MaxVal;
      });
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

  //   生成表格具体内容
  const RowItemCol = ({ data }) => {
    let key = 0;
    return data.map((item) => {
      key = key + 1;
      return (
        <div className="row-item-col" tabIndex={item} key={key}>
          {item}
        </div>
      );
    });
  };
  const RowItem = () => {
    let key = 0;
    return (dp ? dp : DefArray).map((item) => {
      key = key + 1;
      return (
        <div className="tab-row-item" key={key}>
          {<RowItemCol data={item} />}
        </div>
      );
    });
  };

  return (
    <Fragment>
      <div className="content2" id="DP">
        <div className="top-table">
          <div className="t-square"></div>
          <div className="t-name">DP</div>
        </div>
        <div className="bottom-table">
          {/* 左边展示具体数据表格 */}
          <div className="content-left">
            <div className="textExplain">
              Differential uniformity is another desirable property of an S-box
              and it is introduced to measure the resistance of an Sbox with
              respect to differential cryptoanalysis attack. We commonly use the
              differential approximation probability (DP) to measure the
              input/output XOR distribution and evaluate the differential
              uniformity of an S-box.
            </div>
            <div className="content-table">
              <div className="table-header">
                <HeadItem />
              </div>
              <div className="table-content">
                <div className="tab-con-content">{<RowItem />}</div>
              </div>
            </div>
          </div>

          {/* 右边展示最大最小值等数据 */}
          <div className="content-right">
            <div className="cnt-rgt-res">
              <div className="cnt-rgt-res-center">
                <div className="head">DP</div>
                <div className="value">
                  <div className="top">
                    {/* 结果分析计算的值 */}
                    <div className="val-item">
                      <div className="fang">
                        <div className="center"></div>
                      </div>
                      <div className="val">Max Value : {MaxVal}</div>
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
