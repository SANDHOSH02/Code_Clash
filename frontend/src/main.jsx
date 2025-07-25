import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
// import ErrorFeedbackPage from "./ErrorFeedbackPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    {/* <ErrorFeedbackPage /> */}
  </StrictMode>
);
