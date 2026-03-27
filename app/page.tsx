'use client';

import { useState, useEffect } from 'react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'login' | 'menu' | 'detail'>('login');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setView('menu');
      } else {
        setUser(null);
        setView('login');
      }
    });
    return () => unsubscribe();
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

  if (view === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-md w-full mx-auto text-center px-6">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">RBLX RP</h1>
          <p className="text-2xl text-blue-600 mb-12">Servers</p>
          <div className="bg-white rounded-3xl shadow-2xl p-10">
            <h2 className="text-3xl font-semibold mb-8">Bem-vindo ao Sorocaba City</h2>
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white border-2 border-gray-200 hover:border-blue-500 flex items-center justify-center gap-4 py-6 rounded-3xl text-xl font-medium transition-all hover:shadow-xl"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-8 h-8" />
              Entrar com Google
            </button>
            <p className="text-sm text-gray-500 mt-8">O login fica salvo para sempre</p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'menu') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-bold">RBLX RP Servers</h1>
            <button onClick={handleLogout} className="text-sm px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-3xl font-medium">Sair</button>
          </div>
          <div onClick={() => setView('detail')}
               className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-3xl p-16 text-center cursor-pointer hover:scale-105 transition-all shadow-2xl">
            <div className="text-7xl font-bold mb-4">Sorocaba City</div>
            <div className="text-2xl opacity-90">Clique para entrar no servidor</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white to-blue-50">
      <div className="max-w-2xl w-full">
        <button onClick={() => setView('menu')} className="mb-8 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">← Voltar ao menu</button>
        
        <div className="relative w-80 h-80 mx-auto mb-10">
          <img src="/sorocaba-avatar.png" alt="Sorocaba RP" className="w-full h-full object-cover rounded-full border-8 border-white shadow-2xl" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none"></div>
          <div className="bolinha absolute top-12 left-12 w-14 h-14 bg-white rounded-full shadow-[0_0_70px_40px_rgba(255,255,255,0.95)]"></div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold text-gray-900">Sorocaba Rps</h2>
          <p className="text-xl text-gray-600 mt-2">escolha, clique e aproveite o RP!</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <a href="https://www.roblox.com/pt/games/4924922222/Brookhaven-RP?privateServerLinkCode=77346599535120220343297605129322" target="_blank" className="block bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 border border-green-200 transition-all">
            <div className="flex items-center gap-4">
              <span className="text-5xl">🟢</span>
              <div>
                <div className="text-2xl font-semibold">Servidor 1</div>
                <div className="text-green-600 flex items-center gap-1 text-sm">⨳ Online • Entrar agora</div>
              </div>
            </div>
          </a>
          <a href="https://www.roblox.com/pt/games/4924922222/Brookhaven-RP?privateServerLinkCode=91112912204459794256670083567508" target="_blank" className="block bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 border border-yellow-200 transition-all">
            <div className="flex items-center gap-4">
              <span className="text-5xl">🟡</span>
              <div>
                <div className="text-2xl font-semibold">Servidor 2</div>
                <div className="text-yellow-600 flex items-center gap-1 text-sm">⨳ Online • Entrar agora</div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}