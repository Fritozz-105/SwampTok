import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            {/* Main content area */}
            <div className="flex-1 ml-32">
                {/* Page content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
