import React from "react";
// import { createMuiTheme } from "@material-ui/core/styles";
import { createTheme } from '@material-ui/core/styles';
import { MuiThemeProvider } from "@material-ui/core/styles";
import FullCalendarPage from "./FullcalendarPage";
import store from "./Redux/store";
import { Provider } from "react-redux";

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
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <FullCalendarPage />
      </MuiThemeProvider>
    </Provider>
  );
}

export default App;
