
import React, { useState } from "react";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import DashboardSidebar from "@/components/layout/DashboardSidebar";

// Páginas que usam o layout do Dashboard (admin)
const adminPages = [
  "Dashboard",
  "AdminPosts",
  "AdminROMs", 
  "AdminTournaments",
  "AdminGuides",
  "AdminPokedex",
  "Analytics"
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isAdminPage = adminPages.includes(currentPageName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <style>{`
        :root {
          --pokemon-red: #E3350D;
          --pokemon-blue: #3B5BA7;
          --pokemon-yellow: #FFCB05;
        }
        
        .pokemon-gradient {
          background: linear-gradient(135deg, #E3350D 0%, #3B5BA7 100%);
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        .pokeball-pattern {
          background-image: radial-gradient(circle at 50% 50%, rgba(227, 53, 13, 0.03) 0%, transparent 50%);
          background-size: 150px 150px;
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(227, 53, 13, 0.4);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(227, 53, 13, 0.6);
        }
      `}</style>

      {isAdminPage ? (
        // Dashboard Layout
        <>
          <DashboardSidebar 
            isOpen={sidebarOpen} 
            setIsOpen={setSidebarOpen} 
            currentPage={currentPageName}
          />
          <main
            className={`min-h-screen transition-all duration-300 ${
              sidebarOpen ? "ml-[260px]" : "ml-20"
            }`}
          >
            <div className="p-6 lg:p-8 pokeball-pattern min-h-screen">
              {children}
            </div>
          </main>
        </>
      ) : (
        // Public Layout
        <div className="flex flex-col min-h-screen">
          <PublicHeader />
          <main className="flex-1 pokeball-pattern">
            {children}
          </main>
          <PublicFooter />
        </div>
      )}
    </div>
  );
}
