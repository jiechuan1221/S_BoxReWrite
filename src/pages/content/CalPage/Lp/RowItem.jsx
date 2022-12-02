import React, { useEffect, useState } from "react";

export default function RowItem(props) {
  const isComing = props.isComing;
  const [lp, setLp] = useState(null); 
  let key = 0;

  useEffect(() => {
    const sessionLp = JSON.parse(sessionStorage.getItem("mainPage_fileData"));
    if (sessionLp) {
      setLp(sessionLp.lp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return lp ? (
    lp.map((item) => {
      key = key + 1;
      return (
        <div className="tab-row-item" key={key} id={key}>
          <RowItemCol data={item} />
        </div>
      );
    })
  ) : (
    <div style={{ color: "rgb(245, 211, 94)", margin: "190px 230px", fontSize: "26px" }}>
      Currently there is no data can be displayed.
    </div>
  );
}
