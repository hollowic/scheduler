import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem({ selected, spots, name, setDay }) {
  const dayListClass = classNames("day-list__item", {
    "day-list__item--selected": selected,
    "day-list__item--full": spots === 0
  });

  const formatSpots = () => {
    if (spots === 0) {
      return "no spots remaining";
    }
    if (spots === 1) {
      return "1 spot remaining";
    }
    return `${spots} spots remaining`;
  };
  return (
    <li className={dayListClass} onClick={() => setDay(name)} data-testid="day">
      <h2>{name}</h2>
      <h3>{formatSpots()}</h3>
    </li>
  );
}
