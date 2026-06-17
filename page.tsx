'use client';
import React, { useState } from 'react';
import { Search, Mic, Camera, LayoutGrid, MapPin, Users, Store, Settings } from 'lucide-react';
import { LoginModal, OcrSearchModal, HomeFeed, MapView, TinyCommunity, StoreProfile, AdminDashboard } from '@/components/UIComponents';

export default function BmeStationeryApp() {
  const [currentView, setCurrentView] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isOcrOpen, setIsOcrOpen] = useState(false);

  // Navigation Items
  const navItems = [
    { id: 'home', icon: <LayoutGrid size={20} />, label: 'Bảng tin' },
    { id: 'map', icon: <MapPin size={20} className={currentView === 'map' ? 'text-red-500' : ''} />, label: 'Khẩn cấp' },
    { id: 'community', icon: <Users size={20} />, label: 'Cộng đồng' },
    { id: 'store', icon: <Store size={20} />, label: 'Gian hàng' },
    { id: 'admin', icon: <Settings size={20} />, label: 'Admin' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header - Phong cách Long Châu */}
      <header className="bg-[#003c71] sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between gap-8">
          {/* Logo */}
          <div className="text-white font-black text-2xl tracking-wider shrink-0 cursor-pointer" onClick={() => setCurrentView('home')}>
            BME <span className="text-red-500">STATIONERY</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm linh kiện, máy móc, mã lỗi..." 
              className="w-full h-12 pl-4 pr-24 rounded-full border-none outline-none text-gray-800 shadow-inner"
            />
            <div className="absolute right-2 top-2 flex gap-2">
              <button className="p-2 text-gray-400 hover:text-blue-600 bg-gray-100 rounded-full transition" title="Tìm bằng giọng nói"><Mic size={18} /></button>
              <button onClick={() => setIsOcrOpen(true)} className="p-2 text-gray-400 hover:text-blue-600 bg-gray-100 rounded-full transition" title="Tìm bằng hình ảnh (AI)"><Camera size={18} /></button>
            </div>
            <div className="absolute right-24 top-2 bottom-2 w-10 bg-[#003c71] rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-800 transition">
              <Search className="text-white" size={18} />
            </div>
          </div>

          {/* Auth Button */}
          <button 
            onClick={() => setIsLoginOpen(true)}
            className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-medium transition border border-white/20 shrink-0 whitespace-nowrap"
          >
            Đăng nhập / Đăng ký
          </button>
        </div>

        {/* Main Navigation Tabs */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto flex gap-6 px-4">
            {navItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-2 py-4 px-2 font-semibold text-sm border-b-2 transition ${currentView === item.id ? 'border-[#003c71] text-[#003c71]' : 'border-transparent text-gray-500 hover:text-[#003c71]'}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Dynamic Main Content Based on State */}
      <main className="p-4">
        {currentView === 'home' && <HomeFeed />}
        {currentView === 'map' && <MapView />}
        {currentView === 'community' && <TinyCommunity />}
        {currentView === 'store' && <StoreProfile />}
        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* Render Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <OcrSearchModal isOpen={isOcrOpen} onClose={() => setIsOcrOpen(false)} />
    </div>
  );
}