import React from "react";
import InterviewListItem from "./InterviewListItem";
import "components/InterviewList.scss";
import PropTypes from "prop-types";

export default function InterviewList({ interviewers, value, onChange }) {
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewers.map(item => {
          return (
            <InterviewListItem
              key={item.id}
              name={item.name}
              avatar={item.avatar}
              selected={item.id === value}
              setInterviewer={event => onChange(item.id)}
            ></InterviewListItem>
          );
        })}
      </ul>
    </section>
  );
}

InterviewList.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired
};
