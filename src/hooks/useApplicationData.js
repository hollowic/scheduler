import { useEffect, useReducer } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors";

const initialValue = {
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
};

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

// const reducerLookUp = {
//   SET_DAY: (state, action) => ({ ...state, day: action.value }),
//   SET_APPLICATION_DATA: (state, action) => {
//     return {
//       ...state,
//       days: action.value.days,
//       appointments: action.value.appointments,
//       interviewers: action.value.interviewers
//     };
//   },
//   SET_INTERVIEW: (state, action) => {
//     const newState = {
//       ...state,
//       appointments: {
//         ...state.appointments,
//         [action.id]: {
//           ...state.appointments[action.id],
//           interview: action.interview
//         }
//       }
//     };

//     const [updatedDay] = newState.days.filter(el => {
//       return el.appointments.includes(action.id);
//     });

//     const spotsTaken = getAppointmentsForDay(newState, updatedDay.name).filter(
//       el => el.interview
//     ).length;

//     return {
//       ...newState,
//       days: newState.days.map(el => {
//         if (el.name === updatedDay.name) {
//           el.spots = el.appointments.length - spotsTaken;
//         }
//         return el;
//       })
//     };
//   }
// };
// function reducer(state)

function reducer(state, action) {
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
}

export default function useApplicationData() {
  const setDay = day => dispatch({ type: SET_DAY, value: day });

  const [state, dispatch] = useReducer(reducer, initialValue);

  useEffect(() => {
    let WS = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    WS.onopen = e => {
      console.log("Connection Established");
      WS.onmessage = event => {
        const incomingData = JSON.parse(event.data);
        if (incomingData.type === SET_INTERVIEW) {
          dispatch({
            type: SET_INTERVIEW,
            id: incomingData.id,
            interview: incomingData.interview
          });
        }
      };
    };

    const closeConnection = () => {
      return WS.close();
    };

    (async () => {
      try {
        const [
          { data: days },
          { data: appointments },
          { data: interviewers }
        ] = await Promise.all([
          axios.get("/days"),
          axios.get("/appointments"),
          axios.get("/interviewers")
        ]);
        dispatch({
          type: SET_APPLICATION_DATA,
          value: {
            days,
            appointments,
            interviewers
          }
        });
      } catch (err) {
        console.log(err);
      }
    })();
    return closeConnection;
  }, []);

  async function bookInterview(id, interview) {
    try {
      await axios.put(`/appointments/${id}`, { interview });
      dispatch({ type: SET_INTERVIEW, id, interview });
    } catch (err) {
      console.log(err);
    }
  }

  async function cancelInterview(id) {
    try {
      await axios.delete(`/appointments/${id}`);
      dispatch({ type: SET_INTERVIEW, id, interview: null });
    } catch (err) {
      console.log(err);
    }
  }

  return { state, setDay, bookInterview, cancelInterview };
}
