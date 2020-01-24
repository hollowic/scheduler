import React from "react";
import classNames from "classnames";
import "components/Button.scss";

export default function Button({
  disabled,
  onClick,
  children,
  confirm,
  danger
}) {
  const buttonClass = classNames("button", {
    "button--confirm": confirm,
    "button--danger": danger
  });

  return (
    <>
      <button disabled={disabled} onClick={onClick} className={buttonClass}>
        {children}
      </button>
    </>
  );
}
