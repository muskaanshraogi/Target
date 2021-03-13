import React from "react";
import Routes from "./components/Routes";
import {
  MuiThemeProvider,
  createMuiTheme,
  CssBaseline,
} from "@material-ui/core";

const lightPallete = {
  palette: {
    type: "light",
    primary: { main: '#E50058', light: '#FFBE36', contrastText: '#FFFFFF' },
    secondary: { main: '#193B55', light: '#69D2E7', contrastText: '#FFFFFF' },
    background: { paper: '#FCFCFC', default: '#F5F5DC' },
  },
};

function App() {

  const theme = React.useMemo(
    () => (createMuiTheme(lightPallete)), []
  )

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Routes />
    </MuiThemeProvider>
  );
}

export default App;
