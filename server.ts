import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Enable JSON body parser with generous limit for audio and image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const DB_FILE = path.join(process.cwd(), 'orders_db.json');

// Initial seed orders if database file doesn't exist
const INITIAL_ORDERS_DATA = [
  {
    id: 'ord-101',
    orderNumber: 'ZH-8491',
    type: 'creative',
    title: 'दीपावली महोत्सव ऑफ़र पोस्टर (त्यौहार ग्रीटिंग)',
    date: 'आज, 11:20 AM',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    status: 'प्रगति पर',
    total: 419,
    itemsCount: 1,
    deliveryAddress: 'डिजिटल डिलीवरी (WhatsApp पर)',
    eta: 'आज दोपहर 3:00 PM तक (एक्सप्रेस 4 घंटे)',
    imageThumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI1hSrZzA3YHHeNWodSyhbjzoQM_fyFfiWpg0sbTmLocACbO-sN0rFbFqATfTYa_VlCCfOOYWR6UiBgpTxWcq9BVczIHuu-vipfq5Atenn2EPgty-NhkObvGYysXmUNS_HYOpJECkEaE_BHGrkMS_vzPc1qUczRQsySiZlaNp8GEBQEW751ytTXi7qEXfcPcmg1OGzY0mJrUM7u-U8Bxp3RtA6QCQ2iMUOfdEoV77vN5BxaZE28awdcRfoqzEJd3H3hjM',
    customerName: 'राजेश शर्मा (शर्मा स्वीट्स)',
    whatsappNumber: '9897012345',
    city: 'देहरादून, उत्तराखंड',
    posterCategory: 'त्यौहार / फेस्टिवल ग्रीटिंग व सेल',
    posterSize: '1:1 स्क्वायर (Instagram व Facebook पोस्ट)',
    languagePreference: 'हिंदी व अंग्रेज़ी मिक्स',
    requirementsText: 'दीपावली के लिए शुद्ध देशी घी की मिठाइयों पर 20% की छूट का सुंदर पोस्टर बनाना है। मुख्य हेडिंग: "शुद्धता और मिठास का संगम - शर्मा स्वीट्स"। नीचे पता: राजपुर रोड, देहरादून और फ़ोन नंबर लिखा हो। बैकग्राउंड में दीये और स्वर्णिम रंग होने चाहिए।',
    turnaroundSpeed: 'एक्सप्रेस (4 घंटे)',
    includeSourceFiles: true,
    adminNotes: 'ग्राहक ने उच्च रिज़ॉल्यूशन Canva लिंक भी मांगा है। डिज़ाइनर अमित को सौंपा गया।'
  },
  {
    id: 'ord-102',
    orderNumber: 'ZH-6204',
    type: 'organic',
    title: 'शुद्ध बद्री गाय का A2 घी (500ml) और कच्चा जंगली शहद',
    date: 'आज, 09:45 AM',
    timestamp: Date.now() - 1000 * 60 * 60 * 4,
    status: 'डिस्पैच हेतु तैयार',
    total: 1270,
    itemsCount: 2,
    deliveryAddress: 'फ्लैट 402, पाइन व्यू रेजीडेंसी, राजपुर रोड, देहरादून 248001',
    eta: 'आज शाम 5:30 PM (पहाड़ी कोल्ड-चेन एक्सप्रेस)',
    imageThumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsphtstxS6sEOxitKLMaTmLWDI42eHNT_Sq4UCcFER1_W624c6zf0Jp5XmG7NZb8dAbyuGfvXeoZswqgm6YWwRUk6vACWEDX98l5_AkIfDcJTb-r7kCfA8GRIfQLVKP9vRm0Bfc-kLUuUfbo3QREkm10DXTGdFaZIFHi1B4_-WtB38WMB0v_CivIGxKhKBNvcNxs7TszkOHwbO7jXPxlEo3s9Kw_VTM6iosiPdYkfzj8qrDeLW0uOxzw',
    customerName: 'अंकिता नेगी',
    whatsappNumber: '9412098765',
    city: 'देहरादून, उत्तराखंड',
    adminNotes: 'बैच नंबर 48 का शुद्ध घी पैक किया गया है।'
  },
  {
    id: 'ord-103',
    orderNumber: 'ZH-3912',
    type: 'creative',
    title: 'रेस्टोरेंट मेन्यू और डिजिटल फ़ूड कैटलॉग',
    date: 'कल, 04:15 PM',
    timestamp: Date.now() - 1000 * 60 * 60 * 20,
    status: 'पूर्ण',
    total: 499,
    itemsCount: 1,
    deliveryAddress: 'WhatsApp व ईमेल: cafehimalaya@gmail.com',
    eta: 'सफलतापूर्वक डिलीवर किया गया',
    imageThumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI1hSrZzA3YHHeNWodSyhbjzoQM_fyFfiWpg0sbTmLocACbO-sN0rFbFqATfTYa_VlCCfOOYWR6UiBgpTxWcq9BVczIHuu-vipfq5Atenn2EPgty-NhkObvGYysXmUNS_HYOpJECkEaE_BHGrkMS_vzPc1qUczRQsySiZlaNp8GEBQEW751ytTXi7qEXfcPcmg1OGzY0mJrUM7u-U8Bxp3RtA6QCQ2iMUOfdEoV77vN5BxaZE28awdcRfoqzEJd3H3hjM',
    customerName: 'सुनील कंडारी',
    whatsappNumber: '9837123987',
    city: 'ऋषिकेश / हरिद्वार',
    posterCategory: 'दुकान / व्यापार प्रचार व मेन्यू',
    posterSize: 'A4 प्रिंट-रेडी PDF और डिजिटल मेन्यू',
    requirementsText: 'पहाड़ी थाली और ऑर्गेनिक हर्बल चाय का आकर्षक मेन्यू कार्ड। फोटो अटैच की गई थीं।',
    turnaroundSpeed: 'स्टैंडर्ड (24 घंटे)',
    includeSourceFiles: false,
    adminNotes: 'ग्राहक ने 5 स्टार रेटिंग दी।'
  }
];

