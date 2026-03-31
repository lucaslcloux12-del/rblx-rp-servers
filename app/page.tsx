'use client';

import { useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

type Server = {
  link: string;
  status: boolean;
};

type City = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  active: boolean;
  owners: string[];
  servers: Server[];
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'login' | 'menu' | 'detail'>('login');
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // Estados do modal de gerenciar cidades
  const [isEditingCities, setIsEditingCities] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Estados dos servidores originais (mantidos para compatibilidade)
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

    // Carrega cidades
    const unsubscribeCities = onSnapshot(doc(db, "settings", "cities"), (docSnap) => {
      if (docSnap.exists()) {
        setCities(docSnap.data().cities || []);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeCities();
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

  const openCityDetail = (city: City) => {
    if (city.active) {
      setSelectedCity(city);
      setView('detail');
    }
  };

  const openManageCities = () => setIsEditingCities(true);

  const saveCities = async (newCities: City[]) => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, "settings", "cities"), { cities: newCities });
      setCities(newCities);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar. Verifique se está logado com lucaslcloux12@gmail.com");
    } finally {
      setIsSaving(false);
    }
  };

  const addNewCity = () => {
    const newCity: City = {
      id: "city-" + Date.now(),
      name: "Nova Cidade",
      description: "Descrição da nova cidade RP",
      imageUrl: "/sorocaba-avatar.png",
      active: true,
      owners: [],
      servers: [
        { link: "", status: true },
        { link: "", status: true },
        { link: "", status: true },
        { link: "", status: false },
      ]
    };
    saveCities([...cities, newCity]);
  };

  const deleteCity = (id: string) => {
    saveCities(cities.filter(c => c.id !== id));
  };

  const toggleCityActive = (id: string) => {
    const newCities = cities.map(c => c.id === id ? { ...c, active: !c.active } : c);
    saveCities(newCities);
  };

  const saveEditedCity = (updatedCity: City) => {
    const newCities = cities.map(c => c.id === updatedCity.id ? updatedCity : c);
    saveCities(newCities);
    setEditingCity(null);
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

  // LOGIN
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

  // MENU - Grade de Cidades
  if (view === 'menu') {
    return (
      <>
        <Bubbles />
        <div className="min-h-screen p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <h1 className="text-4xl font-bold">RBLX RP Servers</h1>
              <div className="flex gap-4">
                {user?.email === "lucaslcloux12@gmail.com" && (
                  <button onClick={openManageCities} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-3xl font-medium hover:bg-blue-700">
                    ✏️ Gerenciar Cidades
                  </button>
                )}
                <button onClick={handleLogout} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-3xl font-medium">Sair</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cities.map(city => (
                <div
                  key={city.id}
                  onClick={() => openCityDetail(city)}
                  className={`bg-white rounded-3xl overflow-hidden shadow-xl transition-all ${city.active ? 'cursor-pointer hover:scale-105' : 'opacity-60 cursor-not-allowed'}`}
                >
                  <img src={city.imageUrl} alt={city.name} className="w-full h-52 object-cover" />
                  <div className="p-6">
                    <h3 className="text-3xl font-bold mb-2">{city.name}</h3>
                    <p className="text-gray-600 line-clamp-3">{city.description}</p>
                    {!city.active && <span className="mt-4 inline-block px-4 py-1 text-xs bg-gray-200 rounded-full">Desativado</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  // DETAIL DE UMA CIDADE
  if (view === 'detail' && selectedCity) {
    return (
      <>
        <Bubbles />
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white to-blue-50">
          <div className="max-w-2xl w-full px-4">
            <button onClick={() => { setView('menu'); setSelectedCity(null); }} className="mb-8 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">← Voltar às cidades</button>

            <div className="relative w-80 h-80 mx-auto mb-10">
              <img src={selectedCity.imageUrl} alt={selectedCity.name} className="w-full h-full object-cover rounded-full border-8 border-white shadow-2xl" />
            </div>

            <div className="text-center mb-10">
              <h2 className="text-5xl font-bold">{selectedCity.name}</h2>
              <p className="text-xl text-gray-600 mt-3">{selectedCity.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedCity.servers.map((server, i) => {
                const emojis = ['🟢', '🟡', '🔴', '🟣'];
                return server.status ? (
                  <a key={i} href={server.link} target="_blank" className="block bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 border border-green-200 transition-all">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{emojis[i]}</span>
                      <div>
                        <div className="text-2xl font-semibold">Servidor {i + 1}</div>
                        <div className="text-green-600 text-sm">⨳ Online • Entrar agora</div>
                      </div>
                    </div>
                  </a>
                ) : (
                  <div key={i} className="block bg-white rounded-3xl p-8 shadow-xl border border-gray-300 opacity-60 cursor-not-allowed">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{emojis[i]}</span>
                      <div>
                        <div className="text-2xl font-semibold">Servidor {i + 1}</div>
                        <div className="text-gray-500 text-sm">⨳ Offline • Servidor fechado</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }

  // MODAL GERENCIAR CIDADES (completo)
  return (
    <>
      <Bubbles />
      {isEditingCities && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b flex justify-between items-center">
              <h2 className="text-3xl font-bold">Gerenciar Cidades</h2>
              <button onClick={() => setIsEditingCities(false)} className="text-gray-500 hover:text-black text-2xl">✕</button>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              <button onClick={addNewCity} className="w-full py-4 bg-green-600 text-white rounded-3xl font-medium mb-8">+ Adicionar Nova Cidade</button>

              {cities.map(city => (
                <div key={city.id} className="border border-gray-200 rounded-3xl p-6 mb-6 flex flex-col md:flex-row gap-6">
                  <img src={city.imageUrl} className="w-32 h-32 object-cover rounded-2xl" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-semibold">{city.name}</h3>
                      <div className="flex gap-2">
                        <button onClick={() => toggleCityActive(city.id)} className={`px-5 py-1 rounded-full text-sm ${city.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                          {city.active ? 'Ativo' : 'Desativado'}
                        </button>
                        <button onClick={() => deleteCity(city.id)} className="text-red-600 text-sm px-3">Remover</button>
                        <button onClick={() => setEditingCity(city)} className="text-blue-600 text-sm px-3">Editar</button>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-3">{city.description}</p>
                    <p className="text-xs text-gray-400 mt-4">Donos: {city.owners.length ? city.owners.join(', ') : 'Nenhum'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal de edição de cidade individual */}
      {editingCity && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8">
            <h2 className="text-3xl font-bold mb-6">Editar {editingCity.name}</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nome da Cidade</label>
                <input type="text" value={editingCity.name} onChange={e => setEditingCity({...editingCity, name: e.target.value})} className="w-full border border-gray-300 rounded-2xl px-4 py-3" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea value={editingCity.description} onChange={e => setEditingCity({...editingCity, description: e.target.value})} className="w-full border border-gray-300 rounded-2xl px-4 py-3 h-24" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Link da Imagem</label>
                <input type="text" value={editingCity.imageUrl} onChange={e => setEditingCity({...editingCity, imageUrl: e.target.value})} className="w-full border border-gray-300 rounded-2xl px-4 py-3" />
              </div>

              {/* Servidores da cidade */}
              <div>
                <label className="block text-sm font-medium mb-3">Servidores (4 slots)</label>
                {editingCity.servers.map((srv, i) => (
                  <div key={i} className="flex gap-3 mb-4">
                    <span className="text-3xl w-10"> {['🟢','🟡','🔴','🟣'][i]} </span>
                    <input type="text" value={srv.link} onChange={e => {
                      const newServers = [...editingCity.servers];
                      newServers[i].link = e.target.value;
                      setEditingCity({...editingCity, servers: newServers});
                    }} className="flex-1 border border-gray-300 rounded-2xl px-4 py-3 text-sm" placeholder="Link do servidor" />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={srv.status} onChange={e => {
                        const newServers = [...editingCity.servers];
                        newServers[i].status = e.target.checked;
                        setEditingCity({...editingCity, servers: newServers});
                      }} />
                      <span className="text-sm">Online</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={() => setEditingCity(null)} className="flex-1 py-4 border border-gray-300 rounded-3xl">Cancelar</button>
              <button onClick={() => saveEditedCity(editingCity)} disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white rounded-3xl">
                {isSaving ? 'Salvando...' : 'Salvar Cidade'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
