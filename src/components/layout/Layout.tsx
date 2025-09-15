import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

export default function Layout() {
  return (
    <>
      <main>
        <Outlet />
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontSize: 16 },
        }}
      />
    </>
  );
}
