// @ts-nocheck
'use client';
import React, { useEffect, useState } from 'react';
import {
  Search, Mic, Camera, MapPin, AlertCircle, X, Plus,
  Bookmark, MessageCircle, Share2, FileText, FileDown, Star, Users as UsersIcon, Package, User, Store,
  FolderOpen, PlusCircle, CheckCircle, Shield, Eye, Lock, MessageSquare, Send, Upload, Database, Folder, Trash2, Image as ImageIcon, BarChart, TrendingUp, Server
} from 'lucide-react';

// LocalStorage helpers
export const safeGet = (key: string, fallback: any) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};
export const safeSet = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
};

// Small Avatar
export const Avatar = ({ src, name, size = 40, userId = null }: { src?: string, name?: string, size?: number, userId?: string | null }) => {
  const [isOnline, setIsOnline] = useState(false);
  
  useEffect(() => {
    if(!userId) return;
    const checkStatus = () => {
      const users = safeGet('bme_users', []);
      const user = users.find((u:any) => u.id === userId);
      if(user) setIsOnline(user.isOnline);
    };
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  const StatusDot = () => isOnline ? <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full z-10"></span> : null;

  if (src) {
    return (
      <div className="relative inline-block">
        <img src={src} alt={name || 'avatar'} onError={(e)=>{ (e.target as any).src = `https://i.pravatar.cc/150?u=${name||'bme'}` }} style={{ width: size, height: size }} className="rounded-full object-cover relative z-0" />
        <StatusDot />
      </div>
    );
  }
  return (
    <div className="relative inline-block">
      <div style={{ width: size, height: size }} className="rounded-full bg-gray-200 flex items-center justify-center text-gray-600"><User size={Math.max(12, Math.floor(size/3))} /></div>
      <StatusDot />
    </div>
  );
};

// =========================
// Custom Toast System
// =========================
export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bme-toast', { detail: { message, type } }));
  }
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<any[]>([]);
  useEffect(() => {
    const handler = (e: any) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, ...e.detail }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000); // Tự động ẩn sau 3s
    };
    window.addEventListener('bme-toast', handler);
    return () => window.removeEventListener('bme-toast', handler);
  }, []);
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3.5 rounded-lg shadow-2xl border-l-4 bg-white pointer-events-auto transition-all transform animate-fade-in ${t.type === 'error' ? 'border-red-500 text-red-700' : t.type === 'success' ? 'border-green-500 text-green-700' : 'border-blue-500 text-blue-700'}`}>
          {t.type === 'error' ? <AlertCircle size={20} className="text-red-500" /> : t.type === 'success' ? <CheckCircle size={20} className="text-green-500" /> : <AlertCircle size={20} className="text-blue-500" />}
          <p className="font-semibold text-sm">{t.message}</p>
        </div>
      ))}
    </div>
  );
};

// =========================
// Login / Register Modal
// =========================
export const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [role, setRole] = useState('user');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cccd, setCccd] = useState('');
  const [taxId, setTaxId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(()=>{ 
    if(!isOpen){ 
      setIsLoginMode(true); setPhone(''); setPassword(''); setCccd(''); setTaxId(''); setRole('user'); setErrorMsg(''); 
    } 
  },[isOpen]);
  
  if(!isOpen) return null;

  const handleSubmit = () => {
    setErrorMsg('');
    if(!phone.trim() || !password.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ Số điện thoại và Mật khẩu');
      return;
    }
    const users: any[] = safeGet('bme_users', []);
    const found = users.find(u=>u.phone===phone);
    if(found){
      if(found.password !== password) {
        setErrorMsg('Sai mật khẩu! Vui lòng thử lại.');
        return;
      }
      if(found.status === 'Banned' || found.status === 'locked') {
        setErrorMsg('Tài khoản của bạn đã bị khóa do vi phạm tiêu chuẩn cộng đồng');
        return;
      }
      
      // Cập nhật trạng thái Online thời gian thực cho tài khoản đang Login
      const nextUsers = users.map(u => u.id === found.id ? { ...u, isOnline: true, lastActive: Date.now() } : u);
      safeSet('bme_users', nextUsers);
      
      const loggedUser = nextUsers.find(u => u.id === found.id);
      safeSet('bme_current_user', loggedUser);
      onLogin && onLogin(loggedUser);
      showToast('Đăng nhập thành công', 'success');
      onClose();
      return;
    }
    if(isLoginMode) {
      setErrorMsg('Tài khoản không tồn tại. Vui lòng đăng ký!');
      return;
    }
    if(!cccd.trim() && role !== 'user') {
      setErrorMsg('Vui lòng nhập CCCD');
      return;
    }
    const newUser = { id:`u_${Date.now()}`, name: `${phone.slice(-4)} (${role==='business'?'Doanh nghiệp': role==='coordinator'?'Chuyên gia':'Người dùng'})`, phone, password, cccd, taxId: taxId||null, role, status: (role==='business'||role==='coordinator')? 'pending' : 'active', createdAt: new Date().toISOString(), isOnline: true, lastActive: Date.now() };
    users.push(newUser); safeSet('bme_users', users);
    if(newUser.status === 'active'){ safeSet('bme_current_user', newUser); onLogin && onLogin(newUser); }
    showToast(`Đăng ký thành công. Trạng thái: ${ newUser.status==='pending' ? 'Chờ duyệt' : 'Đã duyệt' }`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute right-3 top-3 text-gray-500"><X /></button>
        <h3 className="text-xl font-bold text-bme-primary mb-4">{isLoginMode ? 'Đăng nhập vào hệ thống' : 'Đăng ký tài khoản mới'}</h3>
        
        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded-r-md">
            <p className="text-red-700 text-sm font-semibold">{errorMsg}</p>
          </div>
        )}

        <div className="space-y-3">
          {!isLoginMode && (
            <div className="flex gap-2 mb-2">
              <button onClick={()=>setRole('user')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${role==='user'?'bg-bme-primary text-white shadow':'bg-gray-100 text-gray-600'}`}>Cá nhân</button>
              <button onClick={()=>setRole('business')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${role==='business'?'bg-bme-primary text-white shadow':'bg-gray-100 text-gray-600'}`}>Doanh nghiệp</button>
              <button onClick={()=>setRole('coordinator')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${role==='coordinator'?'bg-bme-primary text-white shadow':'bg-gray-100 text-gray-600'}`}>Chuyên gia</button>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
            <input className="w-full p-2.5 border rounded-lg outline-none focus:ring-1 focus:ring-bme-primary bg-white transition" placeholder="Nhập số điện thoại" value={phone} onChange={e=>{setPhone(e.target.value); setErrorMsg('');}} />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu</label>
            <input type="password" className="w-full p-2.5 border rounded-lg outline-none focus:ring-1 focus:ring-bme-primary bg-white transition" placeholder="Nhập mật khẩu" value={password} onChange={e=>{setPassword(e.target.value); setErrorMsg('');}} />
          </div>

          {!isLoginMode && (
            <>
              <input className="w-full p-2.5 border rounded-lg bg-white mt-1" placeholder="CCCD" value={cccd} onChange={e=>setCccd(e.target.value)} />
              {(role==='business' || role==='coordinator') && <input className="w-full p-2.5 border rounded-lg bg-white mt-1" placeholder="MST / Chứng chỉ nghề" value={taxId} onChange={e=>setTaxId(e.target.value)} /> }
            </>
          )}
          <div className="flex gap-2 mt-4 pt-2">
            <button className="flex-1 bg-bme-primary text-white py-2.5 rounded-lg font-bold hover:bg-bme-secondary shadow transition" onClick={handleSubmit}>{isLoginMode ? 'Đăng nhập' : 'Đăng ký'}</button>
            <button className="flex-1 border border-gray-300 rounded-lg py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition" onClick={() => { setIsLoginMode(!isLoginMode); setErrorMsg(''); }}>{isLoginMode ? 'Đăng ký mới' : 'Quay lại Đăng nhập'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================
// OCR Modal (simple)
// =========================
export const OcrSearchModal = ({ isOpen, onClose }) => {
  const [img, setImg] = useState(null);
  const [results, setResults] = useState(null);
  if(!isOpen) return null;
  const handle = (e)=>{
    const f = e.target.files?.[0]; if(!f) return; const r = new FileReader(); r.onload = (ev)=>{ setImg(ev.target.result); setTimeout(()=>setResults({ text: 'E-405 ERROR', confidence: 92 }), 1200); }; r.readAsDataURL(f);
  };
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-xl p-6">
        <div className="flex justify-between items-center"><h4 className="font-bold text-bme-primary">Tìm bằng hình ảnh</h4><button onClick={onClose}><X /></button></div>
        <div className="mt-4">
          {!img ? (
            <label className="block p-6 border-dashed border rounded text-center cursor-pointer">
              <input className="hidden" type="file" accept="image/*" onChange={handle} />
              <Camera className="mx-auto text-bme-primary" size={40} />
              <p className="mt-2">Chọn ảnh mã lỗi / linh kiện</p>
            </label>
          ) : (
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="ocr" className="mx-auto max-h-48 object-contain" />
              {results && <pre className="mt-3 bg-gray-50 p-3 rounded">{JSON.stringify(results,null,2)}</pre>}
              <div className="mt-3 flex gap-2"><button className="px-3 py-2 border rounded" onClick={()=>{ setImg(null); setResults(null); }}>Tải ảnh khác</button><button className="px-3 py-2 bg-bme-primary text-white rounded" onClick={onClose}>Đóng</button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// =========================
// Home Feed
// =========================
export const HomeFeed = ({ searchQuery = '', currentUser = null, savedOnly = false }: { searchQuery?: string, currentUser?: any, savedOnly?: boolean }) => {
  const [posts, setPosts] = useState<any[]>(()=> safeGet('bme_posts', []));
  const [allGroupPosts, setAllGroupPosts] = useState<any[]>([]);
  const [usersData, setUsersData] = useState<any[]>(() => safeGet('bme_users', []));
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [expanded, setExpanded] = useState<any>({});
  const [filter, setFilter] = useState('all');
  const [attachment, setAttachment] = useState<any>(null);

  useEffect(() => {
    const fetchPosts = () => {
      setPosts(safeGet('bme_posts', []));
      setUsersData(safeGet('bme_users', []));
      
      const comms = safeGet('bme_communities', []);
      let gPosts: any[] = [];
      if (Array.isArray(comms)) {
        comms.forEach((c: any) => {
          if (Array.isArray(c.groupPosts)) {
             c.groupPosts.forEach((gp: any) => {
               gPosts.push({ id: gp.id, authorId: gp.authorId, author: gp.author, avatar: gp.avatar || `https://i.pravatar.cc/150?u=${gp.authorId}`, time: gp.date, content: gp.text, attachment: gp.attachment, images: gp.attachment?.typeLabel === 'Image' ? [gp.attachment.base64] : [], category: `Nhóm: ${c.name}`, likes: 0, comments: 0, replies: [], status: 'active' });
             });
          }
        });
      }
      setAllGroupPosts(gPosts);
    };
    fetchPosts();
    const interval = setInterval(fetchPosts, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    const isImg = ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
    const isPdf = ext === 'pdf';
    const isDoc = ['doc', 'docx'].includes(ext);
    
    let path = '/storage/misc/';
    let typeLabel = 'OTHER';
    if (isImg) { path = '/storage/images/'; typeLabel = 'Image'; }
    else if (isPdf) { path = '/storage/documents/pdf/'; typeLabel = 'PDF'; }
    else if (isDoc) { path = '/storage/documents/docs/'; typeLabel = 'DOCX'; }

    if (!isImg && !isPdf && !isDoc) {
      return showToast('Định dạng file không được hỗ trợ!', 'error');
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setAttachment({
        id: `file_${Date.now()}`,
        name: file.name,
        size: file.size,
        ext,
        path,
        typeLabel,
        base64: ev.target.result,
        timestamp: new Date().toLocaleString()
      });
    };
    reader.readAsDataURL(file);
    // Clear input
    e.target.value = null;
  };

  const createPost = async () => {
    if(!content.trim() && !attachment) return showToast('Vui lòng nhập nội dung hoặc đính kèm file', 'error');
    
    if (attachment) {
      const globalStorage = safeGet('bme_storage', []);
      safeSet('bme_storage', [...globalStorage, { ...attachment, uploaderId: currentUser?.id }]);
    }

    const newPost = { 
      id: `p_${Date.now()}`, 
      authorId: currentUser?.id, 
      author: currentUser?.name||'Ẩn danh', 
      avatar: currentUser?.avatar||`https://i.pravatar.cc/150?u=${Date.now()}`, 
      time: new Date().toLocaleString(), 
      content, 
      attachment,
      images: attachment?.typeLabel === 'Image' ? [attachment.base64] : [], 
      category, likes:0, comments:0, replies:[], status: 'active' 
    };
    
    const next = [newPost, ...posts]; setPosts(next); safeSet('bme_posts', next);
    setContent(''); setCategory('Tất cả'); setAttachment(null);
  };
  const addComment = (id, text)=>{ if(!text.trim()) return; const next = posts.map(p=> p.id===id?{...p, replies:[...(p.replies||[]), { id:`r_${Date.now()}`, authorId: currentUser?.id, author: currentUser?.name||'Ẩn danh', text, time: new Date().toLocaleString() }], comments:(p.comments||0)+1}:p); setPosts(next); safeSet('bme_posts', next); };

  const currentUserData = usersData.find((u: any) => u.phone === currentUser?.phone) || currentUser;
  const savedPostIds = currentUserData?.savedPostIds || [];

  const toggleSave = (id: string) => {
    if (!currentUser) return showToast('Vui lòng đăng nhập để lưu bài viết', 'error');
    const allUsers = safeGet('bme_users', []);
    const userIndex = allUsers.findIndex((u: any) => u.phone === currentUser.phone);
    if (userIndex === -1) return;
    
    const user = allUsers[userIndex];
    let newSavedPostIds = user.savedPostIds || [];
    if (newSavedPostIds.includes(id)) {
      newSavedPostIds = newSavedPostIds.filter((savedId: string) => savedId !== id);
      showToast('Đã bỏ lưu bài viết', 'info');
    } else {
      newSavedPostIds.push(id);
      showToast('Đã lưu bài viết vào Mục đã lưu', 'success');
    }
    allUsers[userIndex] = { ...user, savedPostIds: newSavedPostIds };
    safeSet('bme_users', allUsers);
    setUsersData(allUsers);
  };

  const combinedPosts = savedOnly ? [...posts, ...allGroupPosts] : posts;

  const visible = combinedPosts.filter(post => {
    if (post.status === 'locked') return false;
    if (savedOnly) return savedPostIds.includes(post.id);
    if (filter !== 'all' && post.category !== filter) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return post.content.toLowerCase().includes(query) || post.author.toLowerCase().includes(query) || post.category.toLowerCase().includes(query);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <aside className="lg:col-span-3">
        <div className="bg-white p-4 rounded shadow sticky top-20">
          <h4 className="font-bold mb-3">{savedOnly ? 'Quản lý Lưu trữ' : 'Danh mục'}</h4>
          {savedOnly ? (
            <p className="text-sm text-gray-600">Bạn đang xem danh sách các bài viết và tài liệu đã lưu. Bạn có thể bấm bỏ lưu để xóa khỏi danh sách.</p>
          ) : (
            ['Tất cả','Chẩn đoán','Hồi sức','Linh kiện','X-ray'].map(c => (
              <button key={c} onClick={() => setFilter(c === 'Tất cả' ? 'all' : c)} className={`w-full text-left py-2 px-3 rounded mb-1 transition ${filter === (c === 'Tất cả' ? 'all' : c) ? 'bg-bme-primary text-white shadow' : 'hover:bg-blue-50 text-gray-700'}`}>
                {c}
              </button>
            ))
          )}
        </div>
      </aside>

      <main className="lg:col-span-6 space-y-4">
        {!savedOnly && (
          <div className="bg-white p-4 rounded shadow">
          <div className="flex gap-3">
            <Avatar src={currentUser?.avatar} name={currentUser?.name} size={48} userId={currentUser?.id} />
            <div className="flex-1">
              <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full p-2 border rounded mb-2" placeholder="Bạn muốn chia sẻ gì?" />
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <select value={category} onChange={e => setCategory(e.target.value)} className="p-2 border rounded text-sm">
                    <option>Chẩn đoán</option>
                    <option>Hồi sức</option>
                    <option>Linh kiện</option>
                    <option>X-ray</option>
                  </select>
                  <input type="file" id="feed-upload" className="hidden" accept=".jpg,.png,.pdf,.doc,.docx" onChange={handleFileChange} />
                  <button onClick={() => document.getElementById('feed-upload')?.click()} className="flex items-center gap-1 text-sm hover:text-blue-600 bg-gray-50 px-3 py-2 border rounded transition"><ImageIcon size={16}/> Đính kèm File</button>
                </div>
                <button onClick={createPost} className="bg-bme-primary text-white px-4 py-2 rounded">Đăng bài</button>
              </div>
              {attachment && (
                <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded-lg flex justify-between items-center text-sm shadow-sm animate-fade-in"><span className="truncate max-w-[80%] font-semibold text-bme-primary flex items-center gap-2">{attachment.typeLabel === 'Image' ? <ImageIcon size={16}/> : <FileText size={16}/>} {attachment.name} ({attachment.typeLabel})</span><button onClick={() => setAttachment(null)} className="text-red-500 hover:text-red-700 font-bold bg-white px-2 py-0.5 rounded">Xóa</button></div>
              )}
            </div>
          </div>
          </div>
        )}

        {visible.length === 0 && (
          <div className="bg-white p-10 rounded shadow text-center border border-dashed border-gray-300">
            <span className="text-5xl block mb-3 opacity-50">📭</span>
            <p className="font-bold text-gray-600 text-lg">Chưa có bài viết nào.</p>
            <p className="text-sm text-gray-500 mt-1">Hãy là người đầu tiên chia sẻ hoặc điều chỉnh lại bộ lọc tìm kiếm!</p>
          </div>
        )}

        {visible.map(post => (
          <article key={post.id} className="bg-white rounded shadow overflow-hidden">
            <div className="p-4 flex items-start gap-3 border-b">
              <Avatar src={post.avatar} name={post.author} size={48} userId={post.authorId} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold hover:text-bme-primary cursor-pointer transition" onClick={() => document.dispatchEvent(new CustomEvent('viewProfile', {detail: post.authorId}))}>{post.author}</p>
                    <p className="text-xs text-gray-500">{post.time}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{post.category}</span>
                </div>
                <p className="mt-3 text-gray-800">{post.content}</p>
                
                {post.attachment && post.attachment.typeLabel !== 'Image' && (
                  <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3 cursor-pointer hover:border-bme-primary transition group">
                    <div className={`p-2 rounded-lg ${post.attachment.typeLabel === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}><FileText size={24} /></div>
                    <div className="flex-1"><p className="font-bold text-sm text-gray-800 group-hover:text-bme-primary transition">{post.attachment.name}</p><p className="text-xs text-gray-500">{post.attachment.typeLabel} • {Math.round((post.attachment.size || 0)/1024)} KB</p></div>
                  </div>
                )}
                {post.images && post.images.length > 0 && (
                  <div className="mt-3"><img src={post.images[0]} alt="attachment" className="rounded-lg max-h-80 w-auto object-cover border border-gray-200" /></div>
                )}
              </div>
            </div>
            <div className="px-4 py-2 flex items-center gap-2 border-t">
              <button onClick={() => toggleSave(post.id)} className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition ${savedPostIds.includes(post.id) ? 'text-bme-primary font-bold' : 'text-gray-600'}`}><Bookmark size={16} fill={savedPostIds.includes(post.id) ? 'currentColor' : 'none'} /> {savedPostIds.includes(post.id) ? 'Đã lưu' : 'Lưu bài viết'}</button>
              <button onClick={() => setExpanded(s => ({ ...s, [post.id]: !s[post.id] }))} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"><MessageCircle size={16} /> {post.comments || 0}</button>
              <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"><Share2 size={16} /> Chia sẻ</button>
            </div>
            {expanded[post.id] && (
              <div className="p-3 bg-gray-50">
                <CommentsList replies={post.replies || []} />
                <CommentInput onAdd={text => addComment(post.id, text)} />
              </div>
            )}
          </article>
        ))}
      </main>

      <aside className="lg:col-span-3">
        <div className="bg-white p-4 rounded shadow sticky top-20">
          <h4 className="font-bold mb-2">Trạng thái</h4>
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Avatar src={currentUser.avatar} name={currentUser.name} size={48} userId={currentUser?.id} />
              <div>
                <p className="font-semibold">{currentUser.name}</p>
                <p className="text-sm text-gray-500">{currentUser.role}</p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">Bạn chưa đăng nhập</div>
          )}
          <button onClick={() => document.dispatchEvent(new CustomEvent('openMap'))} className="mt-4 w-full bg-red-600 text-white py-2 rounded">Khẩn cấp</button>
        </div>
      </aside>
    </div>
  );
};

const CommentInput = ({ onAdd }) => {
  const [text, setText] = useState('');
  return (
    <div className="flex gap-2 mt-3">
      <input className="flex-1 p-2 border rounded" placeholder="Viết bình luận..." value={text} onChange={e => setText(e.target.value)} />
      <button className="px-3 py-2 bg-bme-primary text-white rounded" onClick={() => { if (!text.trim()) return; onAdd(text); setText(''); }}>Gửi</button>
    </div>
  );
};

const CommentsList = ({ replies = [] }) => (
  <div className="space-y-3">
    {replies.map(reply => (
      <div key={reply.id} className="flex gap-2 p-3 bg-gray-50 rounded">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-bme-primary font-bold"><User size={16} /></div>
        <div className="flex-1">
          <p className="font-semibold text-sm hover:text-bme-primary cursor-pointer transition inline-block" onClick={() => reply.authorId && document.dispatchEvent(new CustomEvent('viewProfile', {detail: reply.authorId}))}>{reply.author}</p>
          <p className="text-sm text-gray-700">{reply.text}</p>
          <p className="text-xs text-gray-400 mt-1">{reply.time}</p>
        </div>
      </div>
    ))}
  </div>
);

// ------------------ MapView ------------------
export const MapView = () => {
  const [pingNote, setPingNote] = useState(null);
  const [techs, setTechs] = useState(() => {
    const users = safeGet('bme_users', []);
    return users.filter(u => u.role === 'coordinator' && u.status === 'active');
  }); 
  useEffect(()=>{ const h=()=>{}; window.addEventListener('openMap', h); return ()=>window.removeEventListener('openMap', h); },[]);
  const ping = tech => { setPingNote(`Đã gửi ping tới ${tech.name}`); setTimeout(()=>setPingNote(null),3000); };
  return (
    <div className="space-y-4">
      <div className="bg-red-600 text-white p-4 rounded flex items-center gap-3"><AlertCircle size={24}/><div><p className="font-bold">TÌM KIẾM KHẨN CẤP</p><p className="text-sm">Bản đồ mô phỏng</p></div></div>
      <div className="bg-white p-4 rounded shadow">
        <div className="relative h-72 bg-gradient-to-b from-blue-50 to-blue-100 rounded overflow-hidden">
          <svg viewBox="0 0 400 300" className="w-full h-full"><rect width="400" height="300" fill="#e6f2ff" />{techs.map((t,i)=>(<circle key={t.id} cx={60+i*110} cy={80+(i%2)*80} r={12} fill={'#16a34a'} />))}</svg>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {techs.length === 0 && <p className="col-span-3 text-center text-gray-500 italic">Không có kỹ thuật viên nào trực tuyến gần đây.</p>}
          {techs.map(t=> (<div key={t.id} className="p-3 border rounded flex items-start justify-between"><div><p className="font-semibold">{t.name}</p><p className="text-sm text-gray-500">{t.phone} • Chuyên gia</p></div><button onClick={()=>ping(t)} className="bg-red-600 text-white px-3 py-2 rounded">Ping</button></div>))}
        </div>
      </div>
      {pingNote && <div className="fixed bottom-4 right-4 bg-green-600 text-white p-3 rounded">{pingNote}</div>}
    </div>
  );
};

// ------------------ TinyCommunity ------------------
export const TinyCommunity = ({ currentUser, searchQuery = '' }: { currentUser?: any, searchQuery?: string }) => {
  const [communities, setCommunities] = useState(() => safeGet('bme_communities', []));
  const [users, setUsers] = useState(() => safeGet('bme_users', []));
  const [active, setActive] = useState(null);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'files'
  const [localSearch, setLocalSearch] = useState('');

  // States Form tạo nhóm
  const [newCommName, setNewCommName] = useState('');
  const [newCommDesc, setNewCommDesc] = useState('');
  const [newCommSpecialty, setNewCommSpecialty] = useState('');
  
  // State Form Đăng bài thảo luận
  const [newPostText, setNewPostText] = useState('');
  const [postAttachment, setPostAttachment] = useState<any>(null);

  // States Form Tải tài liệu
  const [commAttachment, setCommAttachment] = useState<any>(null);
  const [newFileDesc, setNewFileDesc] = useState('');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  useEffect(()=>{ const h=(e:any)=>setActive(e.detail); window.addEventListener('openCommunity', h); return ()=>window.removeEventListener('openCommunity', h); },[]);
  useEffect(() => {
    const fetchComm = () => { setCommunities(safeGet('bme_communities', [])); setUsers(safeGet('bme_users', [])); };
    fetchComm();
    const interval = setInterval(fetchComm, 3000);
    return () => clearInterval(interval);
  }, []);

  // Phân quyền: Chỉ Admin và Coordinator (Chuyên gia) mới có quyền quản trị tạo nhóm và tải tài liệu
  const isManager = currentUser?.role === 'admin' || currentUser?.role === 'coordinator';
  const isAdmin = currentUser?.role === 'admin';

  const handleCreateCommunity = () => {
    if(!newCommName.trim()) return showToast('Vui lòng nhập tên hội nhóm', 'error');
    const isAutoApproved = isAdmin || isManager;
    const newComm = { 
      id:`c_${Date.now()}`, name: newCommName, description: newCommDesc, specialty: newCommSpecialty, 
      membersCount: 1, members: [currentUser?.id], creatorId: currentUser?.id, pendingMembers: [],
      status: isAutoApproved ? 'Approved' : 'Pending_Approval',
      groupPosts: [], groupFiles: [], icon: '👥'
    };
    const next = [...communities, newComm]; setCommunities(next); safeSet('bme_communities', next);
    setNewCommName(''); setNewCommDesc(''); setNewCommSpecialty('');
    setActive(newComm.id);
    if (!isAutoApproved) showToast('Nhóm đã được tạo và đang chờ chuyên gia phê duyệt!', 'success');
    else showToast('Tạo nhóm thành công!', 'success');
  };

  const handleFileChange = (e: any, setAttachmentState: Function) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    const isImg = ['jpg', 'jpeg', 'png', 'gif'].includes(ext);
    const isPdf = ext === 'pdf';
    const isDoc = ['doc', 'docx'].includes(ext);
    
    let path = '/storage/misc/';
    let typeLabel = 'OTHER';
    if (isImg) { path = '/storage/images/'; typeLabel = 'Image'; }
    else if (isPdf) { path = '/storage/documents/pdf/'; typeLabel = 'PDF'; }
    else if (isDoc) { path = '/storage/documents/docs/'; typeLabel = 'DOCX'; }

    if (!isImg && !isPdf && !isDoc) return showToast('Định dạng file không được hỗ trợ!', 'error');

    const reader = new FileReader();
    reader.onload = (ev) => {
      setAttachmentState({ id: `file_${Date.now()}`, name: file.name, size: file.size, ext, path, typeLabel, base64: ev.target.result, timestamp: new Date().toLocaleString() });
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const handlePost = () => {
    if(!newPostText.trim() && !postAttachment) return showToast('Vui lòng nhập nội dung hoặc đính kèm', 'error');
    if(!active) return;
    
    if (postAttachment) {
      const globalStorage = safeGet('bme_storage', []);
      safeSet('bme_storage', [...globalStorage, { ...postAttachment, uploaderId: currentUser?.id }]);
    }

    const newPost = { id: `gp_${Date.now()}`, authorId: currentUser?.id, author: currentUser?.name || 'Ẩn danh', text: newPostText, date: new Date().toLocaleString(), attachment: postAttachment };
    const next = communities.map(c => c.id === active ? { ...c, groupPosts: [newPost, ...(c.groupPosts || [])] } : c);
    setCommunities(next); safeSet('bme_communities', next);
    setNewPostText(''); setPostAttachment(null);
  };

  const handleUploadFile = () => {
    if(!commAttachment || !active) return showToast('Vui lòng chọn tài liệu để tải lên', 'error');
    
    const globalStorage = safeGet('bme_storage', []);
    const newFile = { ...commAttachment, uploaderId: currentUser?.id, description: newFileDesc, uploadedBy: currentUser?.name || 'Quản trị viên', date: new Date().toLocaleDateString() };
    safeSet('bme_storage', [...globalStorage, newFile]);

    const next = communities.map(c => c.id === active ? { ...c, groupFiles: [newFile, ...(c.groupFiles || [])] } : c);
    setCommunities(next); safeSet('bme_communities', next);
    setCommAttachment(null); setNewFileDesc('');
  };

  const handleJoinRequest = () => {
    if(!currentUser) return showToast('Vui lòng đăng nhập', 'error');
    const activeComm = communities.find(c => c.id === active);
    if(activeComm?.pendingMembers?.includes(currentUser.id)) return;
    const next = communities.map(c => c.id === active ? { ...c, pendingMembers: [...(c.pendingMembers||[]), currentUser.id] } : c);
    setCommunities(next); safeSet('bme_communities', next);
    showToast('Đã gửi yêu cầu tham gia nhóm. Vui lòng chờ phê duyệt.', 'success');
  };

  const handleApproveMember = (pid: string) => {
    const next = communities.map(c => {
      if (c.id === active) return { ...c, pendingMembers: (c.pendingMembers||[]).filter((id:string) => id !== pid), members: [...(c.members || []), pid], membersCount: (c.membersCount || 1) + 1 };
      return c;
    });
    setCommunities(next); safeSet('bme_communities', next); showToast('Đã phê duyệt thành viên', 'success');
  };

  const handleRejectMember = (pid: string) => {
    const next = communities.map(c => c.id === active ? { ...c, pendingMembers: (c.pendingMembers||[]).filter((id:string) => id !== pid) } : c);
    setCommunities(next); safeSet('bme_communities', next); showToast('Đã từ chối thành viên', 'info');
  };

  const activeComm = communities.find(c => c.id === active);
  const isCreator = activeComm?.creatorId === currentUser?.id || isAdmin;
  const isMember = activeComm?.members?.includes(currentUser?.id) || isAdmin;
  const isPending = activeComm?.pendingMembers?.includes(currentUser?.id);
  
  const visibleCommunities = communities.filter((c: any) => 
    (c.status === 'Approved' || !c.status || c.status === undefined || c.creatorId === currentUser?.id || isAdmin) &&
    (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Logic tìm kiếm toàn văn trong một nhóm cụ thể
  const filteredPosts = (activeComm?.groupPosts || []).filter(p => p.text.toLowerCase().includes(localSearch.toLowerCase()) || p.author.toLowerCase().includes(localSearch.toLowerCase()));
  const filteredFiles = (activeComm?.groupFiles || []).filter(f => f.title.toLowerCase().includes(localSearch.toLowerCase()) || (f.description && f.description.toLowerCase().includes(localSearch.toLowerCase())));

  const currentUserData = users.find((u: any) => u.phone === currentUser?.phone) || currentUser;
  const savedPostIds = currentUserData?.savedPostIds || [];

  const toggleSave = (id: string) => {
    if (!currentUser) return showToast('Vui lòng đăng nhập để lưu bài viết', 'error');
    const allUsers = safeGet('bme_users', []);
    const userIndex = allUsers.findIndex((u: any) => u.phone === currentUser.phone);
    if (userIndex === -1) return;
    const user = allUsers[userIndex];
    let newSavedPostIds = user.savedPostIds || [];
    if (newSavedPostIds.includes(id)) { newSavedPostIds = newSavedPostIds.filter((savedId: string) => savedId !== id); showToast('Đã bỏ lưu bài viết', 'info'); }
    else { newSavedPostIds.push(id); showToast('Đã lưu bài viết vào Mục đã lưu', 'success'); }
    allUsers[userIndex] = { ...user, savedPostIds: newSavedPostIds };
    safeSet('bme_users', allUsers);
    setUsers(allUsers);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      {/* CỘT TRÁI: DANH SÁCH NHÓM */}
      <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-lg text-bme-primary flex items-center gap-2"><UsersIcon size={20}/> Các Hội Nhóm</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {visibleCommunities.length === 0 && <p className="text-gray-500 text-sm text-center py-8">Hệ thống chưa có hội nhóm nào.</p>}
          {visibleCommunities.map((c:any) => {
            const isJoined = c.members?.includes(currentUser?.id) || isAdmin || c.creatorId === currentUser?.id;
            return (
            <button key={c.id} onClick={() => { setActive(c.id); setLocalSearch(''); setActiveTab('posts'); }} className={`w-full text-left p-3 rounded-lg border transition block ${active === c.id ? 'border-bme-primary bg-blue-50' : 'border-transparent hover:bg-gray-50'}`}>
              <div className="flex justify-between items-start">
                <p className="font-bold text-gray-800">{c.name}</p>
                {isJoined && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold whitespace-nowrap ml-2">Đã tham gia</span>}
              </div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{c.specialty || 'Chung'} • {c.membersCount} thành viên {c.status==='Pending_Approval' && <span className="text-orange-500">(Chờ duyệt)</span>}</p>
            </button>
          )})}
        </div>
        {currentUser && (
          <div className="p-4 border-t bg-blue-50/50">
            <p className="font-bold text-sm text-bme-primary mb-3 flex items-center gap-2"><PlusCircle size={16}/> Tạo hội nhóm mới</p>
            <input value={newCommName} onChange={e=>setNewCommName(e.target.value)} placeholder="Tên nhóm (VD: Hội kỹ sư máy thở)..." className="w-full p-2 border border-gray-300 rounded-md mb-2 text-sm bg-white outline-none focus:border-bme-primary" />
            <input value={newCommSpecialty} onChange={e=>setNewCommSpecialty(e.target.value)} placeholder="Chuyên khoa ngách..." className="w-full p-2 border border-gray-300 rounded-md mb-2 text-sm bg-white outline-none focus:border-bme-primary" />
            <textarea value={newCommDesc} onChange={e=>setNewCommDesc(e.target.value)} placeholder="Mô tả nhóm..." rows={2} className="w-full p-2 border border-gray-300 rounded-md mb-3 text-sm bg-white outline-none focus:border-bme-primary resize-none" />
            <button onClick={handleCreateCommunity} className="w-full bg-bme-primary hover:bg-bme-secondary text-white py-2 rounded-md text-sm font-bold shadow-sm transition">Xác nhận tạo nhóm</button>
          </div>
        )}
      </div>

      {/* CỘT PHẢI: KHÔNG GIAN BÊN TRONG NHÓM */}
      <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
        {!activeComm ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <UsersIcon size={64} className="mb-4 opacity-20" />
            <p className="text-lg font-medium text-gray-500">Chọn một hội nhóm bên trái để xem nội dung</p>
            <p className="text-sm mt-2">Tham gia thảo luận và tìm kiếm tài liệu kỹ thuật chuyên sâu</p>
          </div>
        ) : (
          <>
            <div className="p-5 border-b bg-gradient-to-r from-bme-light/50 to-white">
              <h2 className="text-2xl font-bold text-bme-primary">{activeComm.name}</h2>
              <p className="text-gray-600 mt-1">{activeComm.description}</p>
              <div className="flex gap-3 mt-3 text-xs font-semibold text-gray-500">
                <span className="bg-white px-3 py-1 rounded-full border border-gray-200">🏷️ {activeComm.specialty || 'Đa khoa'}</span>
                <span className="bg-white px-3 py-1 rounded-full border border-gray-200">👥 {activeComm.membersCount} thành viên</span>
              </div>
            </div>

            {!isMember ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                <Lock size={48} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-700">Nhóm riêng tư</h3>
                <p className="text-gray-500 mt-2 mb-6">Bạn cần tham gia nhóm để xem các bài viết thảo luận và kho tài liệu.</p>
                {isPending ? (
                  <button disabled className="bg-gray-200 text-gray-500 px-6 py-2.5 rounded-lg font-bold shadow-sm cursor-not-allowed">Đang chờ trưởng nhóm duyệt...</button>
                ) : (
                  <button onClick={handleJoinRequest} className="bg-bme-primary hover:bg-bme-secondary text-white px-6 py-2.5 rounded-lg font-bold shadow-sm transition">Xin vào nhóm</button>
                )}
              </div>
            ) : (
            <>
            <div className="px-5 pt-4 border-b">
              <div className="relative mb-4">
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                <input value={localSearch} onChange={e=>setLocalSearch(e.target.value)} placeholder={`Tìm kiếm tài liệu, thảo luận trong ${activeComm.name}...`} className="w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-bme-primary focus:ring-1 ring-blue-100 border pl-10 pr-4 py-2 rounded-lg outline-none transition text-sm" />
              </div>
              <div className="flex gap-6">
                <button onClick={() => setActiveTab('posts')} className={`pb-3 font-bold text-sm transition border-b-2 ${activeTab === 'posts' ? 'border-bme-primary text-bme-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Thảo luận chung</button>
                <button onClick={() => setActiveTab('files')} className={`pb-3 font-bold text-sm transition border-b-2 ${activeTab === 'files' ? 'border-bme-primary text-bme-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Kho tài liệu</button>
                {isCreator && <button onClick={() => setActiveTab('members')} className={`pb-3 font-bold text-sm transition border-b-2 ${activeTab === 'members' ? 'border-bme-primary text-bme-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Duyệt thành viên {(activeComm.pendingMembers?.length || 0) > 0 && <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs ml-1">{activeComm.pendingMembers.length}</span>}</button>}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 bg-gray-50/50">
              {activeTab === 'posts' && (
                <div className="space-y-4">
                  {currentUser && (
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-bme-primary flex-shrink-0 font-bold">{currentUser?.name?.charAt(0) || 'U'}</div>
                      <div className="flex-1">
                        <textarea value={newPostText} onChange={e=>setNewPostText(e.target.value)} placeholder="Viết câu hỏi hoặc chia sẻ kỹ thuật vào nhóm..." rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-bme-primary rounded-lg outline-none resize-none text-sm transition" />
                        {postAttachment && <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded-lg flex justify-between items-center text-sm shadow-sm animate-fade-in"><span className="truncate max-w-[80%] font-semibold text-bme-primary flex items-center gap-2">{postAttachment.typeLabel === 'Image' ? <ImageIcon size={16}/> : <FileText size={16}/>} {postAttachment.name}</span><button onClick={() => setPostAttachment(null)} className="text-red-500 font-bold">Xóa</button></div>}
                        <div className="flex justify-between items-center mt-2">
                          <div><input type="file" id="group-post-file" className="hidden" accept=".jpg,.png,.pdf,.doc,.docx" onChange={e => handleFileChange(e, setPostAttachment)} /><button onClick={()=>document.getElementById('group-post-file')?.click()} className="text-sm font-semibold text-gray-500 hover:text-bme-primary flex items-center gap-1"><ImageIcon size={16}/> Đính kèm</button></div>
                          <button onClick={handlePost} className="bg-bme-primary hover:bg-bme-secondary text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition">Đăng bài</button>
                        </div>
                      </div>
                    </div>
                  )}
                  {filteredPosts.length === 0 && <p className="text-center text-gray-500 text-sm mt-8">Chưa có bài thảo luận nào phù hợp.</p>}
                  {filteredPosts.map(p => (
                    <div key={p.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-start mb-2"><div className="font-bold text-gray-800 hover:text-bme-primary cursor-pointer transition inline-block" onClick={() => p.authorId && document.dispatchEvent(new CustomEvent('viewProfile', {detail: p.authorId}))}>{p.author}</div><div className="text-xs font-medium text-gray-400">{p.date}</div></div>
                      <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{p.text}</p>
                      {p.attachment && p.attachment.typeLabel === 'Image' && <img src={p.attachment.base64} alt="post" className="mt-3 rounded max-h-64 object-cover border border-gray-200" />}
                      {p.attachment && p.attachment.typeLabel !== 'Image' && <div className="mt-3 p-2 bg-gray-50 border rounded flex items-center gap-2"><FileText size={20} className={p.attachment.typeLabel === 'PDF' ? 'text-red-500' : 'text-blue-500'} /><div className="flex-1"><p className="font-semibold text-sm">{p.attachment.name}</p><p className="text-xs text-gray-500">{p.attachment.typeLabel} • {Math.round(p.attachment.size/1024)} KB</p></div></div>}
                      <div className="mt-3 pt-2 border-t flex gap-2">
                        <button onClick={() => toggleSave(p.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition hover:bg-gray-50 ${savedPostIds.includes(p.id) ? 'text-bme-primary font-bold' : 'text-gray-500'}`}>
                          <Bookmark size={16} fill={savedPostIds.includes(p.id) ? 'currentColor' : 'none'} /> {savedPostIds.includes(p.id) ? 'Đã lưu' : 'Lưu bài viết'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'files' && (
                <div className="space-y-4">
                  {isManager && (
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 shadow-sm">
                      <p className="font-bold text-sm text-bme-primary mb-3 flex items-center gap-2"><FolderOpen size={16}/> Tải tài liệu mới lên kho (Asset Storage)</p>
                      <div className="flex flex-col md:flex-row gap-3 mb-3 items-start md:items-center">
                        <input type="file" id="comm-upload-file" className="hidden" accept=".jpg,.png,.pdf,.doc,.docx" onChange={e => handleFileChange(e, setCommAttachment)} />
                        <button onClick={() => document.getElementById('comm-upload-file')?.click()} className="bg-white border border-gray-300 text-gray-700 hover:text-bme-primary px-4 py-2 rounded text-sm font-semibold transition flex items-center gap-2 shadow-sm whitespace-nowrap"><Upload size={16}/> Chọn tệp từ máy tính</button>
                        {commAttachment && <span className="text-sm font-bold text-bme-primary flex-1 truncate bg-white px-3 py-2 rounded border border-blue-100 flex items-center justify-between">📎 {commAttachment.name} <button onClick={()=>setCommAttachment(null)} className="text-red-500 font-bold ml-2">X</button></span>}
                      </div>
                      <input value={newFileDesc} onChange={e=>setNewFileDesc(e.target.value)} placeholder="Mô tả nội dung tài liệu..." className="w-full p-2 border border-gray-300 rounded bg-white text-sm outline-none focus:border-bme-primary mb-3" />
                      <div className="flex justify-end"><button onClick={handleUploadFile} disabled={!commAttachment} className={`px-5 py-2 rounded text-sm font-bold shadow-sm flex items-center gap-2 transition ${commAttachment ? 'bg-bme-secondary hover:bg-bme-primary text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}><FileDown size={16}/> Đăng tài liệu</button></div>
                    </div>
                  )}
                  
                  {/* Folder Structure View */}
                  {!currentFolder ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 animate-fade-in">
                      <div onClick={() => setCurrentFolder('/storage/images/')} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-bme-primary hover:shadow-md cursor-pointer transition flex flex-col items-center gap-3 text-center group">
                        <Folder size={56} className="text-blue-500 fill-blue-50 group-hover:scale-110 transition-transform" />
                        <div><p className="font-bold text-gray-800">Hình ảnh</p><p className="text-xs text-gray-500 mt-1 font-medium bg-gray-100 px-2 py-0.5 rounded">.jpg, .png</p></div>
                      </div>
                      <div onClick={() => setCurrentFolder('/storage/documents/pdf/')} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-bme-primary hover:shadow-md cursor-pointer transition flex flex-col items-center gap-3 text-center group">
                        <Folder size={56} className="text-red-500 fill-red-50 group-hover:scale-110 transition-transform" />
                        <div><p className="font-bold text-gray-800">Tài liệu PDF</p><p className="text-xs text-gray-500 mt-1 font-medium bg-gray-100 px-2 py-0.5 rounded">.pdf</p></div>
                      </div>
                      <div onClick={() => setCurrentFolder('/storage/documents/docs/')} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-bme-primary hover:shadow-md cursor-pointer transition flex flex-col items-center gap-3 text-center group">
                        <Folder size={56} className="text-indigo-500 fill-indigo-50 group-hover:scale-110 transition-transform" />
                        <div><p className="font-bold text-gray-800">File Word</p><p className="text-xs text-gray-500 mt-1 font-medium bg-gray-100 px-2 py-0.5 rounded">.doc, .docx</p></div>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                      <button onClick={() => setCurrentFolder(null)} className="mb-4 text-sm font-bold text-gray-500 hover:text-bme-primary flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 transition">← Quay lại danh mục thư mục</button>
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200 shadow-sm"><FolderOpen size={20} className="text-bme-primary"/> Thư mục: {currentFolder}</h4>
                      <div className="grid gap-3">
                        {filteredFiles.filter(f => f.path === currentFolder).length === 0 && <p className="text-center text-gray-500 text-sm py-10 bg-white border-2 border-dashed border-gray-200 rounded-xl font-medium">Thư mục này hiện đang trống.</p>}
                        {filteredFiles.filter(f => f.path === currentFolder).map(f => (
                          <div key={f.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:border-bme-primary transition group cursor-pointer">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${f.typeLabel === 'PDF' ? 'bg-red-50 text-red-500' : f.typeLabel === 'Image' ? 'bg-green-50 text-green-500' : 'bg-indigo-50 text-indigo-500'}`}>
                              {f.typeLabel === 'Image' ? <ImageIcon size={24} /> : <FileText size={24} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-800 truncate text-base">{f.name || f.title}</p>
                              <p className="text-sm text-gray-500 truncate mt-0.5">{f.description}</p>
                              <div className="flex gap-2 mt-1.5 text-xs font-semibold text-gray-400"><span>Bởi: {f.uploadedBy}</span><span>•</span><span>{Math.round((f.size || 0)/1024)} KB</span><span>•</span><span>{f.date}</span></div>
                            </div>
                            {f.typeLabel === 'Image' && <img src={f.base64} alt="thumb" className="w-12 h-12 object-cover rounded shadow-sm opacity-50 group-hover:opacity-100 transition" />}
                            <button className="bg-gray-100 hover:bg-bme-primary hover:text-white text-gray-600 px-4 py-2 rounded-lg text-sm font-bold transition opacity-0 group-hover:opacity-100 ml-2 shadow-sm">Mở</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'members' && isCreator && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-800 border-b pb-2">Yêu cầu tham gia ({(activeComm.pendingMembers?.length || 0)})</h3>
                  {(!activeComm.pendingMembers || activeComm.pendingMembers.length === 0) && <p className="text-gray-500 text-sm">Chưa có yêu cầu nào.</p>}
                  {activeComm.pendingMembers?.map((pid: string) => {
                    const u = users.find((user:any) => user.id === pid);
                    if(!u) return null;
                    return (
                      <div key={pid} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar src={u.avatar} name={u.name} size={40} userId={u.id} />
                          <div>
                            <p className="font-bold text-gray-800">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.role} • {u.phone}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleApproveMember(pid)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm transition">Chấp nhận</button>
                          <button onClick={() => handleRejectMember(pid)} className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-1.5 rounded-lg text-sm font-bold transition">Từ chối</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ------------------ StoreProfile ------------------
export const StoreProfile = ({ currentUser = null, searchQuery = '', viewingStoreId = null, setViewingStoreId = (id: string | null) => {} }: { currentUser?: any, searchQuery?: string, viewingStoreId?: string | null, setViewingStoreId?: (id: string | null) => void }) => {
  const [stores, setStores] = useState(()=> safeGet('bme_stores', []));
  const [users, setUsers] = useState(()=> safeGet('bme_users', []));
  const [feedbacks, setFeedbacks] = useState(()=> safeGet('bme_feedbacks', []));
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreDesc, setNewStoreDesc] = useState('');
  const [newStoreAddress, setNewStoreAddress] = useState('');
  const [newStorePhone, setNewStorePhone] = useState('');
  
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdCat, setNewProdCat] = useState('');
  const [newProdStock, setNewProdStock] = useState('10'); // Hàng tồn kho
  const [orders, setOrders] = useState(()=> safeGet('bme_orders', []));
  const [storeTab, setStoreTab] = useState('products'); // 'products' | 'orders'

  useEffect(()=>{ const r=()=>{setStores(safeGet('bme_stores', [])); setOrders(safeGet('bme_orders', [])); setUsers(safeGet('bme_users', []));}; window.addEventListener('bme-refresh-stores', r); return ()=>window.removeEventListener('bme-refresh-stores', r); },[]);
  useEffect(()=>{ const int = setInterval(()=>{ setOrders(safeGet('bme_orders', [])); setUsers(safeGet('bme_users', [])); }, 3000); return ()=>clearInterval(int); },[]);

  const updateOrderStatus = (oid: string, status: string) => {


    const order = orders.find((o:any) => o.id === oid);
    if (!order) return;

    // THUẬT TOÁN 2: Chỉ trừ kho thực tế khi Business chuyển trạng thái từ "Chờ xác nhận" sang "Đang giao hàng" hoặc "Đã hoàn thành"
    if (order.status === 'Chờ xác nhận' && (status === 'Đang giao hàng' || status === 'Đã hoàn thành')) {
      let currentStores = safeGet('bme_stores', []);
      let enoughStock = true;

      // Validation: Quét qua tất cả sản phẩm trong đơn để đảm bảo kho hiện tại vẫn đáp ứng đủ
      order.items.forEach((item: any) => {
        const store = currentStores.find((s:any) => s.id === order.storeId);
        const prod = store?.products?.find((p:any) => p.id === item.id);
        if (!prod || prod.stock < item.qty) enoughStock = false;
      });

      if (!enoughStock) {
        return showToast('Không thể chấp nhận đơn hàng do số lượng hàng trong kho không đủ!', 'error');
      }

      // Thực hiện giảm kho vì hàng đã đủ
      currentStores = currentStores.map((s:any) => {
        if (s.id === order.storeId) {
          s.products = (s.products || []).map((p:any) => {
            const orderedItem = order.items.find((i:any) => i.id === p.id);
            if (orderedItem) p.stock -= orderedItem.qty;
            return p;
          });
        }
        return s;
      });

      // Cập nhật lại kho toàn cục và Dispatch event cho mọi người dùng
      safeSet('bme_stores', currentStores);
      setStores(currentStores);
      window.dispatchEvent(new CustomEvent('bme-refresh-stores'));
    }

    const next = orders.map((o:any) => o.id === oid ? {...o, status} : o);
    setOrders(next); safeSet('bme_orders', next); showToast('Cập nhật trạng thái đơn hàng thành công', 'success');
  };

  const leave = (storeId)=>{
    if(!comment.trim()) return showToast('Vui lòng nhập bình luận', 'error');
    const fb = { id:`fb_${Date.now()}`, storeId, userId:null, author:'Ẩn danh', rating, comment, date:'vừa xong', avatar:`https://i.pravatar.cc/150?u=${Date.now()}` };
    const next = [fb, ...feedbacks]; setFeedbacks(next); safeSet('bme_feedbacks', next);
    const updated = stores.map(s=> s.id===storeId? {...s, feedback_count:(s.feedback_count||0)+1, rating: Math.round((((s.rating||5)*(s.feedback_count||0))+rating)/((s.feedback_count||0)+1)*10)/10 }:s);
    setStores(updated); safeSet('bme_stores', updated); setComment(''); setRating(5);
  };

  const createStore = () => {
    if(!newStoreName.trim()) return showToast('Vui lòng nhập tên cửa hàng', 'error');
    const newStore = { id: `s_${Date.now()}`, ownerId: currentUser?.id, name: newStoreName, description: newStoreDesc, address: newStoreAddress, phone: newStorePhone, status: 'online', rating: 5, feedback_count: 0, products: [] };
    const next = [...stores, newStore];
    setStores(next); safeSet('bme_stores', next);
    setViewingStoreId(newStore.id);
  };

  const addProduct = () => {
    if(!newProdName.trim()) return showToast('Vui lòng nhập tên sản phẩm', 'error');
    const product = { id: `prod_${Date.now()}`, name: newProdName, price: Number(newProdPrice)||0, desc: newProdDesc, cat: newProdCat, stock: Number(newProdStock)||0 };
    const next = stores.map(s => s.id === viewingStoreId ? {...s, products: [...(s.products||[]), product]} : s);
    setStores(next); safeSet('bme_stores', next);
    setNewProdName(''); setNewProdPrice(''); setNewProdDesc(''); setNewProdCat(''); setNewProdStock('10');
  };

  // KẾT HỢP BIỆN PHÁP BẢO VỆ CHỐNG CRASH KHI GIAN HÀNG KHÔNG TỒN TẠI
  let activeStore = stores.find((s:any) => s.id === viewingStoreId);
  
  if (viewingStoreId && !activeStore) {
    activeStore = {
      id: viewingStoreId,
      name: 'Gian hàng đang cập nhật',
      description: 'Chủ gian hàng chưa cấu hình thông tin hiển thị.',
      address: 'Chưa cập nhật',
      phone: '',
      status: 'offline',
      rating: 5,
      feedback_count: 0,
      products: [],
      ownerId: null
    };
  }

  const storeOwner = activeStore ? users.find((u:any) => u.id === activeStore.ownerId) : null;
  const isOnline = storeOwner?.isOnline || activeStore?.status === 'online';
  
  // Lọc cửa hàng dựa trên từ khóa tìm kiếm (lọc theo tên cửa hàng hoặc sản phẩm)
  const storeProducts = Array.isArray(activeStore?.products) ? activeStore.products : [];

  const visibleStores = stores.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.products && s.products.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="space-y-4">
      
      {/* Form tạo cửa hàng cho Business */}
      {currentUser?.role === 'business' && currentUser?.status === 'active' && !stores.find(s => s.ownerId === currentUser?.id) && (
        <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg mb-4 shadow-sm">
          <h3 className="font-bold text-blue-800 mb-3 text-lg">🏪 Tạo / Cấu hình Gian hàng của tôi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <input value={newStoreName} onChange={e=>setNewStoreName(e.target.value)} placeholder="Tên gian hàng..." className="p-2.5 border rounded bg-white" />
            <input value={newStoreDesc} onChange={e=>setNewStoreDesc(e.target.value)} placeholder="Khẩu hiệu / Mô tả ngắn..." className="p-2.5 border rounded bg-white" />
            <input value={newStoreAddress} onChange={e=>setNewStoreAddress(e.target.value)} placeholder="Địa chỉ / Vị trí bản đồ..." className="p-2.5 border rounded bg-white" />
            <input value={newStorePhone} onChange={e=>setNewStorePhone(e.target.value)} placeholder="Số điện thoại liên hệ..." className="p-2.5 border rounded bg-white" />
          </div>
          <button onClick={createStore} className="bg-blue-600 text-white px-6 py-2.5 rounded font-bold hover:bg-blue-700 w-full md:w-auto transition shadow">Xác nhận tạo gian hàng</button>
        </div>
      )}

      {!activeStore && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibleStores.length === 0 && <div className="col-span-3 text-center py-6 text-gray-500 bg-white rounded shadow border-dashed border-2">Không tìm thấy gian hàng/sản phẩm phù hợp.</div>}
          {visibleStores.map(s=> (<div key={s.id} onClick={()=>setViewingStoreId(s.id)} className="p-4 rounded-xl border-2 cursor-pointer transition border-transparent bg-white shadow hover:border-blue-300"><h4 className="font-bold text-lg text-gray-800">{s.name}</h4><div className="text-sm text-gray-500 mt-2 flex items-center gap-2"><Star size={14} className="text-yellow-500 fill-yellow-500"/> {s.rating} <span className="w-1.5 h-1.5 rounded-full bg-green-500 ml-2"></span> {s.status}</div></div>))}
        </div>
      )}
      
      {activeStore && (
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-bme-primary to-bme-secondary flex items-center justify-center relative">
          <button onClick={() => setViewingStoreId(null)} className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 text-white px-4 py-2 rounded-lg font-bold transition backdrop-blur-sm flex items-center gap-2">← Quay lại</button>
          <Package size={64} className="text-white opacity-50"/>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {activeStore.name} 
                  {isOnline ? <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm" title="Đang trực tuyến"></span> : <span className="w-3 h-3 rounded-full bg-gray-400 shadow-sm" title="Ngoại tuyến"></span>}
                </h2>
                <p className="text-gray-600 mt-1 font-medium">{activeStore.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={14}/> {activeStore.address || 'Chưa cập nhật địa chỉ'}</p>
                  <button onClick={()=>document.dispatchEvent(new CustomEvent('viewProfile', {detail: activeStore.ownerId}))} className="text-sm text-bme-primary font-bold hover:underline">Hồ sơ người bán →</button>
                </div>
              </div>
              {currentUser?.id !== activeStore.ownerId && storeOwner && (
                <button onClick={()=>document.dispatchEvent(new CustomEvent('openChat', {detail: storeOwner}))} className="bg-bme-primary hover:bg-bme-secondary text-white px-5 py-2.5 rounded-lg shadow font-bold flex items-center gap-2 transition shrink-0"><MessageSquare size={18}/> Nhắn tin ngay</button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 py-4 border-y"><div className="text-center"><p className="text-2xl font-bold text-bme-primary">{activeStore?.rating}</p><p className="text-sm text-gray-600">Đánh giá</p></div><div className="text-center"><p className="text-2xl font-bold text-bme-primary">{activeStore?.feedback_count}</p><p className="text-sm text-gray-600">Bình luận</p></div><div className="text-center"><p className="text-lg font-bold text-green-600">{activeStore?.status==='online'?'🟢':'🔴'}</p><p className="text-sm text-gray-600">{activeStore?.status}</p></div></div>
          
          {activeStore.ownerId === currentUser?.id && (
            <div className="flex gap-4 border-b border-gray-200">
              <button onClick={() => setStoreTab('products')} className={`pb-2 font-bold text-sm transition border-b-2 ${storeTab === 'products' ? 'border-bme-primary text-bme-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Sản phẩm & Dịch vụ</button>
              <button onClick={() => setStoreTab('orders')} className={`pb-2 font-bold text-sm transition border-b-2 flex items-center gap-1 ${storeTab === 'orders' ? 'border-bme-primary text-bme-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>Đơn hàng cần xử lý {orders.filter((o:any)=>o.storeId===activeStore.id && o.status==='Chờ xác nhận').length > 0 && <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-[10px]">{orders.filter((o:any)=>o.storeId===activeStore.id && o.status==='Chờ xác nhận').length}</span>}</button>
            </div>
          )}

          {storeTab === 'products' ? (
          <div>
            {activeStore.ownerId !== currentUser?.id && <h4 className="font-bold mb-4 text-lg mt-2">Sản phẩm & Dịch vụ</h4>}
            {activeStore.ownerId === currentUser?.id && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                <p className="font-bold text-sm mb-3">Thêm sản phẩm mới</p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                  <input value={newProdName} onChange={e=>setNewProdName(e.target.value)} placeholder="Tên linh kiện/thiết bị..." className="p-2 border rounded text-sm bg-white" />
                  <input type="number" value={newProdPrice} onChange={e=>setNewProdPrice(e.target.value)} placeholder="Giá bán (Số)..." className="p-2 border rounded text-sm bg-white" />
                  <input type="number" value={newProdStock} onChange={e=>setNewProdStock(e.target.value)} placeholder="Số lượng trong kho..." className="p-2 border rounded text-sm bg-white" />
                  <input value={newProdCat} onChange={e=>setNewProdCat(e.target.value)} placeholder="Phân loại (vd: Bo mạch)..." className="p-2 border rounded text-sm bg-white" />
                  <input value={newProdDesc} onChange={e=>setNewProdDesc(e.target.value)} placeholder="Mô tả kỹ thuật..." className="p-2 border rounded text-sm bg-white lg:col-span-2" />
                </div>
                <button onClick={addProduct} className="bg-bme-secondary hover:bg-bme-primary text-white px-5 py-2 rounded text-sm font-semibold transition">+ Thêm sản phẩm</button>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(!activeStore.products || !Array.isArray(activeStore.products) || activeStore.products.length === 0) && <p className="col-span-full text-center text-gray-500 italic py-6 font-medium">Gian hàng chưa đăng sản phẩm.</p>}
              {storeProducts.map((p:any,i:number)=>(
                <div key={i} className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm hover:border-bme-primary transition flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start"><p className="font-bold text-gray-800 flex-1 pr-2">{p.name}</p> {p.stock > 0 ? <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded font-bold">Kho: {p.stock}</span> : <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">HẾT HÀNG</span>}</div>
                    <p className="text-bme-accent font-bold text-sm my-1">{Number(p.price).toLocaleString()} VNĐ</p>
                    <p className="text-xs text-gray-500 mb-1">Loại: {p.cat}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{p.desc}</p>
                  </div>
                  <div className="mt-auto">
                    <button disabled={p.stock < 1} onClick={()=>{ document.dispatchEvent(new CustomEvent('addToCart', {detail: {...p, storeId: activeStore.id, storeName: activeStore.name}})); }} className={`w-full py-2 rounded text-sm font-bold transition ${p.stock > 0 ? 'bg-blue-50 text-bme-primary hover:bg-bme-primary hover:text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}> {p.stock > 0 ? 'Thêm vào giỏ' : 'Tạm hết hàng'} </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          ) : (
          <div className="mt-2">
            <div className="space-y-4">
              {orders.filter((o:any) => o.storeId === activeStore.id).length === 0 && <p className="text-gray-500 italic text-sm text-center py-6 border-2 border-dashed rounded-lg">Chưa có đơn hàng nào.</p>}
              {orders.filter((o:any) => o.storeId === activeStore.id).sort((a:any,b:any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((o:any) => (
                <div key={o.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-bme-primary transition">
                  <div className="flex justify-between items-start mb-3 border-b pb-3">
                    <div>
                      <p className="font-bold text-gray-800 text-lg">Mã ĐH: {o.id}</p>
                      <p className="text-xs font-semibold text-gray-500 mt-1">{o.timestamp}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${o.status === 'Chờ xác nhận' ? 'bg-yellow-100 text-yellow-800' : o.status === 'Đang giao hàng' ? 'bg-blue-100 text-blue-800' : o.status === 'Đã hoàn thành' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{o.status}</span>
                      <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)} className="text-sm font-bold border border-gray-300 rounded-lg p-1.5 outline-none bg-white text-gray-700 focus:border-bme-primary focus:ring-1">
                        <option value="Chờ xác nhận">⏳ Chờ xác nhận</option>
                        <option value="Đang giao hàng">🚚 Đang giao hàng</option>
                        <option value="Đã hoàn thành">✅ Đã hoàn thành</option>
                        <option value="Đã hủy">❌ Hủy đơn</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><User size={14}/> Thông tin khách hàng</p>
                      <p className="text-sm font-bold text-gray-800">{o.buyerName} <span className="font-medium text-gray-600">({o.buyerPhone})</span></p>
                      <p className="text-sm text-gray-600 mt-1.5 flex items-start gap-1"><MapPin size={14} className="flex-shrink-0 mt-0.5 text-gray-400"/> <span>{o.shippingAddress}</span></p>
                    </div>
                    <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-50">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1"><Package size={14}/> Chi tiết giỏ hàng</p>
                      <ul className="text-sm text-gray-700 space-y-1.5">
                        {o.items.map((item:any, i:number) => ( <li key={i} className="flex justify-between items-center"><span className="truncate pr-2"><span className="font-bold text-gray-800">{item.qty}x</span> {item.name}</span> <span className="font-semibold shrink-0">{(item.price * item.qty).toLocaleString()}đ</span></li> ))}
                      </ul>
                      <div className="flex justify-between border-t border-blue-200 mt-3 pt-2 font-bold text-gray-800"><span>Tổng thu:</span> <span className="text-red-600 text-lg">{o.totalPrice.toLocaleString()}đ</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}
          
          <div className="pt-4"><h4 className="font-semibold">Đánh giá</h4><div className="flex gap-2 items-center mt-2"><select value={rating} onChange={e=>setRating(Number(e.target.value))} className="p-2 border rounded">{[5,4,3,2,1].map(n=>(<option key={n} value={n}>{n} sao</option>))}</select><input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Bình luận..." className="flex-1 p-2 border rounded" /><button onClick={()=>leave(activeStore.id)} className="px-3 py-2 bg-bme-primary text-white rounded">Gửi</button></div></div>
        </div>
      </div>
      )}
      {activeStore && (
      <div className="bg-white p-6 rounded shadow-sm"><h3 className="font-bold mb-4">Đánh giá</h3>{feedbacks.filter(f=>f.storeId===activeStore?.id).map(f=>(<div key={f.id} className="border-b pb-4 mb-4"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><img src={f.avatar} className="w-10 h-10 rounded" alt="a"/><div><p className="font-semibold">{f.author}</p><p className="text-sm text-gray-500">{f.date}</p></div></div><div className="flex">{[...Array(5)].map((_,i)=>(<Star key={i} size={16} className={i<f.rating? 'fill-yellow-400 text-yellow-400':'text-gray-300'} />))}</div></div><p className="mt-2 text-gray-700">{f.comment}</p></div>))}</div>
      )}
    </div>
  );
};

// ------------------ User Profile (MỚI) ------------------
export const UserProfile = ({ userId, currentUser }: { userId: string, currentUser: any }) => {
  const users = safeGet('bme_users', []);
  const stores = safeGet('bme_stores', []);
  const posts = safeGet('bme_posts', []);
  const orders = safeGet('bme_orders', []);
  
  const user = users.find((u:any) => u.id === userId);
  const userStore = stores.find((s:any) => s.ownerId === userId);
  const userPosts = posts.filter((p:any) => p.authorId === userId);
  const myOrders = orders.filter((o:any) => o.buyerId === userId);

  if(!user) return <div className="p-8 text-center text-gray-500">Người dùng không tồn tại.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Card Thông tin */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-bme-primary to-bme-secondary"></div>
        <div className="px-6 pb-6 relative">
          <div className="absolute -top-12 border-4 border-white rounded-full bg-white"><Avatar src={user.avatar} name={user.name} size={96} userId={user.id} /></div>
          <div className="mt-14 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">{user.name} {user.role==='admin' && <Shield size={20} className="text-blue-500"/>} {user.role==='coordinator' && <Star size={20} className="text-yellow-500"/>}</h2>
              <p className="text-gray-500">{user.role === 'business' ? '🏬 Tài khoản Doanh nghiệp' : user.role === 'coordinator' ? '👨‍🏫 Chuyên gia kỹ thuật' : user.role === 'supervisor' ? '👁️ Ban Giám sát' : '👤 Tài khoản Cá nhân'}</p>
              <div className="flex gap-4 mt-3 text-sm flex-wrap">
                <span className="text-gray-600 font-medium">📞 SĐT: {user.phone}</span>
                {user.cccd && <span className="text-gray-600 font-medium">💳 CCCD: {user.cccd}</span>}
                {user.taxId && <span className="text-gray-600 font-medium">🏢 MST: {user.taxId}</span>}
                <span className="text-gray-600 font-medium">🕒 Hoạt động: {user.isOnline ? <span className="text-green-600 font-bold">Đang Online</span> : new Date(user.lastActive).toLocaleString()}</span>
              </div>
            </div>
            {currentUser?.id !== userId && (
              <button onClick={()=>document.dispatchEvent(new CustomEvent('openChat', {detail: user}))} className="bg-bme-primary hover:bg-bme-secondary text-white px-5 py-2 rounded-lg shadow font-bold flex items-center gap-2 transition"><MessageSquare size={18}/> Nhắn tin ngay</button>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Cột Trái: Store nếu là Business */}
        {user.role === 'business' && userStore ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg mb-4 border-b pb-2 flex items-center gap-2"><Store size={20} className="text-bme-primary"/> Gian hàng đang kinh doanh</h3>
            <p className="font-semibold text-gray-800">{userStore.name}</p>
            <p className="text-sm text-gray-600 mt-1 mb-4">{userStore.description}</p>
            <div className="space-y-2">
              {(userStore.products || []).slice(0, 3).map((p:any, i:number) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                  <span className="font-medium text-gray-700 truncate mr-2">{p.name}</span>
                  <span className="text-bme-accent font-bold shrink-0">{Number(p.price).toLocaleString()}đ</span>
                </div>
              ))}
              {(userStore.products?.length || 0) > 3 && <p className="text-center text-xs text-blue-500 mt-2 cursor-pointer hover:underline" onClick={()=>document.dispatchEvent(new CustomEvent('openStore', {detail: userStore.id}))}>Xem tất cả tại Gian hàng</p>}
            </div>
            <button onClick={()=>document.dispatchEvent(new CustomEvent('openStore', {detail: userStore.id}))} className="w-full mt-4 border border-bme-primary text-bme-primary py-2 rounded-lg font-bold hover:bg-blue-50 transition">Đi đến Gian hàng</button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-gray-400 min-h-[200px]">
            <User size={40} className="mb-2 opacity-30" />
            <p>Chưa có thông tin Gian hàng</p>
          </div>
        )}

        {/* Cột Phải: Bài viết cá nhân */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-4 border-b pb-2 flex items-center gap-2"><FileText size={20} className="text-bme-primary"/> Bài viết gần đây</h3>
          {userPosts.length === 0 ? <p className="text-center text-gray-500 py-4">Chưa có bài viết nào.</p> : (
            <div className="space-y-4">
              {userPosts.slice(0, 3).map((p:any) => (
                <div key={p.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex justify-between text-xs text-gray-500 mb-1"><span>{p.category}</span> <span>{p.time}</span></div>
                  <p className="text-sm text-gray-800 line-clamp-2">{p.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cột Dưới: Lịch sử mua hàng */}
      {(currentUser?.id === userId || currentUser?.role === 'admin') && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-6">
          <h3 className="font-bold text-lg mb-4 border-b pb-2 flex items-center gap-2"><Package size={20} className="text-bme-primary"/> Lịch sử mua hàng ({myOrders.length})</h3>
          {myOrders.length === 0 ? <p className="text-center text-gray-500 py-6">Bạn chưa có giao dịch nào trên hệ thống.</p> : (
            <div className="space-y-4">
              {myOrders.sort((a:any, b:any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((o:any) => (
                <div key={o.id} className="bg-gray-50 rounded-xl border border-gray-200 p-5 hover:border-bme-primary transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 border-b border-gray-200 pb-3">
                    <div>
                      <p className="font-bold text-gray-800">Mã ĐH: <span className="text-bme-primary">{o.id}</span></p>
                      <p className="text-sm text-gray-500 mt-1">Đặt lúc: {o.timestamp} • Cửa hàng: <span className="font-bold text-gray-700 cursor-pointer hover:underline hover:text-bme-primary" onClick={()=>document.dispatchEvent(new CustomEvent('openStore', {detail: o.storeId}))}>{o.storeName}</span></p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap text-center ${o.status === 'Chờ xác nhận' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : o.status === 'Đang giao hàng' ? 'bg-blue-100 text-blue-800 border border-blue-200' : o.status === 'Đã hoàn thành' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>{o.status}</span>
                  </div>
                  <div className="space-y-2">
                    {o.items.map((item:any, i:number) => (
                      <div key={i} className="flex justify-between items-center text-sm"><span className="text-gray-700"><span className="font-bold text-gray-600 mr-2">{item.qty}x</span> {item.name}</span> <span className="font-semibold text-gray-800">{(item.price * item.qty).toLocaleString()}đ</span></div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={16}/> {o.shippingAddress}</p>
                    <p className="font-bold text-gray-800 text-lg">Tổng: <span className="text-red-600">{o.totalPrice.toLocaleString()}đ</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ------------------ Role-based Dashboard ------------------
export const AdminDashboard = ({ currentUser }: { currentUser: any }) => {
  // Phân quyền Tab hiển thị dựa trên vai trò
  const role = currentUser?.role;
  const isSupervisor = role === 'supervisor' || role === 'admin';
  const isCoordinator = role === 'coordinator' || role === 'admin';
  const isAdmin = role === 'admin';
  
  const defaultTab = isAdmin ? 'analytics_center' : (isSupervisor ? 'supervisor_panel' : 'coordinator_panel');
  const [tab, setTab] = useState(defaultTab);
  const [analyticsFilter, setAnalyticsFilter] = useState('top_stores');
  const [users, setUsers] = useState(()=> safeGet('bme_users', []));
  const [posts, setPosts] = useState(()=> safeGet('bme_posts', []));
  const [communities, setCommunities] = useState(()=> safeGet('bme_communities', []));
  const [logs, setLogs] = useState(()=> safeGet('bme_audit_logs', []));
  const [orders, setOrders] = useState(()=> safeGet('bme_orders', []));
  const [stores, setStores] = useState(()=> safeGet('bme_stores', []));

  useEffect(() => {
    const fetchAdminData = () => { setUsers(safeGet('bme_users', [])); setPosts(safeGet('bme_posts', [])); setCommunities(safeGet('bme_communities', [])); setLogs(safeGet('bme_audit_logs', [])); setOrders(safeGet('bme_orders', [])); setStores(safeGet('bme_stores', [])); };
    const interval = setInterval(fetchAdminData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Hàm tiện ích tạo Log
  const writeLog = (action: string) => {
    const newLog = { id: Date.now(), user: currentUser.name, role: currentUser.role, action, time: new Date().toLocaleString() };
    setLogs(prev => { const next = [newLog, ...prev]; safeSet('bme_audit_logs', next); return next; });
  };

  // Supervisor actions
  const banUser = (id:string) => { const next = users.map((u:any)=>u.id===id?{...u,status:'Banned'}:u); setUsers(next); safeSet('bme_users', next); writeLog(`Cấm tài khoản ID: ${id}`); showToast('Đã cấm tài khoản thành công', 'success'); };
  const deletePost = (id:string) => { const next = posts.filter((p:any)=>p.id!==id); setPosts(next); safeSet('bme_posts', next); writeLog(`Xóa bài viết ID: ${id}`); showToast('Đã xóa bài viết khỏi hệ thống', 'success'); };

  // Coordinator actions
  const approveCommunity = (id:string) => { const next = communities.map((c:any)=>c.id===id?{...c,status:'Approved'}:c); setCommunities(next); safeSet('bme_communities', next); writeLog(`Phê duyệt nhóm ID: ${id}`); showToast('Đã phê duyệt nhóm', 'success'); };
  const rejectCommunity = (id:string) => { const next = communities.filter((c:any)=>c.id!==id); setCommunities(next); safeSet('bme_communities', next); writeLog(`Từ chối nhóm chờ duyệt ID: ${id}`); showToast('Đã từ chối và xóa nhóm', 'info'); };

  // Admin actions
  const unbanUser = (id:string) => { const next = users.map((u:any)=>u.id===id?{...u,status:'active'}:u); setUsers(next); safeSet('bme_users', next); writeLog(`Mở khóa tài khoản ID: ${id}`); showToast('Đã mở khóa tài khoản', 'success'); };
  const deleteCommunity = (id:string) => { const next = communities.filter((c:any)=>c.id!==id); setCommunities(next); safeSet('bme_communities', next); writeLog(`Gỡ bỏ nhóm ID: ${id}`); showToast('Đã gỡ bỏ nhóm khỏi hệ thống', 'success'); };

  const simulatePushAlert = () => {
    showToast('🚀 Đã GỬI THÔNG BÁO ĐIỀU PHỐI (Push Notification) đến các Store và Kỹ thuật viên gần các vùng đỏ!', 'success');
    writeLog('Phát Push Alert Điều phối');
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return <span className="text-2xl drop-shadow-md inline-block transform hover:scale-110 transition">🥇</span>;
    if (index === 1) return <span className="text-2xl drop-shadow-md inline-block transform hover:scale-110 transition">🥈</span>;
    if (index === 2) return <span className="text-2xl drop-shadow-md inline-block transform hover:scale-110 transition">🥉</span>;
    return <span className="font-bold text-gray-400 w-8 text-center inline-block">#{index + 1}</span>;
  };

  const renderAnalyticsRows = () => {
    if (analyticsFilter === 'top_stores') {
       const sortedStores = [...stores].sort((a:any, b:any) => (b.rating||0) - (a.rating||0)).slice(0, 10);
       if (!sortedStores.length) return <tr><td colSpan={5} className="p-6 text-center text-gray-500 italic">Chưa có dữ liệu gian hàng.</td></tr>;
       return sortedStores.map((s:any, i:number) => (
         <tr key={s.id} className="border-b hover:bg-blue-50/50 transition">
           <td className="p-4 text-center w-16">{getRankBadge(i)}</td>
           <td className="p-4 font-bold text-bme-primary text-base">{s.name}</td>
           <td className="p-4"><span className="font-bold text-yellow-600 flex items-center gap-1"><Star size={16} className="fill-yellow-500"/> {s.rating}</span></td>
           <td className="p-4 text-gray-600 font-semibold">{s.feedback_count || 0} lượt</td>
           <td className="p-4 text-gray-500 text-sm max-w-[200px] truncate" title={s.address}><MapPin size={14} className="inline mr-1 opacity-50"/>{s.address || 'Chưa cập nhật'}</td>
         </tr>
       ));
    }
    if (analyticsFilter === 'most_saved') {
       const counts: any = {};
       users.forEach((u:any) => (u.savedPostIds||[]).forEach((id:string) => counts[id] = (counts[id]||0)+1));
       const savedPosts = posts.map((p:any) => ({...p, saves: counts[p.id]||0})).filter((p:any)=>p.saves>0).sort((a:any,b:any)=>b.saves-a.saves).slice(0,10);
       if (!savedPosts.length) return <tr><td colSpan={4} className="p-6 text-center text-gray-500 italic">Chưa có bài viết nào được lưu trữ.</td></tr>;
       return savedPosts.map((p:any, i:number) => (
         <tr key={p.id} className="border-b hover:bg-blue-50/50 transition">
           <td className="p-4 text-center w-16">{getRankBadge(i)}</td>
           <td className="p-4 font-bold text-gray-800">{p.author}</td>
           <td className="p-4 max-w-sm truncate"><span className="bg-gray-100 border border-gray-200 px-2.5 py-1 rounded text-xs font-bold mr-2 text-gray-600">{p.category}</span> <span className="text-gray-700">{p.content}</span></td>
           <td className="p-4"><span className="font-black text-bme-accent flex items-center gap-1.5"><Bookmark size={16} className="fill-bme-accent"/> {p.saves} lượt</span></td>
         </tr>
       ));
    }
    if (analyticsFilter === 'top_products') {
       const productSales: any = {};
       orders.filter((o:any) => ['Đang giao hàng', 'Đã hoàn thành'].includes(o.status)).forEach((o:any) => {
         o.items.forEach((item:any) => {
           if(!productSales[item.id]) productSales[item.id] = {...item, sold: 0, storeName: o.storeName};
           productSales[item.id].sold += item.qty;
         });
       });
       const topProducts = Object.values(productSales).sort((a:any,b:any)=>b.sold-a.sold).slice(0,10);
       if (!topProducts.length) return <tr><td colSpan={4} className="p-6 text-center text-gray-500 italic">Chưa có dữ liệu sản phẩm bán ra.</td></tr>;
       return topProducts.map((p:any, i:number) => (
         <tr key={p.id} className="border-b hover:bg-blue-50/50 transition">
           <td className="p-4 text-center w-16">{getRankBadge(i)}</td>
           <td className="p-4 font-bold text-gray-800">{p.name}</td>
           <td className="p-4 text-bme-primary font-semibold"><Store size={14} className="inline mr-1 opacity-50"/>{p.storeName}</td>
           <td className="p-4"><span className="font-black text-green-600 flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full w-max"><Package size={16}/> {p.sold} đã bán</span></td>
         </tr>
       ));
    }
    if (analyticsFilter === 'active_members') {
       const memberActivity: any = {};
       users.forEach((u:any) => memberActivity[u.id] = {...u, score: 0});
       posts.forEach((p:any) => { if(memberActivity[p.authorId]) memberActivity[p.authorId].score += 5; });
       orders.forEach((o:any) => { if(memberActivity[o.buyerId]) memberActivity[o.buyerId].score += 2; });
       const actives = Object.values(memberActivity).filter((u:any)=>u.score>0).sort((a:any,b:any)=>b.score-a.score).slice(0,10);
       if (!actives.length) return <tr><td colSpan={4} className="p-6 text-center text-gray-500 italic">Hệ thống chưa ghi nhận tương tác.</td></tr>;
       return actives.map((u:any, i:number) => (
         <tr key={u.id} className="border-b hover:bg-blue-50/50 transition">
           <td className="p-4 text-center w-16">{getRankBadge(i)}</td>
           <td className="p-4 font-bold text-gray-800 flex items-center gap-3"><Avatar src={u.avatar} name={u.name} size={32} userId={u.id} /> {u.name}</td>
           <td className="p-4"><span className="text-gray-500 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full uppercase text-[10px] font-black">{u.role}</span></td>
           <td className="p-4"><span className="font-black text-orange-500 flex items-center gap-1.5 text-lg">🔥 {u.score} pts</span></td>
         </tr>
       ));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap bg-white p-2 rounded shadow-sm border border-gray-200">
        {isAdmin && <button onClick={()=>setTab('analytics_center')} className={`px-4 py-2 rounded font-bold transition flex items-center gap-2 ${tab==='analytics_center'?'bg-bme-primary text-white shadow-lg':'hover:bg-gray-100 text-gray-700'}`}><BarChart size={18}/> Trung tâm Thống kê</button>}
        {isAdmin && <button onClick={()=>setTab('heatmap')} className={`px-4 py-2 rounded font-bold transition flex items-center gap-2 ${tab==='heatmap'?'bg-red-600 text-white shadow-lg':'hover:bg-gray-100 text-gray-700'}`}><MapPin size={18}/> Radar Map</button>}
        {(isAdmin || isSupervisor) && <button onClick={()=>setTab('supervisor_panel')} className={`px-4 py-2 rounded font-bold transition flex items-center gap-2 ${tab==='supervisor_panel'?'bg-bme-primary text-white shadow':'hover:bg-gray-100 text-gray-700'}`}><Shield size={18}/> Quản lý Bảng tin & User</button>}
        {(isAdmin || isCoordinator) && <button onClick={()=>setTab('coordinator_panel')} className={`px-4 py-2 rounded font-bold transition flex items-center gap-2 ${tab==='coordinator_panel'?'bg-bme-primary text-white shadow':'hover:bg-gray-100 text-gray-700'}`}><CheckCircle size={18}/> Duyệt Cộng đồng {Array.isArray(communities) && communities.filter((c:any)=>c.status==='Pending_Approval').length > 0 && <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">{communities.filter((c:any)=>c.status==='Pending_Approval').length}</span>}</button>}
        {isAdmin && <button onClick={()=>setTab('admin_panel')} className={`px-4 py-2 rounded font-bold transition flex items-center gap-2 ${tab==='admin_panel'?'bg-purple-600 text-white shadow':'hover:bg-gray-100 text-gray-700'}`}><AlertCircle size={18}/> Quản lý Cấp cao</button>}
        {(isAdmin || isSupervisor) && <button onClick={()=>setTab('orders_panel')} className={`px-4 py-2 rounded font-bold transition flex items-center gap-2 ${tab==='orders_panel'?'bg-bme-primary text-white shadow':'hover:bg-gray-100 text-gray-700'}`}><Package size={18}/> Giao dịch & Đơn hàng</button>}
        {isAdmin && <button onClick={()=>setTab('logs')} className={`px-4 py-2 rounded font-bold transition flex items-center gap-2 ${tab==='logs'?'bg-bme-primary text-white':'hover:bg-gray-100 text-gray-700'}`}><FileText size={18}/> System Logs</button>}
        {isAdmin && <button onClick={()=>setTab('storage_panel')} className={`px-4 py-2 rounded font-bold transition flex items-center gap-2 ${tab==='storage_panel'?'bg-emerald-600 text-white shadow-lg':'hover:bg-gray-100 text-gray-700'}`}><Database size={18}/> Quản lý Storage</button>}
      </div>
      
      {tab === 'analytics_center' && isAdmin && (
        <div className="space-y-6 animate-fade-in">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 flex items-center justify-between hover:shadow-md transition">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Tổng Thành Viên Toàn Sàn</p>
                <p className="text-4xl font-black text-bme-primary">{users.length}</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500"><UsersIcon size={28}/></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 flex items-center justify-between hover:shadow-md transition">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Giao Dịch Thành Công</p>
                <p className="text-4xl font-black text-green-600">{orders.filter((o:any) => ['Đang giao hàng', 'Đã hoàn thành'].includes(o.status)).length}</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-500"><TrendingUp size={28}/></div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 flex items-center justify-between hover:shadow-md transition">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Hội Nhóm Đã Phê Duyệt</p>
                <p className="text-4xl font-black text-purple-600">{communities.filter((c:any) => c.status === 'Approved').length}</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-500"><CheckCircle size={28}/></div>
            </div>
          </div>

          {/* Analytics Filter Center */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h4 className="font-bold text-xl text-gray-800 mb-5 flex items-center gap-3"><BarChart size={28} className="text-bme-primary" /> Bảng Xếp Hạng & Phân Tích Thông Minh</h4>
            <div className="flex flex-wrap gap-3 border-b border-gray-100 pb-5 mb-5">
               <button onClick={()=>setAnalyticsFilter('top_stores')} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition flex items-center gap-2 ${analyticsFilter==='top_stores' ? 'bg-bme-primary text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>⭐ Shop đánh giá cao nhất</button>
               <button onClick={()=>setAnalyticsFilter('most_saved')} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition flex items-center gap-2 ${analyticsFilter==='most_saved' ? 'bg-bme-primary text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>🔖 Bài viết được lưu nhiều nhất</button>
               <button onClick={()=>setAnalyticsFilter('top_products')} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition flex items-center gap-2 ${analyticsFilter==='top_products' ? 'bg-bme-primary text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>📦 Sản phẩm bán chạy nhất</button>
               <button onClick={()=>setAnalyticsFilter('active_members')} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition flex items-center gap-2 ${analyticsFilter==='active_members' ? 'bg-bme-primary text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>🔥 Thành viên tích cực nhất</button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                  {analyticsFilter === 'top_stores' && <tr><th className="p-4 font-bold">Thứ hạng</th><th className="p-4 font-bold">Gian hàng doanh nghiệp</th><th className="p-4 font-bold">Điểm đánh giá</th><th className="p-4 font-bold">Lượt bình luận</th><th className="p-4 font-bold">Địa chỉ / Khu vực</th></tr>}
                  {analyticsFilter === 'most_saved' && <tr><th className="p-4 font-bold">Thứ hạng</th><th className="p-4 font-bold">Người chia sẻ</th><th className="p-4 font-bold">Nội dung bài viết / Phân loại</th><th className="p-4 font-bold">Số lượt người dùng lưu</th></tr>}
                  {analyticsFilter === 'top_products' && <tr><th className="p-4 font-bold">Thứ hạng</th><th className="p-4 font-bold">Tên sản phẩm thiết bị y tế</th><th className="p-4 font-bold">Phân phối bởi</th><th className="p-4 font-bold">Số lượng đã xuất kho</th></tr>}
                  {analyticsFilter === 'active_members' && <tr><th className="p-4 font-bold">Thứ hạng</th><th className="p-4 font-bold">Hồ sơ thành viên</th><th className="p-4 font-bold">Vai trò hệ thống</th><th className="p-4 font-bold">Điểm hoạt động (Tích cực)</th></tr>}
                </thead>
                <tbody className="bg-white">
                  {renderAnalyticsRows()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab==='heatmap' && isAdmin && (
        <div className="bg-white p-6 rounded shadow border-t-4 border-red-500">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="font-bold text-xl text-gray-800">Bản đồ nhiệt (Heatmap Analytics)</h4>
              <p className="text-sm text-gray-500 mt-1">Phân tích nhu cầu sửa chữa y tế và mật độ phân bổ Store theo thời gian thực.</p>
            </div>
            <button onClick={simulatePushAlert} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md flex items-center gap-2 transition animate-pulse">🚀 Điều phối khẩn cấp</button>
          </div>
          <div className="relative w-full h-[400px] bg-slate-800 border rounded-xl overflow-hidden flex items-center justify-center">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            {/* Vùng đỏ 1 (Thiếu hụt) */}
            <div className="absolute top-[20%] left-[25%] w-48 h-48 bg-red-500/50 rounded-full blur-[40px] animate-pulse"></div>
            <div className="absolute top-[28%] left-[30%] bg-red-600 px-2 py-1 rounded text-[10px] text-white font-bold shadow">Nhu cầu cao</div>
            
            {/* Vùng đỏ 2 */}
            <div className="absolute bottom-[20%] right-[30%] w-32 h-32 bg-orange-500/60 rounded-full blur-[30px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            {/* Vùng xanh (Nhiều Store) */}
            <div className="absolute top-[40%] left-[60%] w-64 h-64 bg-green-500/30 rounded-full blur-[50px]"></div>
            
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg text-xs shadow-lg border">
              <p className="font-bold mb-2 border-b pb-1 text-gray-700">Chú giải</p>
              <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded-full shadow"></span> Điểm nóng (Cần kỹ thuật viên)</div>
              <div className="flex items-center gap-2 mt-1.5"><span className="w-3 h-3 bg-green-500 rounded-full shadow"></span> Mật độ Store an toàn</div>
            </div>
          </div>
        </div>
      )}

      {tab==='supervisor_panel' && (isSupervisor || isAdmin) && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded shadow border-t-4 border-blue-500">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><Shield size={20}/> Quản lý Người dùng (Cấm)</h4>
            <div className="space-y-3">
              {users.filter((u:any) => u.role !== 'admin').map((u:any)=>(
                <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar src={u.avatar} name={u.name} size={40} userId={u.id} />
                    <div>
                      <p className="font-semibold text-gray-800">{u.name}</p>
                      <p className="text-xs text-gray-500 uppercase font-bold">{u.role} • {u.phone} • {u.status === 'Banned' ? 'ĐÃ BỊ CẤM' : 'Hoạt động'}</p>
                    </div>
                  </div>
                  {u.status !== 'Banned' ? (
                    <button onClick={()=>banUser(u.id)} className="px-4 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded text-sm font-bold shadow">Cấm tài khoản</button>
                  ) : (
                    <span className="px-4 py-1.5 bg-gray-200 text-gray-600 rounded text-sm font-bold flex items-center gap-1"><Lock size={14}/> Đã cấm</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded shadow border-t-4 border-orange-500">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><Eye size={20}/> Quản lý Bảng tin (Xóa bài)</h4>
            <div className="space-y-3">
              {posts.length === 0 && <p className="text-gray-500 italic py-4 text-center">Không có bài viết nào.</p>}
              {posts.map((p:any)=>(
                <div key={p.id} className="p-4 border rounded-lg flex items-start justify-between bg-white">
                  <div>
                    <div className="flex gap-2 mb-1"><span className="text-xs font-bold px-2 py-0.5 bg-gray-200 rounded">{p.category}</span><span className="text-xs text-gray-500">{p.time}</span></div>
                    <p className="font-bold text-gray-800">{p.author}</p>
                    <p className="text-sm text-gray-700 mt-1">{p.content}</p>
                  </div>
                  <button onClick={()=>deletePost(p.id)} className="px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded text-sm whitespace-nowrap">Xóa bài vi phạm</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {tab==='coordinator_panel' && (isCoordinator || isAdmin) && (
        <div className="bg-white p-6 rounded shadow border-t-4 border-green-500">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><CheckCircle size={20}/> Hộp thư thông báo duyệt nhóm (Cộng đồng)</h4>
          <div className="space-y-3">
            {(!Array.isArray(communities) || communities.filter((c:any) => c.status === 'Pending_Approval').length === 0) && <p className="text-gray-500 italic py-4 text-center">Không có nhóm nào đang chờ duyệt.</p>}
            {Array.isArray(communities) && communities.filter((c:any) => c.status === 'Pending_Approval').map((c:any)=>(
              <div key={c.id} className="p-4 border border-yellow-200 rounded-lg flex items-start justify-between bg-yellow-50">
                <div>
                  <h5 className="font-bold text-gray-800 text-lg">{c.name}</h5>
                  <p className="text-sm text-gray-600 mt-1 mb-2">{c.description}</p>
                  <span className="text-xs bg-white border px-2 py-1 rounded font-bold">Chuyên khoa: {c.specialty || 'Chung'}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={()=>approveCommunity(c.id)} className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded text-sm shadow">Phê duyệt</button>
                  <button onClick={()=>rejectCommunity(c.id)} className="px-5 py-2 bg-white border border-red-500 text-red-600 hover:bg-red-50 font-bold rounded text-sm">Từ chối</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='admin_panel' && isAdmin && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded shadow border-t-4 border-purple-500">
            <h4 className="font-bold text-lg mb-4 text-purple-800">Can thiệp Người dùng bị cấm</h4>
            <div className="space-y-3">
              {users.filter((u:any) => u.status === 'Banned').length === 0 && <p className="text-gray-500 text-sm">Không có tài khoản nào đang bị cấm.</p>}
              {users.filter((u:any) => u.status === 'Banned').map((u:any)=>(
                <div key={u.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="font-semibold text-gray-800">{u.name} - {u.phone}</p>
                  <button onClick={()=>unbanUser(u.id)} className="px-4 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded text-sm font-bold shadow">Mở khóa</button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded shadow border-t-4 border-purple-500">
            <h4 className="font-bold text-lg mb-4 text-purple-800">Quản lý toàn bộ Hội nhóm</h4>
            <div className="space-y-3">
              {communities.filter((c:any) => c.status === 'Approved').length === 0 && <p className="text-gray-500 text-sm">Không có nhóm nào.</p>}
              {communities.filter((c:any) => c.status === 'Approved').map((c:any)=>(
                <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-bold text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.membersCount} thành viên</p>
                  </div>
                  <button onClick={()=>deleteCommunity(c.id)} className="px-4 py-1.5 bg-red-600 text-white hover:bg-red-700 rounded text-sm font-bold shadow">Gỡ nhóm</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {tab==='orders_panel' && (isAdmin || isSupervisor) && (
        <div className="bg-white p-6 rounded shadow border-t-4 border-blue-500">
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><Package size={20}/> BẢNG QUẢN LÝ ĐƠN HÀNG TOÀN SÀN</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="p-3 border-b font-bold">Mã Đơn</th>
                  <th className="p-3 border-b font-bold">Thời gian</th>
                  <th className="p-3 border-b font-bold">Người mua</th>
                  <th className="p-3 border-b font-bold">Gian hàng bán</th>
                  <th className="p-3 border-b font-bold">Tổng tiền</th>
                  <th className="p-3 border-b font-bold">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {(!Array.isArray(orders) || orders.length === 0) && <tr><td colSpan={6} className="text-center p-6 text-gray-500 italic">Chưa có giao dịch nào diễn ra trên hệ thống</td></tr>}
                {Array.isArray(orders) && orders.sort((a:any,b:any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((o:any) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition border-b border-gray-100 last:border-0">
                    <td className="p-3 font-bold text-gray-800">{o.id}</td>
                    <td className="p-3 text-gray-500 text-xs font-semibold">{o.timestamp}</td>
                    <td className="p-3 text-gray-800 font-semibold">{o.buyerName} <span className="text-gray-500 font-normal block text-xs">{o.buyerPhone}</span></td>
                    <td className="p-3 text-bme-primary font-bold hover:underline cursor-pointer" onClick={()=>document.dispatchEvent(new CustomEvent('openStore', {detail: o.storeId}))}>{o.storeName}</td>
                    <td className="p-3 font-bold text-red-600 text-base">{o.totalPrice.toLocaleString()}đ</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${o.status === 'Chờ xác nhận' ? 'bg-yellow-100 text-yellow-800' : o.status === 'Đang giao hàng' ? 'bg-blue-100 text-blue-800' : o.status === 'Đã hoàn thành' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab==='logs' && isAdmin && (
        <div className="bg-white p-6 rounded shadow border-t-4 border-purple-500">
          <h4 className="font-bold text-lg mb-4">Nhật ký Hệ thống (Audit Logs)</h4>
          <div className="bg-slate-900 rounded-lg p-4 h-96 overflow-y-auto font-mono text-xs text-green-400 space-y-2">
            {logs.length === 0 && <p className="text-gray-500">Chưa có log hoạt động.</p>}
            {logs.map((l:any) => (
              <div key={l.id} className="border-b border-slate-800 pb-2">
                <span className="text-gray-400">[{l.time}]</span> <span className="text-blue-400">[{l.role.toUpperCase()}]</span> <span className="text-yellow-400">{l.user}</span>: <span className="text-white">{l.action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'storage_panel' && isAdmin && (
        <AdminStoragePanel logs={logs} writeLog={writeLog} />
      )}
    </div>
  );
};

const AdminStoragePanel = ({ logs, writeLog }: any) => {
  const [storageData, setStorageData] = useState<any[]>(() => safeGet('bme_storage', []));
  const [isCleaning, setIsCleaning] = useState(false);

  useEffect(() => {
    const int = setInterval(() => setStorageData(safeGet('bme_storage', [])), 3000);
    return () => clearInterval(int);
  }, []);

  const handleCleanup = () => {
    setIsCleaning(true);
    showToast('Đang quét và dọn dẹp các tệp mồ côi...', 'info');
    setTimeout(() => {
      setIsCleaning(false);
      showToast('Đã giải phóng dung lượng rác thành công!', 'success');
      writeLog('Thực thi dọn rác hệ thống Storage');
    }, 1500);
  };

  const handleConfigCDN = () => {
    showToast('Đã áp dụng quy tắc điều phối CDN cho thư mục Images.', 'success');
    writeLog('Cấu hình điều phối băng thông CDN Storage');
  };

  const getStats = (pathMatch: string) => {
    const files = storageData.filter(f => f.path?.includes(pathMatch));
    const count = files.length;
    const sizeBytes = files.reduce((acc, curr) => acc + (curr.size || 0), 0);
    const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2);
    return { count, sizeMB };
  };

  const imgStats = getStats('/images/');
  const pdfStats = getStats('/pdf/');
  const docStats = getStats('/docs/');
  const totalSizeMB = (Number(imgStats.sizeMB) + Number(pdfStats.sizeMB) + Number(docStats.sizeMB)).toFixed(2);

  return (
    <div className="bg-white p-6 rounded shadow border-t-4 border-emerald-500 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="font-bold text-xl text-gray-800 flex items-center gap-2"><Database size={24} className="text-emerald-500" /> HỆ THỐNG QUẢN LÝ DUNG LƯỢNG BỘ NHỚ LƯU TRỮ (OBJECT STORAGE)</h4>
          <p className="text-sm text-gray-500 mt-1 font-medium">Giám sát tài nguyên tĩnh, file đính kèm và tài liệu người dùng tải lên LocalStorage mô phỏng cấu trúc thư mục.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleConfigCDN} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md transition flex items-center gap-2"><Server size={16}/> Cấu hình CDN</button>
          <button onClick={handleCleanup} disabled={isCleaning} className={`border px-5 py-2.5 rounded-lg font-bold text-sm transition flex items-center gap-2 ${isCleaning ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'}`}><Trash2 size={16}/> Dọn rác bộ nhớ</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 flex flex-col items-center justify-center">
          <p className="text-emerald-800 font-bold mb-1 uppercase text-xs tracking-wider">Tổng dung lượng</p>
          <p className="text-4xl font-black text-emerald-600">{totalSizeMB} MB</p>
          <p className="text-sm font-bold text-emerald-600 mt-2 bg-emerald-100 px-3 py-1 rounded-full">Tổng số tệp: {storageData.length}</p>
        </div>
        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 flex flex-col items-center justify-center shadow-sm">
          <ImageIcon size={40} className="text-blue-500 mb-3 opacity-80" />
          <p className="font-bold text-gray-800 bg-white px-3 py-1 rounded shadow-sm text-sm mb-2">/storage/images/</p>
          <p className="text-sm font-bold text-blue-600">{imgStats.count} tệp • {imgStats.sizeMB} MB</p>
        </div>
        <div className="bg-red-50 p-5 rounded-xl border border-red-100 flex flex-col items-center justify-center shadow-sm">
          <FileText size={40} className="text-red-500 mb-3 opacity-80" />
          <p className="font-bold text-gray-800 bg-white px-3 py-1 rounded shadow-sm text-sm mb-2">/documents/pdf/</p>
          <p className="text-sm font-bold text-red-600">{pdfStats.count} tệp • {pdfStats.sizeMB} MB</p>
        </div>
        <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 flex flex-col items-center justify-center shadow-sm">
          <FileText size={40} className="text-indigo-500 mb-3 opacity-80" />
          <p className="font-bold text-gray-800 bg-white px-3 py-1 rounded shadow-sm text-sm mb-2">/documents/docs/</p>
          <p className="text-sm font-bold text-indigo-600">{docStats.count} tệp • {docStats.sizeMB} MB</p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 font-bold text-sm text-gray-700 flex items-center gap-2"><Database size={16}/> Chi tiết tệp tin trong Object Storage</div>
        <div className="max-h-[300px] overflow-y-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white sticky top-0 shadow-sm z-10">
              <tr>
                <th className="p-4 font-bold text-gray-600 border-b border-gray-100">ID / File Name</th>
                <th className="p-4 font-bold text-gray-600 border-b border-gray-100">Phân vùng (Path)</th>
                <th className="p-4 font-bold text-gray-600 border-b border-gray-100">Định dạng</th>
                <th className="p-4 font-bold text-gray-600 border-b border-gray-100">Kích thước</th>
                <th className="p-4 font-bold text-gray-600 border-b border-gray-100">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {storageData.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500 italic font-medium">Storage đang trống.</td></tr>}
              {storageData.map(f => (
                <tr key={f.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition group">
                  <td className="p-4 max-w-[250px] truncate" title={f.name}>
                    <span className="font-bold text-bme-primary">{f.id}</span><br/>
                    <span className="text-gray-500 text-xs font-medium">{f.name}</span>
                  </td>
                  <td className="p-4 font-mono text-xs text-gray-600 bg-gray-50">{f.path}</td>
                  <td className="p-4"><span className={`px-2.5 py-1 rounded text-xs font-bold ${f.typeLabel === 'PDF' ? 'bg-red-100 text-red-700' : f.typeLabel === 'Image' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>{f.typeLabel}</span></td>
                  <td className="p-4 text-gray-600 font-semibold">{(f.size / 1024).toFixed(1)} KB</td>
                  <td className="p-4">
                    <button onClick={() => {
                      const next = storageData.filter(item => item.id !== f.id);
                      setStorageData(next); safeSet('bme_storage', next);
                      showToast('Đã xóa tệp vĩnh viễn khỏi Storage', 'info');
                    }} className="text-red-500 hover:text-white hover:bg-red-500 px-3 py-1.5 rounded text-xs font-bold transition opacity-0 group-hover:opacity-100">Xóa file</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ------------------ Chat Center (MỚI) ------------------
export const ChatCenter = ({ currentUser, initialTarget = null }: { currentUser: any, initialTarget?: any }) => {
  const [messages, setMessages] = useState<any[]>(() => safeGet('bme_messages', []));
  const [users, setUsers] = useState<any[]>(() => safeGet('bme_users', []));
  const [activeChat, setActiveChat] = useState<any>(initialTarget);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTarget) setActiveChat(initialTarget);
  }, [initialTarget]);

  useEffect(() => {
    const fetch = () => {
      const msgs = safeGet('bme_messages', []);
      const allUsers = safeGet('bme_users', []);
      setMessages(msgs);
      setUsers(allUsers);

      // Đánh dấu đã đọc (Mark as Read)
      if (activeChat && currentUser) {
        let updated = false;
        const nextMsgs = msgs.map((m: any) => {
          if (m.receiverPhone === currentUser.phone && m.senderPhone === activeChat.phone && !m.isRead) {
            updated = true;
            return { ...m, isRead: true };
          }
          return m;
        });
        if (updated) {
          safeSet('bme_messages', nextMsgs);
          setMessages(nextMsgs);
        }
      }
    };
    fetch();
    const int = setInterval(fetch, 2000);
    return () => clearInterval(int);
  }, [activeChat, currentUser]);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChat]);

  const handleSend = () => {
    if (!newMessage.trim() || !activeChat || !currentUser) return;
    const msg = {
      messageId: `msg_${Date.now()}`,
      senderPhone: currentUser.phone,
      receiverPhone: activeChat.phone,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };
    const nextMsgs = [...messages, msg];
    setMessages(nextMsgs);
    safeSet('bme_messages', nextMsgs);
    setNewMessage('');
  };

  if (!currentUser) return <div className="p-8 text-center text-gray-500 font-medium">Vui lòng đăng nhập để xem tin nhắn.</div>;

  // Phân tích và tạo Danh sách cuộc trò chuyện (Chat List)
  const chatPartnersMap = new Map();
  
  messages.forEach(m => {
    if (m.senderPhone === currentUser.phone) chatPartnersMap.set(m.receiverPhone, m);
    else if (m.receiverPhone === currentUser.phone) chatPartnersMap.set(m.senderPhone, m);
  });

  // Nhúng luôn target hiện tại vào danh sách nếu chưa có tin nhắn
  if (activeChat && !chatPartnersMap.has(activeChat.phone)) chatPartnersMap.set(activeChat.phone, null);

  const chatList = Array.from(chatPartnersMap.keys()).map(phone => {
    const u = users.find(user => user.phone === phone);
    const lastMsg = chatPartnersMap.get(phone);
    const unreadCount = messages.filter(m => m.senderPhone === phone && m.receiverPhone === currentUser.phone && !m.isRead).length;
    return { user: u, lastMsg, unreadCount };
  }).filter(item => item.user);

  // Sắp xếp các cuộc chat có tin nhắn mới nhất lên đầu
  chatList.sort((a, b) => {
    if (!a.lastMsg) return -1;
    if (!b.lastMsg) return 1;
    return b.lastMsg.messageId.localeCompare(a.lastMsg.messageId);
  });

  const currentThread = messages.filter(m => 
    (m.senderPhone === currentUser.phone && m.receiverPhone === activeChat?.phone) ||
    (m.senderPhone === activeChat?.phone && m.receiverPhone === currentUser.phone)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* LEFT COLUMN: DANH SÁCH CUỘC TRÒ CHUYỆN */}
      <div className={`md:col-span-4 border-r border-gray-200 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-bold text-lg text-bme-primary flex items-center gap-2"><MessageSquare size={20} /> Tin nhắn</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatList.length === 0 && <p className="text-center text-gray-500 text-sm mt-10">Chưa có cuộc trò chuyện nào.</p>}
          {chatList.map((item, idx) => (
            <div key={idx} onClick={() => setActiveChat(item.user)} className={`flex items-center gap-3 p-4 border-b cursor-pointer transition ${activeChat?.phone === item.user.phone ? 'bg-blue-50 border-l-4 border-l-bme-primary' : 'hover:bg-gray-50'}`}>
              <Avatar src={item.user.avatar} name={item.user.name} size={48} userId={item.user.id} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <p className="font-bold text-gray-800 truncate pr-2">{item.user.name}</p>
                  {item.lastMsg && <span className="text-[10px] text-gray-400 whitespace-nowrap">{item.lastMsg.timestamp}</span>}
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-sm truncate pr-2 ${item.unreadCount > 0 ? 'font-bold text-gray-800' : 'text-gray-500'}`}>{item.lastMsg ? (item.lastMsg.senderPhone === currentUser.phone ? `Bạn: ${item.lastMsg.content}` : item.lastMsg.content) : 'Bắt đầu trò chuyện...'}</p>
                  {item.unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.unreadCount}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: KHUNG CHAT CHI TIẾT */}
      <div className={`md:col-span-8 flex flex-col bg-gray-50/30 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageSquare size={64} className="mb-4 opacity-20" />
            <p className="text-lg font-medium text-gray-500">Hãy chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
          </div>
        ) : (
          <>
            {/* Header Chat */}
            <div className="p-4 border-b bg-white flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveChat(null)} className="md:hidden text-gray-500 hover:text-bme-primary"><X size={24} /></button>
                <Avatar src={activeChat.avatar} name={activeChat.name} size={40} userId={activeChat.id} />
                <div><p className="font-bold text-gray-800">{activeChat.name}</p><p className="text-xs text-gray-500">{activeChat.role}</p></div>
              </div>
              <button onClick={() => document.dispatchEvent(new CustomEvent('viewProfile', {detail: activeChat.id}))} className="text-sm font-semibold text-bme-primary hover:underline">Xem hồ sơ</button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
              {currentThread.length === 0 && <p className="text-center text-gray-400 text-sm mt-4">Chưa có tin nhắn nào. Gửi lời chào ngay!</p>}
              {currentThread.map(m => {
                const isMine = m.senderPhone === currentUser.phone;
                return (
                  <div key={m.messageId} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] lg:max-w-[60%] p-3 rounded-2xl ${isMine ? 'bg-bme-primary text-white rounded-br-sm shadow-md' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                      <p className={`text-[10px] mt-1.5 ${isMine ? 'text-blue-200 text-right' : 'text-gray-400 text-left'}`}>{m.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2 bg-gray-100 p-1.5 rounded-full border border-gray-200 focus-within:border-bme-primary focus-within:ring-1 focus-within:ring-blue-100 transition">
                <input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Nhập tin nhắn..." className="flex-1 bg-transparent px-4 py-2 text-sm outline-none text-gray-800" />
                <button onClick={handleSend} disabled={!newMessage.trim()} className={`p-2.5 rounded-full flex items-center justify-center transition ${newMessage.trim() ? 'bg-bme-primary text-white shadow hover:bg-bme-secondary' : 'bg-gray-200 text-gray-400'}`}>
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default {};
