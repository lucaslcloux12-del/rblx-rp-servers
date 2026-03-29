'use client';

import { useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'login' | 'menu' | 'detail'>('login');
  
  const [serverData, setServerData] = useState({
    link1: "https://www.roblox.com/share?code=75edbab073868b4595f7692b49bae680&type=Server",
    status1: true,
    link2: "https://www.roblox.com/share?code=17adcf24b3cff94eae42ebfff10741e0&type=Server",
    status2: true,
    link3: "https://www.roblox.com/share?code=53cb6dd1a69ee7479651883dd5676c4d&type=Server",
    status3: true,
    link4: "",
    status4: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(serverData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setView('menu');
      } else {
        setUser(null);
        setView('login');
      }
    });

    const unsubscribeLinks = onSnapshot(doc(db, "settings", "servers"), (docSnap) => {
      if (docSnap.exists()) {
        setServerData(docSnap.data() as typeof serverData);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeLinks();
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  const openEditModal = () => {
    setEditData({ ...serverData });
    setIsEditing(true);
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "settings", "servers"), editData);
      setServerData(editData);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar. Verifique se está logado com lucaslcloux12@gmail.com");
    } finally {
      setIsSaving(false);
    }
  };

  const Bubbles = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      <div className="bubble w-8 h-8 left-[10%] top-[20%] animation-delay-0"></div>
      <div className="bubble w-12 h-12 left-[25%] top-[60%] animation-delay-4000"></div>
      <div className="bubble w-6 h-6 left-[40%] top-[10%] animation-delay-8000"></div>
      <div className="bubble w-14 h-14 left-[65%] top-[80%] animation-delay-2000"></div>
      <div className="bubble w-9 h-9 left-[80%] top-[30%] animation-delay-6000"></div>
      <div className="bubble w-5 h-5 left-[5%] top-[90%] animation-delay-12000"></div>
      <div className="bubble w-11 h-11 left-[85%] top-[50%] animation-delay-3000"></div>
      <div className="bubble w-7 h-7 left-[55%] top-[5%] animation-delay-9000"></div>
      <div className="bubble w-10 h-10 left-[15%] top-[70%] animation-delay-15000"></div>
    </div>
  );

  if (view === 'login') {
    return (
      <>
        <Bubbles />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 px-4">
          <div className="max-w-md w-full text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-2">RBLX RP</h1>
            <p className="text-2xl text-blue-600 mb-12">Servers</p>
            <div className="bg-white rounded-3xl shadow-2xl p-10">
              <h2 className="text-3xl font-semibold mb-8">Bem-vindo ao mais fácil e acessível site de Rps</h2>
              <button onClick={handleGoogleLogin} className="w-full bg-white border-2 border-gray-200 hover:border-blue-500 flex items-center justify-center gap-4 py-6 rounded-3xl text-xl font-medium transition-all hover:shadow-xl">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-8 h-8" />
                Entrar com Google
              </button>
              <p className="text-sm text-gray-500 mt-8">Estamos atualizando aos poucos ;) Feito por LucaslcGamer12 Me siga no Roblox! </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (view === 'menu') {
    return (
      <>
        <Bubbles />
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-2xl w-full px-4">
            <div className="flex justify-between items-center mb-12">
              <h1 className="text-4xl font-bold">RBLX RP Servers</h1>
              <button onClick={handleLogout} className="text-sm px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-3xl font-medium">Sair</button>
            </div>
            <div onClick={() => setView('detail')} className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-3xl p-16 text-center cursor-pointer hover:scale-105 transition-all shadow-2xl">
              <div className="text-7xl font-bold mb-4">Sorocaba City</div>
              <div className="text-2xl opacity-90">Clique para selecionar o servidor</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Bubbles />
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-2xl w-full px-4">
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => setView('menu')} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">← Voltar ao menu</button>
            
            {user?.email === "lucaslcloux12@gmail.com" && (
              <button onClick={openEditModal} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors" title="Editar links e status">
                ✏️ <span className="text-sm font-medium">Editar</span>
              </button>
            )}
          </div>

          <div className="relative w-80 h-80 mx-auto mb-10">
            <img src="/sorocaba-avatar.png" alt="Sorocaba RP" className="w-full h-full object-cover rounded-full border-8 border-white shadow-2xl" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none"></div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-5xl font-bold text-gray-900">Sorocaba Rps</h2>
            <p className="text-xl text-gray-600 mt-2">escolha, clique e aproveite o RP!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Servidor 1 */}
            <a 
              href={serverData.status1 ? serverData.link1 : "#"} 
              target={serverData.status1 ? "_blank" : undefined}
              className={`block bg-white rounded-3xl p-8 shadow-xl border transition-all ${
                serverData.status1 
                  ? 'hover:shadow-2xl hover:-translate-y-1 border-green-200 cursor-pointer' 
                  : 'pointer-events-none opacity-60 cursor-not-allowed border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl">🟢</span>
                <div className="flex-1">
                  <div className="text-2xl font-semibold">Servidor 1</div>
                  <div className={`flex items-center gap-1 text-sm ${serverData.status1 ? 'text-green-600' : 'text-gray-500'}`}>
                    ⨳ {serverData.status1 ? 'Online • Entrar agora' : 'Offline • Servidor fechado'}
                  </div>
                </div>
              </div>
            </a>

            {/* Servidor 2 */}
            <a 
              href={serverData.status2 ? serverData.link2 : "#"} 
              target={serverData.status2 ? "_blank" : undefined}
              className={`block bg-white rounded-3xl p-8 shadow-xl border transition-all ${
                serverData.status2 
                  ? 'hover:shadow-2xl hover:-translate-y-1 border-yellow-200 cursor-pointer' 
                  : 'pointer-events-none opacity-60 cursor-not-allowed border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl">🟡</span>
                <div className="flex-1">
                  <div className="text-2xl font-semibold">Servidor 2</div>
                  <div className={`flex items-center gap-1 text-sm ${serverData.status2 ? 'text-green-600' : 'text-gray-500'}`}>
                    ⨳ {serverData.status2 ? 'Online • Entrar agora' : 'Offline • Servidor fechado'}
                  </div>
                </div>
              </div>
            </a>

            {/* Servidor 3 */}
            <a 
              href={serverData.status3 ? serverData.link3 : "#"} 
              target={serverData.status3 ? "_blank" : undefined}
              className={`block bg-white rounded-3xl p-8 shadow-xl border transition-all ${
                serverData.status3 
                  ? 'hover:shadow-2xl hover:-translate-y-1 border-red-200 cursor-pointer' 
                  : 'pointer-events-none opacity-60 cursor-not-allowed border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl">🔴</span>
                <div className="flex-1">
                  <div className="text-2xl font-semibold">Servidor 3</div>
                  <div className={`flex items-center gap-1 text-sm ${serverData.status3 ? 'text-green-600' : 'text-gray-500'}`}>
                    ⨳ {serverData.status3 ? 'Online • Entrar agora' : 'Offline • Servidor fechado'}
                  </div>
                </div>
              </div>
            </a>

            {/* Servidor 4 */}
            <a 
              href={serverData.status4 ? serverData.link4 : "#"} 
              target={serverData.status4 ? "_blank" : undefined}
              className={`block bg-white rounded-3xl p-8 shadow-xl border transition-all ${
                serverData.status4 
                  ? 'hover:shadow-2xl hover:-translate-y-1 border-purple-200 cursor-pointer' 
                  : 'pointer-events-none opacity-60 cursor-not-allowed border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl">🟣</span>
                <div className="flex-1">
                  <div className="text-2xl font-semibold">Servidor 4</div>
                  <div className={`flex items-center gap-1 text-sm ${serverData.status4 ? 'text-green-600' : 'text-gray-500'}`}>
                    ⨳ {serverData.status4 ? 'Online • Entrar agora' : 'Offline • Servidor fechado'}
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* MODAL DE EDIÇÃO (permanece igual) */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
            <h2 className="text-3xl font-bold mb-6 text-center">Editar Servidores</h2>

            <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2">
              <div className="border border-gray-200 rounded-3xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl">🟢 Servidor 1</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={editData.status1} onChange={(e) => setEditData({...editData, status1: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
                <input type="text" value={editData.link1} onChange={(e) => setEditData({...editData, link1: e.target.value})} className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm" placeholder="Link do Servidor 1" />
              </div>

              <div className="border border-gray-200 rounded-3xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl">🟡 Servidor 2</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={editData.status2} onChange={(e) => setEditData({...editData, status2: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
                <input type="text" value={editData.link2} onChange={(e) => setEditData({...editData, link2: e.target.value})} className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm" placeholder="Link do Servidor 2" />
              </div>

              <div className="border border-gray-200 rounded-3xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl">🔴 Servidor 3</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={editData.status3} onChange={(e) => setEditData({...editData, status3: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
                <input type="text" value={editData.link3} onChange={(e) => setEditData({...editData, link3: e.target.value})} className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm" placeholder="Link do Servidor 3" />
              </div>

              <div className="border border-gray-200 rounded-3xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl">🟣 Servidor 4</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={editData.status4} onChange={(e) => setEditData({...editData, status4: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
                <input type="text" value={editData.link4} onChange={(e) => setEditData({...editData, link4: e.target.value})} className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm" placeholder="Link do Servidor 4" />
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={() => setIsEditing(false)} className="flex-1 py-4 rounded-3xl border border-gray-300 font-medium">Cancelar</button>
              <button 
                onClick={saveChanges}
                disabled={isSaving}
                className="flex-1 py-4 rounded-3xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
