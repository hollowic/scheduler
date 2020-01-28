import React from "react";

import { render, cleanup, fireEvent } from "@testing-library/react";

import Form from "components/Appointments/Form";

afterEach(cleanup);

describe("Form", () => {
  const interviewers = [
    {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];

  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(
      <Form interviewers={interviewers} />
    );
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const { getByTestId } = render(
      <Form interviewers={interviewers} name="Lydia Miller-Jones" />
    );
    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });

  it("validates that the student name is not blank", () => {
    const onSave = jest.fn();
    const { getByText } = render(
      <Form interviewers={interviewers} name="" onSave={onSave} />
    );
    fireEvent.click(getByText("Save"));
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();

    expect(onSave).not.toHaveBeenCalled();
  });

  it("validates that an interviewer is selected", () => {
    const onSave = jest.fn();
    const { getByText } = render(
      <Form
        interviewers={interviewers}
        name="Lydia Miller-Jones"
        onSave={onSave}
      />
    );
    fireEvent.click(getByText("Save"));
    expect(getByText(/please select an interviewer/i)).toBeInTheDocument();

    expect(onSave).not.toHaveBeenCalled();
  });

  it("calls onSave function when both student name is and interviewer id defined", () => {
    const onSave = jest.fn();
    const { queryByText, getByText } = render(
      <Form
        interviewers={interviewers}
        name="Lydia Miller-Jones"
        onSave={onSave}
        interviewer={interviewers[0].id}
      />
    );
    fireEvent.click(getByText("Save"));
    expect(queryByText(/student name cannot be blank/i)).toBeNull();

    /* 4. onSave is called once*/
    expect(onSave).toHaveBeenCalledTimes(1);

    /* 5. onSave is called with the correct arguments */
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  });

  it("submits the name entered by the user", () => {
    const onSave = jest.fn();
    const { getByText, getByPlaceholderText } = render(
      <Form
        interviewers={interviewers}
        onSave={onSave}
        interviewer={interviewers[0].id}
      />
    );

    const input = getByPlaceholderText("Enter Student Name");

    fireEvent.change(input, { target: { value: "Lydia Miller-Jones" } });
    fireEvent.click(getByText("Save"));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  });

  it("calls onCancel and resets the input field", () => {
    const onCancel = jest.fn();
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form
        interviewers={interviewers}
        name="Lydia Mill-Jones"
        onSave={jest.fn()}
        onCancel={onCancel}
        interviewer={interviewers[0].id}
      />
    );

    fireEvent.click(getByText("Save"));

    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByText("Cancel"));

    expect(queryByText(/student name cannot be blank/i)).toBeNull();

    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
