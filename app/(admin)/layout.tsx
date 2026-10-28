import Sidebar from "@/components/shared/sidebar";
import AdminProviders from "@/lib/admin-provider";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AdminProviders>
      <div className="w-screen min-h-screen">
        <Sidebar />
        <main className="lg:pl-64 pt-16 lg:pt-0">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto bg-muted-foreground min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </AdminProviders>
  );
};

export default AdminLayout;
