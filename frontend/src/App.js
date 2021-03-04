import React, { useContext } from "react";
import Routes from "./components/Routes";
import {
  colors,
  MuiThemeProvider,
  createMuiTheme,
  CssBaseline,
} from "@material-ui/core";
import { ThemeContext } from "./context/useTheme";

const lightPallete = {
  palette: {
    type: "light",
    primary: { main: colors.blue[500] },
    secondary: { main: colors.blue[300] },
    background: { paper: colors.grey[100], default: colors.grey[200] },
  },
};

const darkPallette = {
  palette: {
    type: "dark",
    primary: { main: colors.blue[500] },
    secondary: { main: colors.blue[300] },
    background: { paper: colors.grey[800], default: colors.grey[900] },
  },
};

function App() {
  const { dark } = useContext(ThemeContext);

  const theme = React.useMemo(
    () => (dark ? createMuiTheme(darkPallette) : createMuiTheme(lightPallete)),
    [dark]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Routes />
    </MuiThemeProvider>
  );
}

export default App;
