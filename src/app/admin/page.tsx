import type { Metadata } from "next";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = {
  title: "Admin | The Caz Masters",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
