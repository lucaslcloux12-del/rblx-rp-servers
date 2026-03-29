'use client';

import { useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc, deleteDoc, addDoc } from 'firebase/firestore';

type Server = { link: string; status: boolean };
type City = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  active: boolean;
  servers: { [key: string]: Server };
  editors: string[];
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [currentCity, setCurrentCity] = useState<City | null>(null);
  const [isCityManagement, setIsCityManagement] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const isFullAdmin = user?.email === "lucaslcloux12@gmail.com";

  // Carrega cidades em tempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "cities"), (snapshot) => {
      const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as City));
      setCities(list);
    });

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => setUser(u || null));
    return () => { unsubscribe(); unsubscribeAuth(); };
  }, []);

  // Cria Sorocaba City inicial se não existir
  useEffect(() => {
    if (cities.length === 0 && isFullAdmin) {
      addDoc(collection(db, "cities"), {
        name: "Sorocaba City",
        description: "escolha, clique e aproveite o RP!",
        imageUrl: "/sorocaba-avatar.png",
        active: true,
        servers: {
          s1: { link: "https://www.roblox.com/share?code=75edbab073868b4595f7692b49bae680&type=Server", status: true },
          s2: { link: "https://www.roblox.com/share?code=17adcf24b3cff94eae42ebfff10741e0&type=Server", status: true },
          s3: { link: "https://www.roblox.com/share?code=53cb6dd1a69ee7479651883dd5676c4d&type=Server", status: true },
          s4: { link: "", status: false }
        },
        editors: ["lucaslcloux12@gmail.com"]
      });
    }
  }, [cities.length, isFullAdmin]);

  const handleLogin = () => signInWithPopup(auth, googleProvider);
  const handleLogout = () => auth.signOut();

  const openCity = (city: City) => {
    if (city.active) setCurrentCity(city);
  };

  // ====================== GERENCIAR CIDADES (só Lucas) ======================
  const openManagement = () => setIsCityManagement(true);

  const addNewCity = async () => {
    await addDoc(collection(db, "cities"), {
      name: "Nova Cidade",
      description: "escolha, clique e aproveite o RP!",
      imageUrl: "/sorocaba-avatar.png",   // cole aqui o link da imagem
      active: true,
      servers: { s1: {link:"", status:true}, s2:{link:"", status:true}, s3:{link:"", status:true}, s4:{link:"", status:false} },
      editors: ["lucaslcloux12@gmail.com"]
    });
  };

  const saveCity = async () => {
    if (!editingCity) return;
    setIsSaving(true);
    await setDoc(doc(db, "cities", editingCity.id), editingCity);
    setEditingCity(null);
    setIsSaving(false);
  };

  const deleteCity = async (id: string) => {
    if (confirm("Remover esta cidade?")) await deleteDoc(doc(db, "cities", id));
  };

  // ====================== TELA LOGIN ======================
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">RBLX RP</h1>
          <p className="text-2xl text-blue-600 mb-12">Servers</p>
          <div className="bg-white rounded-3xl shadow-2xl p-10">
            <h2 className="text-3xl font-semibold mb-8">Bem-vindo ao mais fácil e acessível site de Rps</h2>
            <button onClick={handleLogin} className="w-full bg-white border-2 border-gray-200 hover:border-blue-500 flex items-center justify-center gap-4 py-6 rounded-3xl text-xl font-medium transition-all hover:shadow-xl">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-8 h-8" />
              Entrar com Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ====================== MENU PRINCIPAL (lista de cidades) ======================
  if (!currentCity && !isCityManagement) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-bold">RBLX RP Servers</h1>
            <div className="flex items-center gap-6">
              {isFullAdmin && <button onClick={openManagement} className="flex items-center gap-2 text-gray-600 hover:text-blue-600">✏️ Gerenciar Cidades</button>}
              <button onClick={handleLogout} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-3xl text-sm font-medium">Sair</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cities.filter(c => c.active).map(city => (
              <div key={city.id} onClick={() => openCity(city)} className="bg-white rounded-3xl overflow-hidden shadow-xl cursor-pointer hover:scale-105 transition-all">
                <img src={city.imageUrl} alt={city.name} className="w-full h-64 object-cover" />
                <div className="p-8 text-center">
                  <h2 className="text-4xl font-bold mb-2">{city.name}</h2>
                  <p className="text-gray-600">{city.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ====================== GERENCIAR CIDADES ======================
  if (isCityManagement) {
    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between mb-8">
            <h1 className="text-4xl font-bold">Gerenciar Cidades</h1>
            <button onClick={() => setIsCityManagement(false)} className="text-blue-600">← Voltar</button>
          </div>
          <button onClick={addNewCity} className="mb-8 px-8 py-4 bg-blue-600 text-white rounded-3xl">+ Nova Cidade</button>

          {cities.map(city => (
            <div key={city.id} className="bg-white rounded-3xl p-6 mb-6 flex items-center gap-6">
              <img src={city.imageUrl} className="w-20 h-20 object-cover rounded-2xl" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{city.name}</h3>
                <p className="text-sm text-gray-500">Editores: {city.editors.join(", ")}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditingCity(city)} className="px-6 py-3 border rounded-3xl">Editar</button>
                <button onClick={() => deleteCity(city.id)} className="px-6 py-3 text-red-600 border border-red-300 rounded-3xl">Remover</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ====================== TELA DE UMA CIDADE ======================
  if (currentCity) {
    const canEdit = isFullAdmin || currentCity.editors.includes(user.email!);

    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between mb-8">
            <button onClick={() => setCurrentCity(null)} className="text-blue-600">← Voltar</button>
            {canEdit && <button onClick={() => setEditingCity(currentCity)} className="flex items-center gap-2 text-gray-600">✏️ Editar servidores</button>}
          </div>

          <div className="text-center mb-10">
            <img src={currentCity.imageUrl} className="w-80 h-80 mx-auto object-cover rounded-full border-8 border-white shadow-2xl mb-8" />
            <h2 className="text-5xl font-bold">{currentCity.name}</h2>
            <p className="text-xl text-gray-600 mt-3">{currentCity.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(currentCity.servers).map(([key, srv], i) => {
              const emoji = ['🟢','🟡','🔴','🟣'][i];
              return (
                <a
                  key={key}
                  href={srv.status ? srv.link : "#"}
                  target={srv.status ? "_blank" : undefined}
                  className={`block p-8 rounded-3xl shadow-xl border transition-all ${
                    srv.status 
                      ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer border-green-200' 
                      : 'opacity-60 cursor-not-allowed pointer-events-none border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{emoji}</span>
                    <div>
                      <div className="text-2xl font-semibold">Servidor {i+1}</div>
                      <div className={`text-sm ${srv.status ? 'text-green-600' : 'text-gray-500'}`}>
                        ⨳ {srv.status ? 'Online • Entrar agora' : 'Offline • Servidor fechado'}
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
