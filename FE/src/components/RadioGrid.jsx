import React from "react";

const RadioGrid = ({ orderType, setOrderType, orderArray, style }) => {
  return (
    <div className="flex flex-col gap-2 items-baseline sm:flex-row ">
      {orderArray.map((item, index) => {
        return (
          <div key={index} className="">
            <input
              type="radio"
              id="html"
              value={item}
              checked={orderType === item}
              onChange={() => setOrderType(item)}
              className=" "
            />
            <label
              htmlFor="html"
              className={style ? style : `text-sm font-medium py-2 ml-1`}
            >
              {item}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default RadioGrid;
