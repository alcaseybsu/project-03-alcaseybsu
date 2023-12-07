import React from "react";
import { AppContextProvider } from "./provided/AppContext";
import Project3App from "./Project3App";

/**
 * DO NOT change this file.
 *
 * You _may_ temporarily change pauseUpdates to true here while working
 * on your project or set refreshInterval to speed up or slow down updates.
 *
 * NOTE: if you use a very short refresh interval, you may see some inconsistencies
 * with the backend since the requests may overlap with one another.
 */

export default function App() {
  return (
    <AppContextProvider pauseUpdates={false} refreshInterval={5000}>
      <Project3App />
    </AppContextProvider>
  );
}
