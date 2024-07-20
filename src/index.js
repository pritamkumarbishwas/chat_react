import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import theme from "./theme"; // Import your custom theme
import ChatProvider from "./Context/ChatProvider"; // Import your ChatProvider

// Create a root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render your app
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <ChatProvider>
          <App />
        </ChatProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

// Measure performance
reportWebVitals();
