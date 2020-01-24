import React from "react";
import DayListItem from "components/DayListItem";

export default function DayList({ days, setDay, day }) {
  return (
    <ul>
      {days.map(item => {
        return (
          <DayListItem
            key={item.id}
            name={item.name}
            spots={item.spots}
            selected={item.name === day}
            setDay={setDay}
          ></DayListItem>
        );
      })}
    </ul>
  );
}
