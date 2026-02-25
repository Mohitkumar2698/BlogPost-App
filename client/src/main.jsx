import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import UserState from "./context/UserState.jsx";
import BlogState from "./context/BlogState.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { initTheme } from "./utils/theme.js";

initTheme();

createRoot(document.getElementById("root")).render(
  // <Provider store={store}>
  <UserState>
    <BlogState>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BlogState>
  </UserState>
  // </Provider>
);
