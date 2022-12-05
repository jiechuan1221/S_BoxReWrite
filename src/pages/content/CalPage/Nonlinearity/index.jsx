import React, { Fragment, useEffect, useState } from "react";

// 自己组件引入
import "./index.scss";
import calDefaultData from "../../../../static/calRes.json";
// import { btnClickExport } from "../../../../utils/downLoadFile";

export function Nonlinearity() { 
  const [Nlr, setNlr] = useState(null);
  const nlr = JSON.parse(sessionStorage.getItem("mainPage_fileData"));
  const index = calDefaultData["B&SIndex"];
  // 计算的一些结果数据
  let MaxVal = 0;
  let MinVal = 0;
  let AvgVal = 0;

  useEffect(() => {
    if (nlr) {
      setNlr([[...nlr.nonlinearity], ...calDefaultData.Non]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 接收到数据之后开始计算
  if (nlr) {
    let calArray = nlr.nonlinearity;
    MaxVal = calArray[0];
    MinVal = calArray[0];
    calArray.forEach((val) => {
      MaxVal = MaxVal < val ? val : MaxVal;
      MinVal = MinVal > val ? val : MinVal;
      AvgVal = AvgVal + val;
    });
    AvgVal = AvgVal / 8;
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
    return (Nlr ? Nlr : calDefaultData.Bic).map((item) => {
      key = key + 1;
      return (
        <div className="detailRow" key={key}>
          {<DetailItemCol data={item} />}
        </div>
      );
    });
  };

  // 下载文件
  // const downFile = () => {
  //   btnClickExport(JSON.parse(sessionStorage.getItem("mainPage_fileData")));
  // };

  return (
    <Fragment>
      <div className="content4" id="Nonlinearity">
        <div className="top-table">
          <div className="t-square"></div>
          <div className="t-name">Nonlinearity</div>
        </div>
        <div className="bottom-table">
          {/* 左边展示具体数据表格 */}
          <div className="content-left">
            <div className="textExplain">
              Nonlinearity is a measure to evaluate the Boolean functions in an
              S-box . Please see the following paper for more details on
              calculating nonlinearity: [1] Wang, Yong, et al. "A genetic
              algorithm for constructing bijective substitution boxes with high
              nonlinearity." Information Sciences 523 (2020): 152-166.
            </div>
            <div className="table-border">
              <div className="content-table">
                <div className="headerIndex">{<HeaderItem />}</div>

                <div className="tbl-cnt">
                  {/* <div className="rightIndex">{<RightIndexItem />}</div> */}
                  <div className="detail">{<DetailItem />}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 右边展示最大最小值等数据 */}
          <div className="content-right">
            <div className="cnt-rgt-res">
              <div className="cnt-rgt-res-center">
                <div className="head"> Nonlinearity</div>
                <div className="value">
                  <div className="top">
                    {/* 结果分析计算的值 */}
                    <div className="val-item">
                      <div className="fang">
                        <div className="center"></div>
                      </div>
                      <div className="val">Max Value : {MaxVal}</div>
                    </div>
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
