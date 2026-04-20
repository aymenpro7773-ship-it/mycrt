import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  Database, 
  History, 
  PlusCircle, 
  Settings, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  CreditCard,
  X,
  Send,
  Users,
  Camera,
  FileUp,
  Sun,
  Moon,
  Trash2,
  CheckCircle2,
  FlaskConical,
  Mail,
  Menu
} from 'lucide-react';

// Design Recipe 1 & 8 Implementation
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'logs' | 'settings' | 'subscribers' | 'templates' | 'test'>('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManualSend, setShowManualSend] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);

  // Periodically Fetch Data from Android Bridge
  useEffect(() => {
    const fetchData = () => {
      try {
        if (window.Android) {
          const statsJson = window.Android.getStats();
          if (statsJson) setStats(JSON.parse(statsJson));

          const logsJson = window.Android.getLogs();
          if (logsJson) setLogs(JSON.parse(logsJson));

          const subsJson = window.Android.getSubscribers();
          if (subsJson) setSubscribers(JSON.parse(subsJson));

          const tempsJson = window.Android.getTemplates();
          if (tempsJson) setTemplates(JSON.parse(tempsJson));

          const cardsJson = window.Android.getCards();
          if (cardsJson) setCards(JSON.parse(cardsJson));
        }
      } catch (e) {
        console.error("Bridge Error", e);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Sync every 5s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Handle Theme Toggle
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Android Back Button Logic
  useEffect(() => {
    (window as any).onBackPressed = () => {
      if (showAddModal) {
        setShowAddModal(false);
        return true;
      }
      if (showManualSend) {
        setShowManualSend(false);
        return true;
      }
      if (isSidebarOpen) {
        setIsSidebarOpen(false);
        return true;
      }
      if (activeTab !== 'dashboard') {
        setActiveTab('dashboard');
        return true;
      }
      return false; // Exit app if on dashboard
    };
  }, [showAddModal, showManualSend, isSidebarOpen, activeTab]);

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#080809] text-[#E0E2E6]' : 'bg-[#FAFAFB] text-[#1A1C1E]'
    }`}>
      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r flex flex-col transition-all duration-500 transform md:relative md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${
        theme === 'dark' ? 'border-white/5 bg-[#0A0A0B]' : 'border-slate-200/60 bg-white'
      }`}>
        <div className={`p-6 border-b flex justify-between items-center transition-colors ${theme === 'dark' ? 'border-white/5' : 'border-[#141414]/10'}`}>
          <div>
            <h1 className="font-mono text-xl font-bold tracking-tighter flex items-center gap-2">
              <ShieldCheck className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-black'}`} /> MYCRT
            </h1>
            <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest mt-1">v2.0.0-ULTIMATE</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 opacity-50 hover:opacity-100">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <SidebarItem active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} icon={<BarChart3 size={18} />} label="الرئيسية" theme={theme} />
          <SidebarItem active={activeTab === 'inventory'} onClick={() => { setActiveTab('inventory'); setIsSidebarOpen(false); }} icon={<Database size={18} />} label="المخزون" theme={theme} />
          <SidebarItem active={activeTab === 'subscribers'} onClick={() => { setActiveTab('subscribers'); setIsSidebarOpen(false); }} icon={<Users size={18} />} label="المشتركين" theme={theme} />
          <SidebarItem active={activeTab === 'templates'} onClick={() => { setActiveTab('templates'); setIsSidebarOpen(false); }} icon={<Mail size={18} />} label="قوالب الرد" theme={theme} />
          <SidebarItem active={activeTab === 'logs'} onClick={() => { setActiveTab('logs'); setIsSidebarOpen(false); }} icon={<History size={18} />} label="السجلات" theme={theme} />
          <SidebarItem active={activeTab === 'test'} onClick={() => { setActiveTab('test'); setIsSidebarOpen(false); }} icon={<FlaskConical size={18} />} label="مختبر الفحص" theme={theme} />
          <SidebarItem active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} icon={<Settings size={18} />} label="الإعدادات" theme={theme} />
        </nav>

        <div className={`p-4 border-t transition-colors ${theme === 'dark' ? 'border-white/5' : 'border-[#141414]/10'}`}>
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg border text-xs font-bold transition-all mb-4 ${
              theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'
            }`}
          >
            {theme === 'light' ? <><Moon size={14} /> تبديل للوضع الليلي</> : <><Sun size={14} /> تبديل للوضع المضيء</>}
          </button>
          
          <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${theme === 'dark' ? 'bg-white/5' : 'bg-[#141414] text-white'}`}>
            <div className={`w-8 h-8 rounded flex items-center justify-center font-mono font-bold ${theme === 'dark' ? 'bg-blue-500' : 'bg-white/20'}`}>A</div>
            <div>
              <p className="text-xs font-bold">أدمن النظام</p>
              <p className="text-[10px] opacity-60">متصل</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pb-16 md:pb-0">
        <header className={`h-16 border-b flex items-center justify-between px-4 md:px-8 transition-all duration-500 shrink-0 sticky top-0 z-30 ${
          theme === 'dark' ? 'border-white/5 bg-[#0A0A0B]/80 backdrop-blur-xl' : 'border-slate-200/60 bg-white/70 backdrop-blur-xl'
        }`}>
          <div className="flex items-center gap-2 text-sm">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`md:hidden p-2 -ml-2 transition-all rounded-full ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
            >
              <Menu size={20} />
            </button>
            <div className="hidden xs:flex items-center gap-2 mr-2">
               <ShieldCheck className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
               <span className="font-extrabold tracking-tighter text-xs">MYCRT</span>
            </div>
            <span className="opacity-40 hidden sm:inline">النظام</span>
            <ChevronRight size={14} className="opacity-30 hidden sm:inline" />
            <span className="font-bold text-xs md:text-sm">
              {activeTab === 'dashboard' && 'الرئيسية'}
              {activeTab === 'inventory' && 'المخزون'}
              {activeTab === 'subscribers' && 'المشتركين'}
              {activeTab === 'templates' && 'القوالب'}
              {activeTab === 'logs' && 'السجلات'}
              {activeTab === 'test' && 'المختبر'}
              {activeTab === 'settings' && 'الإعدادات'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className={`p-1.5 rounded-full border transition-all ${theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}`}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="flex items-center gap-2 text-[10px] font-mono whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="hidden xs:inline text-green-500">نشط</span>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto px-4 py-6 md:p-8">
          {activeTab === 'dashboard' && <DashboardView onManualSend={() => setShowManualSend(true)} theme={theme} stats={stats} />}
          {activeTab === 'inventory' && <InventoryView onAdd={() => setShowAddModal(true)} theme={theme} cards={cards} />}
          {activeTab === 'subscribers' && <SubscribersView theme={theme} subscribers={subscribers} />}
          {activeTab === 'templates' && <TemplatesView theme={theme} templates={templates} />}
          {activeTab === 'logs' && <LogsView theme={theme} logs={logs} />}
          {activeTab === 'test' && <TestLabView theme={theme} />}
          {activeTab === 'settings' && <SettingsView theme={theme} />}
        </section>

        {/* Bottom Navigation - Mobile Only */}
        <nav className={`md:hidden fixed bottom-0 left-0 right-0 h-16 border-t flex items-center justify-around px-2 z-40 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-[#0F0F0F] border-white/5' : 'bg-white border-zinc-100'
        }`}>
          <BottomNavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<BarChart3 size={20} />} label="الرئيسية" theme={theme} />
          <BottomNavItem active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<Database size={20} />} label="مخزون" theme={theme} />
          <BottomNavItem active={activeTab === 'subscribers'} onClick={() => setActiveTab('subscribers')} icon={<Users size={20} />} label="مشتركين" theme={theme} />
          <BottomNavItem active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<History size={20} />} label="سجلات" theme={theme} />
          <BottomNavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20} />} label="إعدادات" theme={theme} />
        </nav>

        {/* Modals */}
        {showAddModal && <AddCardsModal onClose={() => setShowAddModal(false)} theme={theme} />}
        {showManualSend && <ManualSendModal onClose={() => setShowManualSend(false)} theme={theme} />}
      </main>
    </div>
  );
};

const SidebarItem = ({ active, onClick, icon, label, theme }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; theme: 'dark'|'light' }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 ${
      active 
        ? (theme === 'dark' ? 'bg-blue-600 text-white shadow-[0_8px_30px_rgb(37,99,235,0.3)]' : 'bg-[#1A1C1E] text-white shadow-[0_8px_30px_rgb(0,0,0,0.1)]') 
        : (theme === 'dark' ? 'hover:bg-white/5 text-zinc-500' : 'hover:bg-slate-100 text-slate-500')
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-white/20' : (theme === 'dark' ? 'bg-white/5' : 'bg-slate-50')}`}>
        {icon}
      </div>
      <span className="text-sm font-semibold tracking-tight">{label}</span>
    </div>
    {active && <ChevronRight size={14} className="opacity-60" />}
  </button>
);

