import HomePageLayout from "@/components/homepageLayout";
import { Sidebar } from "@/components/sidebar";
import "../globals.css"

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <HomePageLayout />
      </main>
    </div>
  );
}
