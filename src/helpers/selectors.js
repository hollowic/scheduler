export function getAppointmentsForDay(state, day) {
  return state.days.filter(el => el.name === day).length === 0
    ? []
    : state.days
        .filter(el => el.name === day)[0]
        .appointments.map(el => (el = state.appointments[el]));
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  return {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer]
  };
}

export function getInterviewersForDay(state, day) {
  return state.days.filter(el => el.name === day).length === 0
    ? []
    : state.days
        .filter(el => el.name === day)[0]
        .interviewers.map(el => (el = state.interviewers[el]));
}
