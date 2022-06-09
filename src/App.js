import React,{useState, useEffect} from "react";
// import { createMuiTheme } from "@material-ui/core/styles";
import { createTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
import FullCalendarPage from "./FullcalendarPage";
import store from "./Redux/store";
import { Provider } from "react-redux";
import { TimezoneContext } from "./context/TimezoneContext";
import scheduleClient from "./api/scheduleClient";

import "./main.css";
const fontSize = 14;
const htmlFontSize = 12;
const coef = fontSize / 14;
const theme = createTheme({
  typography: {
    pxToRem: (size) => `${(size / htmlFontSize) * coef}rem`,
  },
});

function App() {
  const [value, setValue] = useState([]);
  const getTimezone = async () => {
    try {
      const response = await scheduleClient.getTimezoneList();
      setValue(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTimezone();
  }, []);
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <TimezoneContext.Provider value={value}>
          <FullCalendarPage />
        </TimezoneContext.Provider>
      </MuiThemeProvider>
    </Provider>
  );
}

export default App;
