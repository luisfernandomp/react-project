import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Rotas from "./utils/routes";
import { ToastProvider } from "react-toast-notifications";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ToastProvider autoDismiss autoDismissTimeout={2000}>
      {Rotas}
    </ToastProvider>
  </StrictMode>
);