const BottomNavItem = ({ active, onClick, icon, label, theme }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; theme: 'dark'|'light' }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 w-16 h-full ${
      active 
        ? (theme === 'dark' ? 'text-blue-400' : 'text-blue-600') 
        : 'text-zinc-400 opacity-60'
    }`}
  >
    <div className={`transition-all duration-300 ${active ? 'scale-110' : 'scale-100'}`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold tracking-tight">{label}</span>
    {active && <div className={`w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'} mt-0.5`} />}
  </button>
);

const AddCardsModal = ({ onClose, theme }: { onClose: () => void; theme: 'dark'|'light' }) => {
  const [importType, setImportType] = useState<'single' | 'bulk' | 'file' | 'ocr'>('bulk');
  const [category, setCategory] = useState(100);
  const [codesText, setCodesText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (!codesText.trim()) return;
    const codes = codesText.split('\n').map(c => c.trim()).filter(c => c);
    if (codes.length > 0) {
      window.Android?.addCards(category, JSON.stringify(codes));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className={`w-full max-w-2xl rounded-t-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300 border ${
        theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10'
      }`}>
        <div className={`p-4 md:p-6 border-b flex justify-between items-center ${theme === 'dark' ? 'border-white/5' : 'border-zinc-100'}`}>
          <div className="flex items-center gap-2 md:gap-3">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-black/5 text-black'}`}>
               <PlusCircle size={18} />
            </div>
            <div>
              <h3 className="text-sm md:text-lg font-bold">إضافة كروت جديدة</h3>
              <p className="text-[8px] md:text-[10px] opacity-50 font-mono">طرق إدخال متعددة للنظام</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-1.5 md:p-2 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-zinc-100'}`}><X size={20} /></button>
        </div>
        
        <div className="p-4 md:p-8 max-h-[80vh] overflow-y-auto">
          {/* Import Selectors */}
          <div className="grid grid-cols-4 gap-1 md:gap-2 mb-6 md:mb-8 bg-zinc-100 dark:bg-white/5 p-1 rounded-2xl">
            <button onClick={() => setImportType('single')} className={`py-2 px-1 rounded-xl text-[8px] md:text-[10px] font-black uppercase transition-all ${importType === 'single' ? 'bg-white dark:bg-[#1A1A1A] shadow-sm' : 'opacity-40'}`}>يدوي</button>
            <button onClick={() => setImportType('bulk')} className={`py-2 px-1 rounded-xl text-[8px] md:text-[10px] font-black uppercase transition-all ${importType === 'bulk' ? 'bg-white dark:bg-[#1A1A1A] shadow-sm' : 'opacity-40'}`}>قائمة</button>
            <button onClick={() => setImportType('file')} className={`py-2 px-1 rounded-xl text-[8px] md:text-[10px] font-black uppercase transition-all ${importType === 'file' ? 'bg-white dark:bg-[#1A1A1A] shadow-sm' : 'opacity-40'}`}>ملف</button>
            <button onClick={() => setImportType('ocr')} className={`py-2 px-1 rounded-xl text-[8px] md:text-[10px] font-black uppercase transition-all ${importType === 'ocr' ? 'bg-white dark:bg-[#1A1A1A] shadow-sm' : 'opacity-40'}`}>كاميرا</button>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase opacity-40">الفئة المختارة</label>
                <select 
                  value={category}
                  onChange={e => setCategory(Number(e.target.value))}
                  className={`w-full p-4 rounded-2xl text-sm focus:outline-none focus:ring-2 ring-blue-500/20 transition-all ${
                  theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-200'
                } border`}>
                  {[100, 200, 300, 500, 1000, 2000].map(c => <option key={c} value={c}>{c} R.Y</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-bold uppercase opacity-40">تاريخ الانتهاء</label>
                <input type="date" className={`w-full p-4 rounded-2xl text-sm italic focus:outline-none border ${
                  theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-200'
                }`} />
              </div>
            </div>

            {(importType === 'bulk' || importType === 'single') && (
              <div className="space-y-2 animate-in slide-in-from-top-2">
                <label className="text-[10px] font-mono font-bold uppercase opacity-40 italic">
                  {importType === 'single' ? 'كود الكرت' : 'أكواد الكروت (كل كود في سطر)'}
                </label>
                <textarea 
                  value={codesText}
                  onChange={e => setCodesText(e.target.value)}
                  placeholder={importType === 'single' ? 'أدخل الكود هنا...' : 'لصق قائمة الأكواد هنا...'} 
                  className={`w-full p-4 md:p-6 rounded-2xl text-xs md:text-sm font-mono focus:outline-none h-32 md:h-40 border ${
                    theme === 'dark' ? 'bg-white/5 border-white/10 border-dashed' : 'bg-zinc-50 border-zinc-200'
                  }`}
                />
              </div>
            )}

            {importType === 'file' && (
              <div className="animate-in slide-in-from-top-2">
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className={`w-full h-32 md:h-40 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                     theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-zinc-200 hover:bg-zinc-50'
                   }`}
                 >
                    <FileUp size={24} className="opacity-20" />
                    <p className="text-xs font-bold">اضغط هنا أو اسحب الملف</p>
                    <p className="text-[8px] opacity-40 italic font-mono uppercase tracking-widest">XLSX_CSV_TXT_SUPPORT</p>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx,.txt" />
                 </div>
              </div>
            )}

            {importType === 'ocr' && (
              <div className="animate-in slide-in-from-top-2">
                 <div className={`w-full h-32 md:h-48 rounded-3xl bg-black relative overflow-hidden flex items-center justify-center border-2 ${theme === 'dark' ? 'border-blue-500/30' : 'border-black'}`}>
                    <div className="absolute inset-x-0 h-0.5 bg-blue-500 animate-scan top-0 z-10" />
                    <Camera size={32} className="text-white opacity-40" />
                    <p className="absolute bottom-4 text-[8px] text-white/40 font-mono tracking-widest uppercase">Initializing Vision Engine...</p>
                 </div>
                 <p className="mt-3 text-[9px] text-center opacity-40 leading-relaxed uppercase font-bold tracking-tighter">AI_OCR_EXTRACTION_ACTIVE</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-6 md:pt-8 bg-inherit">
            <button onClick={onClose} className={`flex-1 p-4 md:p-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
              theme === 'dark' ? 'bg-white/5 hover:bg-white/10 shadow-lg shadow-black/20' : 'border border-zinc-200 hover:bg-zinc-50'
            }`}>إلغاء</button>
            <button 
              onClick={handleAdd}
              className={`flex-1 p-4 md:p-5 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] ${
              theme === 'dark' ? 'bg-blue-600 shadow-blue-500/30' : 'bg-[#141414] shadow-black/40'
            }`}>تأكيد ومعالجة</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManualSendModal = ({ onClose, theme }: { onClose: () => void; theme: 'dark'|'light' }) => {
  const [recipientType, setRecipientType] = useState<'single' | 'batch' | 'subscriber'>('single');
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className={`w-full max-w-lg rounded-t-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300 border ${
        theme === 'dark' ? 'bg-[#121212] border-white/10' : 'bg-white border-black/10'
      }`}>
        <div className={`p-4 md:p-6 border-b flex justify-between items-center ${theme === 'dark' ? 'border-white/5' : 'border-zinc-100'}`}>
          <div className="flex items-center gap-3">
            <Send size={18} className={theme === 'dark' ? 'text-blue-400' : 'text-black'} />
            <h3 className="text-sm md:text-lg font-bold uppercase tracking-widest italic">إرسال يدوي متقدم</h3>
          </div>
          <button onClick={onClose} className={`p-1.5 md:p-2 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-zinc-100'}`}><X size={20} /></button>
        </div>

        <div className="p-4 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-1 md:gap-2 bg-zinc-100 dark:bg-white/5 p-1 rounded-2xl">
             <button onClick={() => setRecipientType('single')} className={`py-2 rounded-xl text-[8px] md:text-[10px] font-black tracking-widest transition-all ${recipientType === 'single' ? 'bg-white dark:bg-[#1A1A1A] shadow-sm shadow-black/10' : 'opacity-40'}`}>رقم واحد</button>
             <button onClick={() => setRecipientType('batch')} className={`py-2 rounded-xl text-[8px] md:text-[10px] font-black tracking-widest transition-all ${recipientType === 'batch' ? 'bg-white dark:bg-[#1A1A1A] shadow-sm shadow-black/10' : 'opacity-40'}`}>متعدد</button>
             <button onClick={() => setRecipientType('subscriber')} className={`py-2 rounded-xl text-[8px] md:text-[10px] font-black tracking-widest transition-all ${recipientType === 'subscriber' ? 'bg-white dark:bg-[#1A1A1A] shadow-sm shadow-black/10' : 'opacity-40'}`}>كروت شهر</button>
          </div>

          <div className="space-y-4">
            {recipientType === 'single' ? (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-black uppercase opacity-40 tracking-widest italic leading-none">رقم الوجهة</label>
                <input type="text" placeholder="77XXXXXXX" className={`w-full p-4 rounded-2xl border font-mono font-bold transition-all shadow-inner ${
                  theme === 'dark' ? 'bg-black/20 border-white/5 text-white' : 'bg-zinc-50 border-zinc-200'
                }`} />
              </div>
            ) : recipientType === 'batch' ? (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-black uppercase opacity-40 tracking-widest italic leading-none">الأرقام (كل رقم في سطر)</label>
                <textarea placeholder="777XXXXXX\n771XXXXXX" className={`w-full h-32 p-4 rounded-2xl border font-mono font-bold transition-all shadow-inner ${
                  theme === 'dark' ? 'bg-black/20 border-white/5 text-white' : 'bg-zinc-50 border-zinc-200'
                }`} />
              </div>
            ) : (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-black uppercase opacity-40 tracking-widest italic leading-none">تحديد المشتركين</label>
                <div className={`w-full h-40 overflow-y-auto border rounded-2xl p-2 space-y-1 shadow-inner ${
                  theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-zinc-50 border-zinc-100'
                }`}>
                  {[1,2,3,4,5].map(i => (
                    <label key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-transparent hover:bg-white'}`}>
                       <input type="checkbox" className="w-5 h-5 rounded-md accent-blue-600 cursor-pointer" />
                       <div className="flex flex-col">
                          <span className="text-xs font-black">مشترك رقم {i}</span>
                          <span className="text-[9px] opacity-40 font-mono tracking-tighter">77123456(0)</span>
                       </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase opacity-40 tracking-widest italic leading-none">فئة الكرت</label>
              <select className={`w-full p-4 rounded-2xl border font-mono font-black transition-all shadow-inner ${
                theme === 'dark' ? 'bg-black/20 border-white/5' : 'bg-zinc-50 border-zinc-200'
              }`}>
                {[100, 200, 300, 500, 1000, 2000].map(c => <option key={c} value={c}>{c} R.Y</option>)}
              </select>
            </div>
          </div>

          <button className={`w-full p-5 rounded-2xl text-white text-xs font-black tracking-[0.2em] uppercase shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 ${
            theme === 'dark' ? 'bg-blue-600 shadow-blue-500/40' : 'bg-[#141414] shadow-black/40'
          }`}>
             <Send size={16} /> بدء الإرسال الفوري
          </button>
        </div>
      </div>
    </div>
  );
}

const DashboardView = ({ onManualSend, theme, stats }: { onManualSend: () => void; theme: 'dark'|'light'; stats: any }) => (
  <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
      <div className="space-y-1">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter italic leading-none">نبض النظام</h2>
        <div className="flex items-center gap-3 mt-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${theme === 'dark' ? 'bg-blue-600 shadow-lg shadow-blue-600/50 text-white' : 'bg-blue-600 text-white shadow-xl shadow-blue-500/20'}`}>LIVE GATEWAY</span>
            <p className="text-[9px] md:text-[10px] opacity-40 font-mono tracking-wide uppercase italic">مراقبة حية للعمليات</p>
        </div>
      </div>
      <button 
        onClick={onManualSend}
        className={`w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.05] active:scale-[0.95] flex items-center justify-center gap-2 shadow-2xl ${
          theme === 'dark' ? 'bg-blue-600 text-white shadow-blue-500/40 border border-blue-400/50' : 'bg-[#1A1C1E] text-white shadow-xl shadow-black/20'
        }`}
      >
        <Send size={16} /> إرسال يدوي
      </button>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      <StatCard label="مبيعات اليوم" value={stats?.total_revenue?.toString() || "0"} unit="R.Y" theme={theme} icon={<TrendingUp className={theme === 'dark' ? 'text-blue-400' : 'text-green-500'} />} />
      <StatCard label="المستفيدين" value={stats?.total_success?.toString() || "0"} unit="عميل" theme={theme} icon={<CreditCard className="text-blue-500" />} />
      <StatCard label="مشتركين" value="12" unit="نشط" theme={theme} icon={<Users className="text-purple-500" />} />
      <StatCard label="استقرار" value="99.9" unit="%" theme={theme} icon={<ShieldCheck className="text-orange-500" />} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className={`lg:col-span-2 border rounded-3xl md:rounded-[40px] overflow-hidden transition-all shadow-xl ${theme === 'dark' ? 'bg-[#0F0F10] border-white/5 shadow-blue-500/5' : 'bg-white border-slate-200/50 shadow-[0_20px_50px_rgba(0,0,0,0.04)]'}`}>
            <div className={`p-6 md:p-8 border-b flex justify-between items-center ${theme === 'dark' ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50/50'}`}>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 italic flex items-center gap-2">
                    <Database size={14} /> حالة المخزون
                </h3>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                   <span className="text-[8px] md:text-[10px] font-bold opacity-30 uppercase">LIVE_SYNC</span>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-y divide-zinc-100 dark:divide-white/5">
                {[100, 200, 300, 500, 1000, 2000].map((cat) => (
                <div key={cat} className={`p-6 md:p-10 text-center transition-all ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-zinc-50/50'}`}>
                    <p className="text-[8px] md:text-[10px] font-mono opacity-30 uppercase font-black mb-2 italic tracking-widest">فئة {cat}</p>
                    <p className="text-3xl md:text-5xl font-black font-mono tracking-tighter">{stats?.inventory?.[cat] || "0"}</p>
                    <div className={`mt-4 md:mt-6 w-full h-1.5 md:h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/5' : 'bg-zinc-100'}`}>
                    <div className={`h-full transition-all duration-1000 ${
                        cat === 1000 ? 'bg-orange-500' : 
                        cat === 2000 ? 'bg-purple-500' :
                        theme === 'dark' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-black'
                    }`} style={{ width: stats?.inventory?.[cat] > 0 ? `${Math.min(100, (stats?.inventory?.[cat] / 50) * 100)}%` : '5%' }} />
                    </div>
                </div>
                ))}
            </div>
        </div>

        <div className={`border rounded-3xl md:rounded-[40px] p-6 md:p-8 flex flex-col justify-between transition-colors shadow-xl ${theme === 'dark' ? 'bg-blue-600 border-white/20 text-white' : 'bg-black text-white'}`}>
             <div className="space-y-4">
                 <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-md">
                     <ShieldCheck size={20} md:size={24} />
                 </div>
                 <h3 className="text-xl md:text-2xl font-black italic tracking-tighter leading-tight">التحقق الأمني<br/>مفعل بالبصمة</h3>
                 <p className="text-[10px] md:text-xs opacity-70 font-bold leading-relaxed">نظام حماية متطور لكافة العمليات البرمجية والمخرجات لضمان الخصوصية.</p>
             </div>
             <div className="pt-6 md:pt-8 mt-6 md:mt-8 border-t border-white/10 space-y-4">
                 <div className="flex justify-between items-center text-[9px] md:text-[10px] font-black uppercase opacity-60 italic">
                     <span>إصدار النظام</span>
                     <span>v2.4.0_STABLE</span>
                 </div>
                 <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-white w-full animate-pulse" />
                 </div>
             </div>
        </div>
    </div>
  </div>
);

const InventoryView = ({ onAdd, theme, cards }: { onAdd: () => void; theme: 'dark'|'light'; cards: any[] }) => (
  <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight italic leading-none">إدارة المخزون</h2>
        <p className="text-[10px] opacity-40 font-mono tracking-[0.2em] uppercase">إدارة الأكواد والكميات</p>
      </div>
      <button 
        onClick={onAdd}
        className={`w-full sm:w-auto px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.05] active:scale-[0.95] flex items-center justify-center gap-3 shadow-xl ${
          theme === 'dark' ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-[#1A1C1E] text-white shadow-black/20'
        }`}
      >
        <PlusCircle size={18} /> إضافة مخزون
      </button>
    </div>

    {/* Desktop Table View */}
    <div className={`hidden md:block border rounded-[32px] overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-[#0F0F10] border-white/5' : 'bg-white border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)]'}`}>
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className={`border-b transition-colors font-black italic text-[10px] uppercase opacity-30 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
            <th className="p-6">ID القيد</th>
            <th className="p-6">الفئة السعرية</th>
            <th className="p-6">رمز الكرت</th>
            <th className="p-6">مضاف بواسطة</th>
            <th className="p-6 text-center">الحالة</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card.id} className={`border-b transition-all font-mono text-sm group ${theme === 'dark' ? 'border-white/5 hover:bg-white/5' : 'border-slate-50 hover:bg-slate-50'}`}>
              <td className="p-6 text-xs opacity-30 italic">#{card.id}</td>
              <td className="p-6 font-black text-base">{card.category} <span className="text-[10px] opacity-30 font-bold uppercase">R.Y</span></td>
              <td className="p-6 opacity-60 tracking-[0.3em] font-bold group-hover:opacity-100 transition-opacity">
                  {card.isUsed ? '****-****-****' : card.code}
              </td>
              <td className="p-6 text-xs opacity-40 font-bold">SYSTEM_AUTO</td>
              <td className="p-6 text-center">
                  <span className={`px-4 py-1 text-[9px] font-black rounded-full italic border inline-block ${
                      card.isUsed 
                      ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                      : 'bg-green-500/10 text-green-500 border-green-500/20'
                  }`}>
                      {card.isUsed ? 'SOLD_OUT' : 'READY'}
                  </span>
              </td>
            </tr>
          ))}
          {cards.length === 0 && (
            <tr>
              <td colSpan={5} className="p-20 text-center opacity-30 italic font-bold">المخزون فارغ حالياً</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Mobile Card View */}
    <div className="md:hidden space-y-4">
      {cards.map((card) => (
        <div key={card.id} className={`p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-[#0F0F0F] border-white/10' : 'bg-white border-[#141414]/5 shadow-sm'}`}>
          <div className="flex justify-between items-start mb-3">
             <div className="space-y-1">
                <p className="text-[8px] font-mono opacity-30 uppercase font-black italic">ID: #{card.id}</p>
                <p className="text-xl font-black font-mono">{card.category} <span className="text-[10px] opacity-30 font-bold uppercase">R.Y</span></p>
             </div>
             <span className={`px-3 py-1 text-[8px] font-black rounded-full italic border ${
                 card.isUsed 
                 ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                 : 'bg-green-500/10 text-green-500 border-green-500/20'
             }`}>
                 {card.isUsed ? 'M_OUT' : 'READY'}
             </span>
          </div>
          <div className={`p-3 rounded-xl font-mono text-center tracking-[0.2em] font-bold text-xs ${theme === 'dark' ? 'bg-white/5' : 'bg-zinc-50 border border-zinc-100'}`}>
              {card.isUsed ? '****-****-****' : card.code}
          </div>
        </div>
      ))}
      {cards.length === 0 && (
        <div className="p-10 text-center opacity-30 italic font-bold">المخزون فارغ حالياً</div>
      )}
    </div>
  </div>
);

const SubscribersView = ({ theme, subscribers }: { theme: 'dark'|'light'; subscribers: any[] }) => (
  <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight italic font-serif leading-none">إدارة المشتركين</h2>
        <p className="text-[10px] opacity-40 font-mono tracking-[0.2em] uppercase">إدارة كروت الشهر والاشتراكات</p>
      </div>
      <button 
        onClick={() => {
          const name = prompt("اسم المشترك:");
          const phone = prompt("رقم الهاتف:");
          const cat = prompt("نوع الاشتراك:");
          const date = prompt("تاريخ الانتهاء (YYYY-MM-DD):");
          if (name && phone && cat && date) {
            window.Android?.addSubscriber(name, phone, cat, date);
          }
        }}
        className={`w-full sm:w-auto px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.05] active:scale-[0.95] flex items-center justify-center gap-3 shadow-xl ${
          theme === 'dark' ? 'bg-purple-600 text-white shadow-purple-500/20' : 'bg-purple-600 text-white'
      }`}>
        <PlusCircle size={18} /> إضافة مشترك
      </button>
    </div>

    {/* Desktop View */}
    <div className={`hidden md:block border rounded-3xl overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-[#0F0F0F] border-white/10' : 'bg-white border-[#141414]/10'}`}>
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className={`border-b font-black italic text-[10px] uppercase opacity-30 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-zinc-50 border-zinc-100'}`}>
            <th className="p-6">المشترك</th>
            <th className="p-6">رقم الهاتف</th>
            <th className="p-6">نوع الاشتراك</th>
            <th className="p-6">تاريخ الانتهاء</th>
            <th className="p-6 text-center">التحكم</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((s, i) => (
            <tr key={i} className={`border-b font-mono text-sm hover:bg-zinc-50 dark:hover:bg-white/5 transition-all`}>
              <td className="p-6 font-black">{s.name}</td>
              <td className="p-6 opacity-60 font-bold">{s.phone}</td>
              <td className="p-6">
                 <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${theme === 'dark' ? 'border-blue-500 text-blue-400' : 'border-black text-black'}`}>{s.category}</span>
              </td>
              <td className="p-6 text-xs font-bold text-red-500">{s.expiryDate}</td>
              <td className="p-6">
                <div className="flex justify-center gap-2">
                  <button onClick={() => window.Android?.deleteSubscriber(s.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {subscribers.length === 0 && (
            <tr>
              <td colSpan={5} className="p-20 text-center opacity-30 italic font-bold">لا يوجد مشتركين مسجلين حالياً</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Mobile View */}
    <div className="md:hidden space-y-4">
      {subscribers.map((s, i) => (
        <div key={i} className={`p-5 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-[#0F0F0F] border-white/10' : 'bg-white border-[#141414]/5 shadow-sm'}`}>
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1">
              <p className="text-sm font-black">{s.name}</p>
              <p className="text-[10px] font-mono opacity-50 font-bold">{s.phone}</p>
            </div>
            <button onClick={() => window.Android?.deleteSubscriber(s.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg">
              <Trash2 size={16} />
            </button>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold border-t pt-3 border-zinc-100 dark:border-white/5">
             <span className={`px-3 py-1 rounded-full border ${theme === 'dark' ? 'border-blue-500 text-blue-400' : 'border-black text-black'}`}>{s.category}</span>
             <span className="text-red-500 italic">{s.expiryDate}</span>
          </div>
        </div>
      ))}
      {subscribers.length === 0 && (
        <div className="p-10 text-center opacity-30 italic font-bold">لا يوجد مشتركين حالياً</div>
      )}
    </div>
  </div>
);

const TemplatesView = ({ theme, templates }: { theme: 'dark'|'light'; templates: any[] }) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tight italic leading-none">قوالب الرد الذكي</h2>
            <p className="text-[10px] opacity-40 font-mono tracking-[0.2em] uppercase">تخصيص الرسائل المرسلة لكل فئة سعرية</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[100, 200, 300, 500, 1000, 2000].map(cat => {
                const template = templates.find(t => t.category === cat);
                return (
                    <div key={cat} className={`p-8 border rounded-[32px] space-y-4 shadow-xl transition-all hover:scale-[1.01] ${
                        theme === 'dark' ? 'bg-[#0F0F10] border-white/5 shadow-blue-500/5' : 'bg-white border-slate-100 shadow-[0_15px_35px_rgba(0,0,0,0.03)]'
                    }`}>
                        <div className="flex justify-between items-center">
                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black italic border ${
                                theme === 'dark' ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'
                            }`}>فئة {cat} R.Y</span>
                            <div className={`w-2 h-2 rounded-full animate-pulse ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`} />
                        </div>
                        <textarea 
                            defaultValue={template?.text || "تم استلام طلبك! كود الكرت هو: [كود_الكرت]"}
                            onChange={(e) => window.Android?.saveTemplate(cat, e.target.value)}
                            placeholder="اكتب رسالة الرد هنا..."
                            className={`w-full p-6 rounded-2xl text-xs font-bold leading-relaxed focus:outline-none transition-all outline-none border focus:ring-4 focus:ring-blue-500/5 ${
                                theme === 'dark' ? 'bg-black/40 border-white/5 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'
                            }`}
                            rows={4}
                        />
                        <p className="text-[9px] opacity-30 font-mono italic">استخدم [كود_الكرت] ليتم استبداله أوتوماتيكياً بالكود الحقيقي.</p>
                    </div>
                );
            })}
        </div>
    </div>
);

const TestLabView = ({ theme }: { theme: 'dark'|'light' }) => {
    const [num, setNum] = useState('777123456');
    const [body, setBody] = useState('تحويل 500');

    return (
        <div className="max-w-xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="text-center space-y-2">
                <div className="w-20 h-20 bg-blue-600 rounded-[35%] mx-auto flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 transform rotate-12">
                    <FlaskConical size={40} />
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter mt-6 lowercase">LAB_EXPERIMENT</h2>
                <p className="text-[11px] opacity-40 font-mono uppercase tracking-[0.3em]">اختبار محرك الذكاء والردود</p>
            </div>

            <div className={`p-10 border rounded-[40px] space-y-8 shadow-2xl ${
                theme === 'dark' ? 'bg-[#0F0F0F] border-white/10' : 'bg-white border-black/10'
            }`}>
                <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest opacity-30 italic">رقم المرسل الوهمي</label>
                    <input 
                        value={num}
                        onChange={e => setNum(e.target.value)}
                        className={`w-full p-5 rounded-2xl text-sm font-bold border outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                            theme === 'dark' ? 'bg-black/40 border-white/10 text-white' : 'bg-zinc-50 border-zinc-100'
                        }`} 
                    />
                </div>
                <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest opacity-30 italic">نص الرسالة الواردة</label>
                    <textarea 
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        className={`w-full p-5 rounded-2xl text-sm font-bold border outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                            theme === 'dark' ? 'bg-black/40 border-white/10 text-white' : 'bg-zinc-50 border-zinc-100'
                        }`} 
                        rows={3}
                    />
                </div>

                <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 italic text-[10px] opacity-60 leading-relaxed">
                    ملاحظة: هذا الاختبار سيقوم بمحاكاة وصول رسالة SMS من شركة الاتصالات وسيقوم النظام بتنفيذ الرد الحقيقي إذا توفر الكرت.
                </div>

                <button 
                    onClick={() => window.Android?.simulateSms(num, body)}
                    className="w-full p-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black tracking-widest shadow-2xl shadow-blue-500/40 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                    <Send size={18} /> تشغيل المحاكاة الآن
                </button>
            </div>
        </div>
    );
};

const LogsView = ({ theme, logs }: { theme: 'dark'|'light'; logs: any[] }) => (
  <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="space-y-1">
      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight italic leading-none">سجل العمليات</h2>
      <p className="text-[10px] opacity-40 font-mono tracking-[0.2em] uppercase">تتبع النشاط البرمجي والرسائل</p>
    </div>

    {/* Desktop View */}
    <div className={`hidden md:block border rounded-[32px] overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-[#0F0F10] border-white/5' : 'bg-white border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)]'}`}>
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className={`border-b font-black italic text-[10px] uppercase opacity-30 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
            <th className="p-6">معرف العملية</th>
            <th className="p-6">الوقت</th>
            <th className="p-6">رقم العميل</th>
            <th className="p-6">القيمة</th>
            <th className="p-6 text-center">نتيجة التشغيل</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={i} className={`border-b font-mono text-sm group transition-all overflow-hidden ${theme === 'dark' ? 'hover:bg-white/5 border-white/5' : 'hover:bg-slate-50 border-slate-50'}`}>
              <td className="p-6 text-[10px] opacity-20 font-black group-hover:opacity-60 transition-opacity">OP_RX_{log.id}</td>
              <td className="p-6 text-xs italic font-bold opacity-40">{new Date(log.timestamp).toLocaleTimeString()}</td>
              <td className="p-6 font-black font-sans">{log.number}</td>
              <td className="p-6 font-black">{log.amount} <span className="text-[10px] opacity-20">R.Y</span></td>
              <td className="p-6">
                <div className="flex justify-center text-emerald-500 font-black text-[10px] uppercase italic tracking-widest gap-2 items-center">
                   SUCCESS_DISPATCH <CheckCircle2 size={12} className="animate-pulse" />
                </div>
              </td>
            </tr>
          ))}
          {logs.length === 0 && (
            <tr>
              <td colSpan={5} className="p-20 text-center opacity-30 italic font-bold">السجل فارغ حالياً</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Mobile View */}
    <div className="md:hidden space-y-4">
      {logs.map((log, i) => (
        <div key={i} className={`p-4 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-[#0F0F0F] border-white/10' : 'bg-white border-[#141414]/5 shadow-sm'}`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-[9px] font-black uppercase text-green-500">SUCCESS DISPATCH</span>
            <span className="text-[8px] font-mono opacity-30 italic">#{log.id}</span>
          </div>
          <p className="text-sm font-bold mb-2">تحويل {log.amount} <span className="opacity-40">R.Y</span></p>
          <div className="flex justify-between items-center text-[10px] font-mono opacity-40 border-t pt-2 border-zinc-100 dark:border-white/5">
             <span className="font-bold">{log.number}</span>
             <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      ))}
      {logs.length === 0 && (
        <div className="p-10 text-center opacity-30 italic font-bold">السجل فارغ حالياً</div>
      )}
    </div>
  </div>
);

const SettingsView = ({ theme }: { theme: 'dark'|'light' }) => (
    <div className="max-w-2xl space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-3xl font-black tracking-tighter italic font-serif leading-none">الإعدادات العميقة</h2>
        
        <div className="space-y-10">
            <section className="space-y-4">
                <h3 className="text-xs font-black uppercase opacity-20 tracking-[0.3em] font-mono">بروتوكولات الأمان</h3>
                <div className={`p-8 border rounded-3xl space-y-6 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'}`}>
                    <ToggleItem label="تفعيل البصمة الإجبارية" desc="طلب التحقق من الهوية الحيوية عند فتح التطبيق." defaultOn theme={theme} />
                    <div className="h-px bg-zinc-100 dark:bg-white/5" />
                    <ToggleItem label="الجدار الناري للنظام" desc="حظر الأرقام المشبوهة أو العشوائية تلقائياً." theme={theme} />
                </div>
            </section>

            <section className="space-y-4">
                <h3 className="text-xs font-black uppercase opacity-20 tracking-[0.3em] font-mono">محرك التوزيع</h3>
                <div className={`p-8 border rounded-3xl space-y-6 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-black/10'}`}>
                    <ToggleItem label="التوزيع الفوري الذكي" desc="قراءة SMS وإرسال الكرت في أقل من 5 ثواني." defaultOn theme={theme} />
                    <div className="h-px bg-zinc-100 dark:bg-white/5" />
                    <div className="space-y-4">
                        <label className="text-[10px] font-black font-mono uppercase opacity-30 italic">قالب الرسالة الترحيبية</label>
                        <textarea className={`w-full p-6 rounded-2xl text-xs font-bold leading-relaxed focus:outline-none transition-all ${
                          theme === 'dark' ? 'bg-black/40 border-white/10' : 'bg-zinc-50 border-zinc-100'
                        } border`} rows={4}>تم استلام طلبك بنجاح! كود التفعيل الخاص بك هو: [كود_الكرت]. نتمنى لك استمتاعاً بخدماتنا.</textarea>
                    </div>
                </div>
            </section>
        </div>
    </div>
)

const ToggleItem = ({ label, desc, defaultOn = false, theme }: { label: string; desc: string; defaultOn?: boolean; theme: 'dark'|'light' }) => (
    <div className="flex items-center justify-between group">
        <div className="space-y-1">
            <p className="text-sm font-extrabold italic group-hover:text-blue-600 transition-colors">{label}</p>
            <p className="text-[10px] opacity-40 font-bold leading-tight max-w-[240px]">{desc}</p>
        </div>
        <button className={`w-14 h-7 rounded-full transition-all duration-500 relative p-1 ${
          defaultOn 
            ? (theme === 'dark' ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'bg-blue-600 shadow-lg shadow-blue-500/20') 
            : 'bg-zinc-200 dark:bg-white/10'
        }`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-xl transition-all duration-500 transform ${defaultOn ? 'translate-x-7' : 'translate-x-0'}`} />
        </button>
    </div>
)

const StatCard = ({ label, value, unit, icon, theme }: { label: string; value: string; unit: string; icon: React.ReactNode; theme: 'dark'|'light' }) => (
  <div className={`p-4 md:p-8 border rounded-2xl md:rounded-[32px] transition-all hover:scale-[1.02] duration-500 group ${
    theme === 'dark' ? 'bg-[#111112] border-white/5 shadow-2xl shadow-blue-500/5' : 'bg-white border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.03)]'
  }`}>
    <div className="flex justify-between items-start mb-4 md:mb-6">
      <p className="text-[8px] md:text-[10px] font-black font-mono uppercase tracking-[0.2em] opacity-30 italic leading-tight group-hover:opacity-60 transition-opacity">{label}</p>
      <div className={`p-2 rounded-xl md:rounded-2xl transition-all duration-500 ${theme === 'dark' ? 'bg-white/5 group-hover:bg-blue-600/20' : 'bg-slate-50 group-hover:bg-blue-50'}`}>{icon}</div>
    </div>
    <div className="flex items-baseline gap-1 md:gap-2">
      <span className="text-2xl md:text-5xl font-extrabold font-mono tracking-tighter leading-none group-hover:scale-105 transition-transform origin-left duration-500">{value}</span>
      <span className="text-[10px] font-black font-mono opacity-30 uppercase italic">{unit}</span>
    </div>
  </div>
);

export default App;
