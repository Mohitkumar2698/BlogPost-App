import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import UserState from "./context/UserState.jsx";
import BlogState from "./context/BlogState.jsx";

createRoot(document.getElementById("root")).render(
  // <Provider store={store}>
  <UserState>
    <BlogState>
      <App />
    </BlogState>
  </UserState>
  // </Provider>
);
