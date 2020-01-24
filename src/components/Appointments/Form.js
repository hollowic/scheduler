import React, { useState } from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewList";
export default function Form({
  name,
  interviewer,
  onCancel,
  interviewers,
  onSave
}) {
  const [studentName, setStudentName] = useState(name || "");
  const [interviewerID, setInterviewer] = useState(interviewer || null);
  const reset = () => {
    setStudentName("");
    setInterviewer(null);
  };
  const cancel = () => {
    onCancel();
    reset();
  };
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form onSubmit={event => event.preventDefault()} autoComplete="off">
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={studentName}
            onChange={e => setStudentName(e.target.value)}
            data-testid="student-name-input"
          />
        </form>
        <InterviewerList
          interviewers={interviewers}
          value={interviewerID}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>
            Cancel
          </Button>
          <Button
            confirm
            disabled={!studentName || !interviewerID}
            onClick={() => onSave(studentName, interviewerID)}
          >
            Save
          </Button>
        </section>
      </section>
    </main>
  );
}
