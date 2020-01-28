import { getAppointmentsForDay } from "helpers/selectors";

export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

export const reducer = (state, action) => {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.value };
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.value.days,
        appointments: action.value.appointments,
        interviewers: action.value.interviewers
      };
    case SET_INTERVIEW: {
      const newState = {
        ...state,
        appointments: {
          ...state.appointments,
          [action.id]: {
            ...state.appointments[action.id],
            interview: action.interview
          }
        }
      };

      const [updatedDay] = newState.days.filter(el => {
        return el.appointments.includes(action.id);
      });

      const spotsTaken = getAppointmentsForDay(
        newState,
        updatedDay.name
      ).filter(el => el.interview).length;

      return {
        ...newState,
        days: newState.days.map(el => {
          if (el.name === updatedDay.name) {
            el.spots = el.appointments.length - spotsTaken;
          }
          return el;
        })
      };
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
};
