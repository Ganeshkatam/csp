import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/navigation/Header';
import { Footer } from '../components/navigation/Footer';

export function AdminLayout() {
    return (
        <div className="app-root">
            <Header />
            <main className="main-content-layout">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default AdminLayout;
