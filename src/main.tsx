import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import { store, persistor } from "./redux/store";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1a1a2e",
                color: "#fff",
                border: "1px solid #410fd3",
              },
              success: {
                iconTheme: {
                  primary: "#410fd3",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#e74c3c",
                  secondary: "#fff",
                },
              },
            }}
          />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
