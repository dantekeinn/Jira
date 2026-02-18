import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

// No forzamos dark: estética blanco/negro en light por defecto
document.documentElement.classList.remove("dark");

createRoot(document.getElementById("root")!).render(<App />);