// Helper functions for Database
function getOrders(): any[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading DB_FILE:', err);
  }
  // Initialize with seed data
  saveOrders(INITIAL_ORDERS_DATA);
  return INITIAL_ORDERS_DATA;
}

function saveOrders(orders: any[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB_FILE:', err);
  }
}

// ------------------- API ROUTES -------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Zenith Himalayan Full-Stack Platform',
    timestamp: new Date().toISOString()
  });
});

// Get all orders with optional filter/search
app.get('/api/orders', (req, res) => {
  try {
    const { search, status, type } = req.query;
    let orders = getOrders();

    if (type && type !== 'all') {
      orders = orders.filter(o => o.type === type);
    }

    if (status && status !== 'all') {
      orders = orders.filter(o => o.status === status);
    }

    if (search && typeof search === 'string') {
      const query = search.toLowerCase().trim();
      orders = orders.filter(o =>
        (o.orderNumber && o.orderNumber.toLowerCase().includes(query)) ||
        (o.customerName && o.customerName.toLowerCase().includes(query)) ||
        (o.whatsappNumber && o.whatsappNumber.includes(query)) ||
        (o.title && o.title.toLowerCase().includes(query)) ||
        (o.city && o.city.toLowerCase().includes(query))
      );
    }

    // Sort by newest first
    orders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single order by ID
app.get('/api/orders/:id', (req, res) => {
  try {
    const orders = getOrders();
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'ऑर्डर नहीं मिला' });
    }
    res.json({ success: true, order });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Place / Create New Order (Rich Creative Poster Order or Organic Harvest Order)
app.post('/api/orders', (req, res) => {
  try {
    const payload = req.body;
    const orders = getOrders();

    const orderNumber = `ZH-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      orderNumber,
      type: payload.type || 'creative',
      title: payload.title || 'पोस्टर व ग्राफिक डिज़ाइन ऑर्डर',
      date: 'आज, ' + new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      status: 'नया ऑर्डर',
      total: Number(payload.total) || 299,
      itemsCount: Number(payload.itemsCount) || 1,
      deliveryAddress: payload.deliveryAddress || `${payload.city || 'देहरादून'} (डिजिटल डिलीवरी)`,
      eta: payload.eta || 'एक्सप्रेस डिलीवरी 4 घंटे के भीतर',
      imageThumbnail: payload.imageThumbnail || (payload.uploadedImages && payload.uploadedImages[0]) || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI1hSrZzA3YHHeNWodSyhbjzoQM_fyFfiWpg0sbTmLocACbO-sN0rFbFqATfTYa_VlCCfOOYWR6UiBgpTxWcq9BVczIHuu-vipfq5Atenn2EPgty-NhkObvGYysXmUNS_HYOpJECkEaE_BHGrkMS_vzPc1qUczRQsySiZlaNp8GEBQEW751ytTXi7qEXfcPcmg1OGzY0mJrUM7u-U8Bxp3RtA6QCQ2iMUOfdEoV77vN5BxaZE28awdcRfoqzEJd3H3hjM',

      // Detailed specifications
      customerName: payload.customerName || 'अतिथि ग्राहक',
      whatsappNumber: payload.whatsappNumber || '',
      city: payload.city || 'देहरादून / दिल्ली',
      posterCategory: payload.posterCategory || 'सामान्य पोस्टर डिज़ाइन',
      posterSize: payload.posterSize || '1:1 स्क्वायर (सोशल मीडिया)',
      languagePreference: payload.languagePreference || 'हिंदी',
      requirementsText: payload.requirementsText || '',
      voiceNoteAudioUrl: payload.voiceNoteAudioUrl || null,
      voiceNoteDuration: payload.voiceNoteDuration || 0,
      uploadedImages: payload.uploadedImages || [],
      turnaroundSpeed: payload.turnaroundSpeed || 'एक्सप्रेस (4 घंटे)',
      includeSourceFiles: Boolean(payload.includeSourceFiles),
      adminNotes: payload.adminNotes || 'नया ऑर्डर प्राप्त हुआ, शीघ्र संपर्क करें।'
    };

    orders.unshift(newOrder);
    saveOrders(orders);

    console.log(`[Zenith API] New Order Placed: #${newOrder.orderNumber} by ${newOrder.customerName}`);

    res.status(201).json({
      success: true,
      message: 'ऑर्डर सफलतापूर्वक दर्ज कर लिया गया है!',
      order: newOrder
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update order status or admin notes
app.patch('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'ऑर्डर नहीं मिला' });
    }

    if (status !== undefined) {
      orders[index].status = status;
    }
    if (adminNotes !== undefined) {
      orders[index].adminNotes = adminNotes;
    }

    saveOrders(orders);
    res.json({
      success: true,
      message: 'ऑर्डर अपडेट हो गया',
      order: orders[index]
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete order
app.delete('/api/orders/:id', (req, res) => {
  try {
    const { id } = req.params;
    let orders = getOrders();
    const beforeCount = orders.length;
    orders = orders.filter(o => o.id !== id);

    if (orders.length === beforeCount) {
      return res.status(404).json({ success: false, message: 'ऑर्डर नहीं मिला' });
    }

    saveOrders(orders);
    res.json({ success: true, message: 'ऑर्डर हटा दिया गया' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Dashboard stats
app.get('/api/stats', (req, res) => {
  try {
    const orders = getOrders();
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const creativeCount = orders.filter(o => o.type === 'creative').length;
    const organicCount = orders.filter(o => o.type === 'organic').length;
    const pendingCount = orders.filter(o => o.status === 'नया ऑर्डर' || o.status === 'प्रगति पर').length;
    const completedCount = orders.filter(o => o.status === 'पूर्ण').length;

    res.json({
      success: true,
      stats: {
        totalOrders: orders.length,
        totalRevenue,
        creativeCount,
        organicCount,
        pendingCount,
        completedCount
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------- VITE MIDDLEWARE SETUP -------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Zenith Himalayan Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
