import React from "react";

export default (props) => {
  return (
    <div
      className="harf shadow-sm bg-dark text-white mr-3"
    >
      {props.acik && <span>{props.deger}</span>}
    </div>
  );
};
