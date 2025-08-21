import React, { StrictMode } from 'react'
import ReactDOM from "react-dom/client"
import { HashRouter } from "react-router-dom"
import App from "./App"
import { DeckProvider } from './contexts/DeckContext';

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <HashRouter>
    <DeckProvider>
      {/* <StrictMode> */}
        <App />
      {/* </StrictMode> */}
    </DeckProvider>
  </HashRouter>
)