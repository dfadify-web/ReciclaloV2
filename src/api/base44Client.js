// Base44 SDK mock — replace with real SDK when available
// Simulates the Base44 platform: auth, entities, and core integrations

const STORAGE_KEY = 'reciclalo_user';
const ACTIONS_KEY = 'reciclalo_actions';
const CHALLENGES_KEY = 'reciclalo_challenges';
const REWARDS_KEY = 'reciclalo_rewards';
const USER_REWARDS_KEY = 'reciclalo_user_rewards';
const BOTTLE_QRS_KEY = 'reciclalo_bottle_qrs';
const PRODUCTS_KEY = 'reciclalo_products';
const CAMPAIGNS_KEY = 'reciclalo_campaigns';

function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function getStore(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function setStore(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Seed initial data if empty
function seedData() {
  if (getStore(PRODUCTS_KEY).length === 0) {
    setStore(PRODUCTS_KEY, [
      { id: generateId(), brand: 'Genérico', type: 'plastico', barcode: '8412600001', base_points: 10, container_color: 'amarillo', image_url: '', is_campaign: false, campaign_bonus: 0 },
      { id: generateId(), brand: 'Coca-Cola', type: 'plastico', barcode: '8410007001', base_points: 10, container_color: 'amarillo', image_url: '', is_campaign: false, campaign_bonus: 0 },
      { id: generateId(), brand: 'Mahou', type: 'vidrio', barcode: '8410520001', base_points: 15, container_color: 'verde', image_url: '', is_campaign: false, campaign_bonus: 0 },
      { id: generateId(), brand: 'Nestlé', type: 'carton', barcode: '7613035001', base_points: 8, container_color: 'azul', image_url: '', is_campaign: false, campaign_bonus: 0 },
      { id: generateId(), brand: 'Lata Genérica', type: 'metal', barcode: '8412600002', base_points: 12, container_color: 'amarillo', image_url: '', is_campaign: false, campaign_bonus: 0 },
    ]);
  }
  if (getStore(CAMPAIGNS_KEY).length === 0) {
    const now = new Date();
    const future = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    setStore(CAMPAIGNS_KEY, [
      {
        id: generateId(), title: 'Semana Verde', description: 'Recicla cualquier envase esta semana y gana puntos extra. ¡Juntos cuidamos el planeta!',
        sponsor: 'Recíclalo', sponsor_logo: '', bonus_points: 20, target_type: 'todos',
        start_date: now.toISOString(), end_date: future.toISOString(),
        image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80', is_active: true,
        created_at: now.toISOString(),
      },
      {
        id: generateId(), title: 'Reto Plástico Cero', description: 'Recicla 10 envases de plástico en un mes y consigue puntos extra.',
        sponsor: 'Recíclalo', sponsor_logo: '', bonus_points: 50, target_type: 'plastico',
        start_date: now.toISOString(), end_date: future.toISOString(),
        image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80', is_active: true,
        created_at: now.toISOString(),
      },
    ]);
  }
  if (getStore(REWARDS_KEY).length === 0) {
    setStore(REWARDS_KEY, [
      { id: generateId(), title: 'Descuento 10%', description: 'Descuento del 10% en tu próxima compra en tiendas colaboradoras.', category: 'descuento', points_required: 150, image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&q=80', stock: 100, is_active: true, sponsor: 'Recíclalo', expires_at: '' },
      { id: generateId(), title: 'Bolsa reutilizable', description: 'Bolsa de tela reutilizable con diseño exclusivo de Recíclalo.', category: 'producto', points_required: 200, image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80', stock: 50, is_active: true, sponsor: 'Recíclalo', expires_at: '' },
      { id: generateId(), title: 'Sorteo bicicleta eléctrica', description: 'Participa en el sorteo de una bicicleta eléctrica valorada en 800€.', category: 'sorteo', points_required: 500, image_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80', stock: 999, is_active: true, sponsor: 'Recíclalo', expires_at: '' },
      { id: generateId(), title: 'Donación árbol plantado', description: 'Dona tus puntos para plantar un árbol en zonas deforestadas de España.', category: 'donacion', points_required: 100, image_url: 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?w=400&q=80', stock: 999, is_active: true, sponsor: 'Recíclalo', expires_at: '' },
      { id: generateId(), title: 'Entrada cine', description: 'Entrada para el cine para 2 personas en Cinesa o Kinépolis.', category: 'experiencia', points_required: 350, image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80', stock: 30, is_active: true, sponsor: 'Recíclalo', expires_at: '' },
    ]);
  }
  if (getStore(BOTTLE_QRS_KEY).length === 0) {
    const qrs = [];
    for (let i = 0; i < 5; i++) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = 'RCLA-';
      for (let j = 0; j < 8; j++) code += chars[Math.floor(Math.random() * chars.length)];
      qrs.push({ id: generateId(), code, product_name: 'Botella 1.5L', product_type: 'plastico', points_value: 15, batch_id: 'BATCH-DEMO', status: 'unused', used_by_email: '', used_at: '', notes: '', created_at: new Date().toISOString() });
    }
    setStore(BOTTLE_QRS_KEY, qrs);
  }
}

seedData();

// ---- AUTH ----
const authListeners = [];
let currentUser = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');

const auth = {
  onAuthStateChanged(cb) {
    authListeners.push(cb);
    cb(currentUser);
    return () => { const i = authListeners.indexOf(cb); if (i > -1) authListeners.splice(i, 1); };
  },
  async signUp({ email, password, fullName }) {
    const user = {
      id: generateId(), email, fullName, role: 'user',
      username: '', provider: 'email',
      total_points: 0, total_recycled: 0, current_streak: 0, best_streak: 0,
      last_recycling_date: '', municipality: '', province: '', community: '',
      avatar_url: '', level: 1, created_at: new Date().toISOString(),
    };
    currentUser = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    authListeners.forEach(cb => cb(user));
    return user;
  },
  async signIn({ email, password }) {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      if (user.email === email) {
        currentUser = user;
        authListeners.forEach(cb => cb(user));
        return user;
      }
    }
    const user = {
      id: generateId(), email, fullName: email.split('@')[0], role: email.includes('admin') ? 'admin' : 'user',
      username: '', provider: 'email',
      total_points: 0, total_recycled: 0, current_streak: 0, best_streak: 0,
      last_recycling_date: '', municipality: '', province: '', community: '',
      avatar_url: '', level: 1, created_at: new Date().toISOString(),
    };
    currentUser = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    authListeners.forEach(cb => cb(user));
    return user;
  },
  async signInWithGoogle({ email, name }) {
    await new Promise(r => setTimeout(r, 900));
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const existing = JSON.parse(stored);
      if (existing.email === email) {
        currentUser = { ...existing, provider: 'google', fullName: name || existing.fullName };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
        authListeners.forEach(cb => cb(currentUser));
        return currentUser;
      }
    }
    const user = {
      id: generateId(), email, fullName: name || email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'user',
      username: '', provider: 'google',
      total_points: 0, total_recycled: 0, current_streak: 0, best_streak: 0,
      last_recycling_date: '', municipality: '', province: '', community: '',
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}&backgroundType=gradientLinear&backgroundColor=57CC99,38A3A5`,
      level: 1, created_at: new Date().toISOString(),
    };
    currentUser = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    authListeners.forEach(cb => cb(user));
    return user;
  },
  async logout() {
    currentUser = null;
    localStorage.removeItem(STORAGE_KEY);
    authListeners.forEach(cb => cb(null));
  },
  async updateMe(updates) {
    if (!currentUser) throw new Error('Not authenticated');
    currentUser = { ...currentUser, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    authListeners.forEach(cb => cb(currentUser));
    return currentUser;
  },
  getMe() { return currentUser; },
};

// ---- ENTITY FACTORY ----
function createEntity(storageKey) {
  return {
    async list(filters = {}) {
      let items = getStore(storageKey);
      if (filters.filters) {
        for (const [key, val] of Object.entries(filters.filters)) {
          items = items.filter(item => item[key] === val);
        }
      }
      if (filters.order_by) {
        const [field, dir] = filters.order_by.includes('-') ? [filters.order_by.slice(1), 'desc'] : [filters.order_by, 'asc'];
        items = [...items].sort((a, b) => {
          if (dir === 'desc') return (b[field] ?? 0) > (a[field] ?? 0) ? 1 : -1;
          return (a[field] ?? 0) > (b[field] ?? 0) ? 1 : -1;
        });
      }
      if (filters.limit) items = items.slice(0, filters.limit);
      return items;
    },
    async get(id) {
      const items = getStore(storageKey);
      return items.find(i => i.id === id) || null;
    },
    async create(data) {
      const items = getStore(storageKey);
      const user = auth.getMe();
      const item = { id: generateId(), created_at: new Date().toISOString(), created_by: user?.email || '', ...data };
      items.push(item);
      setStore(storageKey, items);
      return item;
    },
    async bulkCreate(dataArray) {
      const items = getStore(storageKey);
      const user = auth.getMe();
      const now = new Date().toISOString();
      const newItems = dataArray.map(data => ({ id: generateId(), created_at: now, created_by: user?.email || '', ...data }));
      setStore(storageKey, [...items, ...newItems]);
      return newItems;
    },
    async update(id, data) {
      const items = getStore(storageKey);
      const idx = items.findIndex(i => i.id === id);
      if (idx === -1) throw new Error('Not found');
      items[idx] = { ...items[idx], ...data, updated_at: new Date().toISOString() };
      setStore(storageKey, items);
      return items[idx];
    },
    async delete(id) {
      let items = getStore(storageKey);
      items = items.filter(i => i.id !== id);
      setStore(storageKey, items);
    },
    async filter(filterFn) {
      const items = getStore(storageKey);
      return items.filter(filterFn);
    },
  };
}

// ---- CORE INTEGRATIONS ----
const integrations = {
  Core: {
    async InvokeLLM({ prompt, file_urls, response_json_schema }) {
      // Mock AI responses based on prompt content
      await new Promise(r => setTimeout(r, 1200));

      if (prompt.includes('barcode') || prompt.includes('código de barras')) {
        return { barcode: '8412600001', confidence: 0.85 };
      }
      if (prompt.includes('recicl') && prompt.includes('vídeo')) {
        const approved = Math.random() > 0.2;
        return {
          validation_status: approved ? 'approved' : 'rejected',
          validation_details: approved
            ? 'El vídeo muestra correctamente el reciclaje del envase en el contenedor adecuado.'
            : 'No se puede verificar el reciclaje. Asegúrate de mostrar el envase y el contenedor claramente.',
          confidence: approved ? 0.92 : 0.78,
        };
      }
      if (prompt.includes('QR') || prompt.includes('qr')) {
        const qrs = getStore(BOTTLE_QRS_KEY);
        const unused = qrs.find(q => q.status === 'unused');
        return { qr_code: unused?.code || 'RCLA-NOTFOUND', confidence: 0.9 };
      }
      if (prompt.includes('contenedor') && prompt.includes('esperado:')) {
        await new Promise(r => setTimeout(r, 1800));
        const match = prompt.match(/esperado:(\w+)/);
        const expectedColor = match ? match[1] : 'amarillo';
        const allColors = ['amarillo', 'verde', 'azul', 'marron', 'gris'];
        const isCorrect = Math.random() > 0.15; // 85% acierto
        const detectedColor = isCorrect
          ? expectedColor
          : allColors.filter(c => c !== expectedColor)[Math.floor(Math.random() * 4)];
        return {
          detected_color: detectedColor,
          is_correct: detectedColor === expectedColor,
          confidence: isCorrect ? 0.84 + Math.random() * 0.14 : 0.60 + Math.random() * 0.25,
          message: isCorrect
            ? `Contenedor ${detectedColor} detectado correctamente ✓`
            : `Se detectó el contenedor ${detectedColor}, pero se esperaba el ${expectedColor}.`,
        };
      }
      if (prompt.includes('product') || prompt.includes('producto') || prompt.includes('envase')) {
        return {
          brand: 'Producto Genérico',
          type: 'plastico',
          container_color: 'amarillo',
          base_points: 10,
          confidence: 0.75,
          description: 'Envase de plástico identificado por IA',
        };
      }
      return { result: 'OK', confidence: 0.8 };
    },
    async UploadFile({ file }) {
      await new Promise(r => setTimeout(r, 800));
      return { file_url: URL.createObjectURL(file), file_id: generateId() };
    },
    async SendEmail({ to, subject, body }) {
      console.log('Email sent to', to, subject);
      return { success: true };
    },
    async GenerateImage({ prompt }) {
      await new Promise(r => setTimeout(r, 500));
      return { image_url: `https://picsum.photos/seed/${encodeURIComponent(prompt)}/400/300` };
    },
  },
};

export const base44 = {
  auth,
  entities: {
    Product: createEntity(PRODUCTS_KEY),
    Campaign: createEntity(CAMPAIGNS_KEY),
    Reward: createEntity(REWARDS_KEY),
    RecyclingAction: createEntity(ACTIONS_KEY),
    UserReward: createEntity(USER_REWARDS_KEY),
    UserChallenge: createEntity(CHALLENGES_KEY),
    BottleQR: createEntity(BOTTLE_QRS_KEY),
  },
  integrations,
};

export default base44;
