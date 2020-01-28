import { useEffect, useReducer } from "react";
import {
  // SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  reducer
} from "reducers/application";
import axios from "axios";

const initialValue = {
  day: "Monday",
  days: [],
  appointments: {},
  interviewers: {}
};

export default function useApplicationData() {
  const setDay = day => dispatch({ type: SET_DAY, value: day });

  const [state, dispatch] = useReducer(reducer, initialValue);

  useEffect(() => {
    let WS = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    WS.onopen = () => {
      WS.onmessage = e => {
        if (JSON.parse(e.data).type === SET_INTERVIEW) {
          dispatch({
            type: SET_INTERVIEW,
            id: JSON.parse(e.data).id,
            interview: JSON.parse(e.data).interview
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
    await axios.put(`/appointments/${id}`, { interview });
    dispatch({ type: SET_INTERVIEW, id, interview });
  }

  async function cancelInterview(id) {
    await axios.delete(`/appointments/${id}`);
    dispatch({ type: SET_INTERVIEW, id, interview: null });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
