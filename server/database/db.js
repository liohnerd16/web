/**
 * Universal Database Layer: Supports Local node:sqlite and Turso (libsql) for Cloud.
 */
const { createClient } = require('@libsql/client');
const path = require('path');

const isCloud = !!process.env.TURSO_DATABASE_URL;
const dbPath = path.join(__dirname, 'data.db');

console.log(`Database Mode: ${isCloud ? 'Cloud (Turso)' : 'Local (SQLite)'}`);

const db = createClient({
  url: isCloud ? process.env.TURSO_DATABASE_URL : `file:${dbPath}`,
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

let initPromise = null;

/**
 * Initialize Tables (Ensures tables exist before any queries)
 */
async function initDb() {
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    console.log('Initializing Database Tables...');
    try {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS videos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          embedUrl TEXT NOT NULL,
          category TEXT NOT NULL,
          explanation TEXT NOT NULL,
          imageUrls TEXT,
          referenceLinks TEXT,
          affiliateLinks TEXT,
          seriesTitle TEXT,
          partNumber INTEGER,
          titleVi TEXT,
          descriptionVi TEXT,
          explanationVi TEXT,
          topic TEXT,
          topicVi TEXT
        );
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS comments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          videoId INTEGER NOT NULL,
          username TEXT NOT NULL,
          content TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          isRead INTEGER DEFAULT 0
        );
      `);

      try { await db.execute('ALTER TABLE comments ADD COLUMN isRead INTEGER DEFAULT 0'); } catch (e) {}
      try { await db.execute("ALTER TABLE videos ADD COLUMN explanationRaw TEXT"); } catch (e) {}
      try { await db.execute("ALTER TABLE videos ADD COLUMN explanationViRaw TEXT"); } catch (e) {}
      try { await db.execute("ALTER TABLE videos ADD COLUMN submittedBy INTEGER REFERENCES users(id)"); } catch (e) {}
      try { await db.execute("ALTER TABLE videos ADD COLUMN categoryVi TEXT"); } catch (e) {}
      try { await db.execute("ALTER TABLE videos ADD COLUMN seriesTitleVi TEXT"); } catch (e) {}
      try { await db.execute("ALTER TABLE videos ADD COLUMN avgRating REAL DEFAULT 0"); } catch (e) {}
      try { await db.execute("ALTER TABLE videos ADD COLUMN ratingCount INTEGER DEFAULT 0"); } catch (e) {}

      await db.execute(`
        CREATE TABLE IF NOT EXISTS updates (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          body TEXT NOT NULL,
          postedAt TEXT NOT NULL,
          titleVi TEXT,
          bodyVi TEXT,
          type TEXT DEFAULT 'system'
        );
      `);

      await db.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          username TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          createdAt TEXT NOT NULL,
          resetToken TEXT,
          resetExpires TEXT
        );
      `);

      try { await db.execute('ALTER TABLE users ADD COLUMN resetToken TEXT'); } catch (e) {}
      try { await db.execute('ALTER TABLE users ADD COLUMN resetExpires TEXT'); } catch (e) {}

      await db.execute(`
        CREATE TABLE IF NOT EXISTS notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          type TEXT DEFAULT 'info',
          isRead INTEGER DEFAULT 0,
          createdAt TEXT NOT NULL,
          videoId INTEGER,
          count INTEGER DEFAULT 1,
          FOREIGN KEY (userId) REFERENCES users(id)
        );
      `);
      try { await db.execute('ALTER TABLE notifications ADD COLUMN videoId INTEGER'); } catch (e) {}
      try { await db.execute('ALTER TABLE notifications ADD COLUMN count INTEGER DEFAULT 1'); } catch (e) {}
      try { await db.execute("ALTER TABLE notifications ADD COLUMN titleVi TEXT"); } catch (e) {}
      try { await db.execute("ALTER TABLE notifications ADD COLUMN messageVi TEXT"); } catch (e) {}

      await db.execute(`
        CREATE TABLE IF NOT EXISTS ratings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          videoId INTEGER NOT NULL,
          score INTEGER NOT NULL,
          timestamp TEXT NOT NULL
        );
      `);

      try { await db.execute('ALTER TABLE updates ADD COLUMN titleVi TEXT'); } catch (e) {}
      try { await db.execute('ALTER TABLE updates ADD COLUMN bodyVi TEXT'); } catch (e) {}
      try { await db.execute("ALTER TABLE updates ADD COLUMN type TEXT DEFAULT 'system'"); } catch (e) {}

      // --- PERFORMANCE INDEXES ---
      await db.execute('CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category)');
      await db.execute('CREATE INDEX IF NOT EXISTS idx_videos_topic ON videos(topic)');
      await db.execute('CREATE INDEX IF NOT EXISTS idx_ratings_videoId ON ratings(videoId)');
      await db.execute('CREATE INDEX IF NOT EXISTS idx_comments_videoId ON comments(videoId)');
      await db.execute('CREATE INDEX IF NOT EXISTS idx_notifications_userId ON notifications(userId)');
      await db.execute('CREATE INDEX IF NOT EXISTS idx_videos_submittedBy ON videos(submittedBy)');
      await db.execute('CREATE INDEX IF NOT EXISTS idx_videos_avgRating ON videos(avgRating)');
      await db.execute('CREATE INDEX IF NOT EXISTS idx_notifications_user_created ON notifications(userId, createdAt DESC)');
      // ---------------------------

      await seed();
      console.log('Database Ready.');
    } catch (err) {
      console.error('Database Initialization Error:', err);
      initPromise = null; // Reset promise so it can retry
      throw err;
    }
  })();

  return initPromise;
}

/**
 * Seed Sample Data
 */
async function seed() {
  const samples = [
    [
      "Self-Inflating Balloon - Sick Science! #005",
      "Classic acid-base reaction inflating a balloon with CO2 gas.",
      "https://www.youtube.com/embed/iS2vG1o7Op4",
      "Chemistry",
      "self-inflating-balloon-en.tex",
      JSON.stringify([]),
      JSON.stringify([{ label: "Acid-Base Reactions", url: "https://www.chemguide.co.uk/physical/acidbaseeqia/theories.html" }]),
      JSON.stringify([
        {
          "name": "Bột Baking Soda nguyên chất (500g)",
          "price": "35.000đ",
          "links": [
            { "label": "Shopee", "url": "https://shopee.vn/search?keyword=baking%20soda" },
            { "label": "Lazada", "url": "https://lazada.vn/search?q=baking%20soda" }
          ]
        },
        {
          "name": "Combo 50 bong bóng cao su dày",
          "price": "20.000đ",
          "links": [{ label: "Tiki", url: "https://tiki.vn/search?q=bong%20bong" }]
        }
      ]),
      null, null,
      "Bong bóng tự bơm căng — Sick Science! #005",
      "Phản ứng Axit-Bazơ kinh điển giúp bơm căng bong bóng bằng khí CO2.",
      "self-inflating-balloon.tex",
      null, null,
      "Hóa học", null
    ],
    [
      "How to make Biogas at home from kitchen waste",
      "Turn your food scraps into renewable energy using anaerobic digestion.",
      "https://www.youtube.com/embed/sayFLEDhRgE",
      "Environmental Science",
      "mini-biogas-en.tex",
      JSON.stringify([]),
      JSON.stringify([{ label: "National Geographic - Biogas", url: "https://www.nationalgeographic.org/encyclopedia/biogas/" }]),
      JSON.stringify([
        {
          "name": "Bình nhựa HDPE 20L dày",
          "price": "120.000đ",
          "links": [{ label: "Shopee", url: "https://shopee.vn/search?keyword=binh-nhua-20l" }]
        },
        {
          "name": "Ống nhựa Silicon dẻo 8mm",
          "price": "15.000đ/m",
          "links": [{ label: "Lazada", url: "https://lazada.vn/search?q=ong-silicon-8mm" }]
        }
      ]),
      null, null,
      "Sản xuất Khí sinh học (Biogas) từ rác thải nhà bếp",
      "Biến thức ăn thừa thành năng lượng tái tạo thông qua quá trình phân hủy kỵ khí.",
      "mini-biogas.tex",
      null, null,
      "Khoa học Môi trường", null
    ],
    [
      "Easy to Make Talking Humanoid Robot - Mofiza",
      "Build a smart talking robot using Arduino and recycled cardboard.",
      "https://www.youtube.com/embed/gTIiGMqV5I0",
      "Robotics & Coding",
      "talking-robot-en.tex",
      JSON.stringify([]),
      JSON.stringify([{ label: "Ashraf Minhaj - GitHub", url: "https://github.com/ashraf-minhaj/Mofiza" }]),
      JSON.stringify([
        {
          "name": "Bo mạch Arduino Nano R3",
          "price": "95.000đ",
          "links": [{ label: "Shopee", url: "https://shopee.vn/search?keyword=arduino-nano" }]
        },
        {
          "name": "Module âm thanh DFPlayer Mini",
          "price": "45.000đ",
          "links": [{ label: "Lazada", url: "https://lazada.vn/search?q=dfplayer-mini" }]
        }
      ]),
      null, null,
      "Robot Mofiza: Chế tạo Robot biết nói từ đồ tái chế",
      "Tự tay làm một chú robot thông minh có khả năng giao tiếp cơ bản bằng Arduino.",
      "talking-robot.tex",
      null, null,
      "Robot & Lập trình", null
    ],
    [
        "Pinhole Camera — Photography from Recycled Junk",
        "Build a working pinhole camera from a paint can or cardboard box.",
        "https://www.youtube.com/embed/_194aWsczx0",
        "Physics & Engineering",
        "pinhole-camera-en.tex",
        JSON.stringify([]),
        JSON.stringify([{ label: "Exploratorium — Pinhole Camera", url: "https://www.exploratorium.edu/do-and-notice-making-pinhole-camera" }]),
        JSON.stringify([
          {
            "name": "Phim 35mm màu",
            "price": "180.000đ",
            "links": [{ label: "Shopee", url: "https://shopee.vn/search?keyword=film+35mm" }]
          }
        ]),
        null, null,
        "Máy ảnh lỗ kim — Nhiếp ảnh từ Đồ tái chế",
        "Chế tạo máy ảnh lỗ kim từ vỏ lon hoặc hộp carton cũ.",
        "pinhole-camera.tex",
        null, null,
        "Vật lý & Kỹ thuật", null
        ],
        [
        "DIY Drone from Popsicle Sticks",
        "Build a working mini quadcopter using popsicle sticks and small motors.",
        "https://www.youtube.com/embed/Q-BluEJBHLw",
        "Physics & Engineering",
        "popsicle-drone-en.tex",
        JSON.stringify([]),
        JSON.stringify([{ label: "Science Buddies - Drone Project", url: "https://www.sciencebuddies.org/science-fair-projects/project-ideas/Physics_p102/physics/build-a-mini-drone" }]),
        JSON.stringify([
          {
            "name": "Bộ 4 Động cơ Coreless 716 + Cánh quạt",
            "price": "85.000đ",
            "links": [{ label: "Shopee", url: "https://shopee.vn/search?keyword=dong-co-716-canh-quat" }]
          },
          {
            "name": "Pin LiPo 3.7V 300mAh mini",
            "price": "45.000đ",
            "links": [{ label: "Lazada", url: "https://lazada.vn/search?q=pin-lipo-3.7v-mini" }]
          }
        ]),
        null, null,
        "Chế tạo Drone từ Que kem tái chế",
        "Tự làm một chiếc máy bay 4 cánh mini từ que kem và động cơ đồ chơi cũ.",
        "popsicle-drone.tex",
        null, null,
        "Vật lý & Kỹ thuật", null
        ],
        [
        "High-Power Soldering Station (TX1/TX2 Support)",
        "Build a professional-grade soldering station capable of driving 300W tips for massive thermal recovery.",
        "https://www.youtube.com/embed/NFyhJAHHJzo",
        "Robotics & Coding",
        "soldering-station-en.tex",
        JSON.stringify([]),
        JSON.stringify([{ label: "CL Electronic - Original Video", url: "https://youtu.be/NFyhJAHHJzo" }]),
        JSON.stringify([
          {
            "name": "Mạch trạm hàn TX1/TX2 OLED",
            "price": "350.000đ",
            "links": [{ label: "Shopee", url: "https://shopee.vn/search?keyword=mach-tram-han-tx1" }]
          },
          {
            "name": "Nguồn tổ ong 24V 10A 240W",
            "price": "180.000đ",
            "links": [{ label: "Lazada", url: "https://lazada.vn/search?q=nguon-24v-10a" }]
          }
        ]),
        null, null,
        "Trạm hàn Công suất cao (Hỗ trợ Tip 300W)",
        "Tự chế trạm hàn chuyên nghiệp với khả năng gia nhiệt cực nhanh, hỗ trợ các loại mũi hàn công suất lớn cho mối hàn ngấu và đẹp.",
        "soldering-station.tex",
        null, null,
        "Robot & Lập trình", null
        ],
        [
        "Pocket Soldering Iron from a $0.10 Lighter",
        "Create a functional emergency soldering iron using a simple butane lighter and a piece of copper wire.",
        "https://www.youtube.com/embed/CxDooL7mub8",
        "Physics & Engineering",
        "soldering-lighter-en.tex",
        JSON.stringify([]),
        JSON.stringify([{ label: "SaoReThe Channel - Original Video", url: "https://youtu.be/CxDooL7mub8" }]),
        JSON.stringify([
          {
            "name": "Bật lửa Gas mini (Vỉ 10 cái)",
            "price": "25.000đ",
            "links": [{ label: "Shopee", url: "https://shopee.vn/search?keyword=bat-lua-gas" }]
          },
          {
            "name": "Cuộn dây đồng đỏ 1.5mm (5m)",
            "price": "35.000đ",
            "links": [{ label: "Lazada", url: "https://lazada.vn/search?q=day-dong-do-1.5mm" }]
          }
        ]),
        null, null,
        "Mỏ hàn nhiệt bỏ túi từ Bật lửa 2k",
        "Hướng dẫn chế tạo mỏ hàn nhiệt khẩn cấp cực rẻ từ bật lửa gas và dây đồng, hoạt động dựa trên nguyên lý dẫn nhiệt.",
        "soldering-lighter.tex",
        null, null,
        "Vật lý & Kỹ thuật", null
        ],
        [
          "Jetman Wingsuit - Personal Jet Flight",
          "Explore the engineering behind the world's most advanced jet-powered wingsuit.",
          "https://www.youtube.com/embed/de_YJzKeGKU",
          "Aviation & Craft",
          "jetman-wingsuit-en.tex",
          JSON.stringify([]),
          JSON.stringify([
            { label: "Jetman Official Site", url: "https://www.jetman.com/" },
            { label: "Wikipedia - Yves Rossy", url: "https://en.wikipedia.org/wiki/Yves_Rossy" }
          ]),
          JSON.stringify([
            {
              "name": "GoPro HERO12 Black",
              "price": "9.500.000đ",
              "links": [{ label: "Shopee", url: "https://shopee.vn/search?keyword=gopro-hero-12" }]
            },
            {
              "name": "Tấm sợi Carbon 3K 200x300mm",
              "price": "250.000đ",
              "links": [{ label: "Lazada", url: "https://lazada.vn/search?q=tam-soi-carbon-3k" }]
            }
          ]),
          null, null,
          "Jetman Wingsuit - Bay phản lực cá nhân",
          "Khám phá kỹ thuật đằng sau bộ cánh bay phản lực tiên tiến nhất thế giới.",
          "jetman-wingsuit.tex",
          null, null,
          "Hàng không & Thủ công", null
        ],
    [
      "How Air Conditioners Work",
      "Learn the physics behind air conditioning and heat exchange.",
      "https://www.youtube.com/embed/tYB5ZG4Pes0",
      "Physics & Engineering",
      "how-ac-works-en.tex",
      JSON.stringify([]),
      JSON.stringify([{ label: "HowStuffWorks - Air Conditioners", url: "https://home.howstuffworks.com/ac.htm" }]),
      JSON.stringify([
        { "name": "Digital HVAC Thermometer", "price": "250.000đ", "links": [{ "label": "Shopee", "url": "https://shopee.vn" }] }
      ]),
      null, null,
      "Máy điều hòa hoạt động như thế nào",
      "Khám phá vật lý đằng sau máy điều hòa và quá trình trao đổi nhiệt.",
      "how-ac-works.tex",
      "Thermodynamics",
      "Nhiệt động lực học",
      "Vật lý & Kỹ thuật", null
    ],
    [
      "The Refrigeration Cycle",
      "Detailed explanation of the vapor-compression refrigeration cycle.",
      "https://www.youtube.com/embed/u1XkJapHod0",
      "Physics & Engineering",
      "refrigeration-cycle-en.tex",
      JSON.stringify([]),
      JSON.stringify([{ label: "Wikipedia - Refrigeration Cycle", url: "https://en.wikipedia.org/wiki/Refrigeration_cycle" }]),
      JSON.stringify([
        { "name": "HVAC Pressure Gauge Set", "price": "850.000đ", "links": [{ "label": "Lazada", "url": "https://lazada.vn" }] }
      ]),
      null, null,
      "Chu trình làm lạnh",
      "Giải thích chi tiết về chu trình làm lạnh nén hơi.",
      "refrigeration-cycle.tex",
      "Thermodynamics",
      "Nhiệt động lực học",
      "Vật lý & Kỹ thuật", null
    ],
    [
      "HVAC Working Principles",
      "Understanding the integration of Heating, Ventilation, and Air Conditioning.",
      "https://www.youtube.com/embed/zncp5reFVhU",
      "Physics & Engineering",
      "hvac-principles-en.tex",
      JSON.stringify([]),
      JSON.stringify([{ label: "ASHRAE - HVAC Systems", url: "https://www.ashrae.org/" }]),
      JSON.stringify([
        { "name": "Digital Anemometer", "price": "450.000đ", "links": [{ "label": "Shopee", "url": "https://shopee.vn" }] }
      ]),
      null, null,
      "Nguyên lý hoạt động HVAC",
      "Tìm hiểu sự tích hợp của các hệ thống Sưởi ấm, Thông gió và Điều hòa không khí.",
      "hvac-principles.tex",
      "Thermodynamics",
      "Nhiệt động lực học",
      "Vật lý & Kỹ thuật", null
    ],
    [
      "Refrigerant Gas Charging",
      "How to properly charge refrigerant into an AC system.",
      "https://www.youtube.com/embed/L0fsoH4Gwkg",
      "Physics & Engineering",
      "refrigerant-charging-en.tex",
      JSON.stringify([]),
      JSON.stringify([{ label: "HVAC School - Charging Basics", url: "https://hvacrschool.com/" }]),
      JSON.stringify([
        { "name": "Electronic Refrigerant Scale", "price": "1.200.000đ", "links": [{ "label": "Shopee", "url": "https://shopee.vn" }] }
      ]),
      null, null,
      "Nạp gas máy lạnh",
      "Cách nạp chất làm lạnh đúng kỹ thuật vào hệ thống điều hòa.",
      "refrigerant-charging.tex",
      "Thermodynamics",
      "Nhiệt động lực học",
      "Vật lý & Kỹ thuật", null
    ],
    [
      "Compressor Replacement & Balancing",
      "Professional guide to replacing an HVAC compressor.",
      "https://www.youtube.com/embed/dTJ_eD76shg",
      "Physics & Engineering",
      "compressor-replacement-en.tex",
      JSON.stringify([]),
      JSON.stringify([{ label: "Copeland Compressor Guide", url: "https://www.emerson.com/en-us/brands/copeland" }]),
      JSON.stringify([
        { "name": "HVAC Brazing Torch Kit", "price": "1.500.000đ", "links": [{ "label": "Lazada", "url": "https://lazada.vn" }] }
      ]),
      null, null,
      "Thay thế và cân bằng máy nén",
      "Hướng dẫn chuyên nghiệp về việc thay thế máy nén HVAC.",
      "compressor-replacement.tex",
      "Thermodynamics",
      "Nhiệt động lực học",
      "Vật lý & Kỹ thuật", null
    ],
    [
      "DIY Desk Satellite — ESP32-C3 Solar Model",
      "Build a stunning desk satellite model with ESP32-C3, solar panel, and environmental sensors using circuit-sculpting techniques.",
      "https://www.youtube.com/embed/0zJG3wExY-c",
      "Robotics & Coding",
      "desk-satellite-en.tex",
      JSON.stringify([]),
      JSON.stringify([
        { label: "Hackaday - CSK Desk Satellite", url: "https://hackaday.io/project/190199" },
        { label: "Hey Vector - Project Page", url: "https://sites.google.com/view/huy-materials-used/desk-satellite" }
      ]),
      JSON.stringify([
        {
          "name": "Bo ESP32-C3 SuperMini",
          "price": "85.000đ",
          "links": [
            { "label": "Shopee", "url": "https://shopee.vn/search?keyword=esp32-c3-supermini" },
            { "label": "Lazada", "url": "https://lazada.vn/search?q=esp32+c3+supermini" }
          ]
        },
        {
          "name": "Tấm pin mặt trời 6V 80mA",
          "price": "55.000đ",
          "links": [
            { "label": "Shopee", "url": "https://shopee.vn/search?keyword=pin-mat-troi-6v-80ma" }
          ]
        },
        {
          "name": "Màn hình TFT LCD 0.96\" 160x80",
          "price": "65.000đ",
          "links": [
            { "label": "Tiki", "url": "https://tiki.vn/search?q=st7735+0.96+lcd" }
          ]
        }
      ]),
      null, null,
      "Vệ tinh để bàn DIY — Mô hình ESP32-C3 Năng lượng Mặt trời",
      "Tự tay làm mô hình vệ tinh để bàn với ESP32-C3, pin mặt trời và cảm biến môi trường bằng kỹ thuật circuit-sculpting.",
      "desk-satellite.tex",
      null, null,
      "Robot & Lập trình", null
    ]
  ];

  for (const row of samples) {
    const title = row[0];
    const check = await db.execute({
      sql: 'SELECT id FROM videos WHERE title = ? LIMIT 1',
      args: [title]
    });
    
    if (check.rows.length === 0) {
      await db.execute({
        sql: 'INSERT INTO videos (title, description, embedUrl, category, explanation, imageUrls, referenceLinks, affiliateLinks, seriesTitle, partNumber, titleVi, descriptionVi, explanationVi, topic, topicVi, categoryVi, seriesTitleVi, explanationRaw, explanationViRaw, submittedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        args: [...row, row[4], row[12], null]
      });
    } else {
      await db.execute({
        sql: 'UPDATE videos SET description=?, embedUrl=?, category=?, explanation=?, imageUrls=?, referenceLinks=?, affiliateLinks=?, seriesTitle=?, partNumber=?, titleVi=?, descriptionVi=?, explanationVi=?, topic=?, topicVi=?, categoryVi=?, seriesTitleVi=?, explanationRaw=?, explanationViRaw=?, submittedBy=? WHERE title=?',
        args: [row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11], row[12], row[13], row[14], row[15], row[16], row[4], row[12], null, title]
      });
    }
  }

  // News — system-level updates only (type = 'system')
  const news = [
    ['Site launch', 'Initial release.', new Date().toISOString(), 'Ra mắt website', 'Phiên bản đầu tiên.', 'system'],
    ['Bilingual Support', 'Added English/Vietnamese content.', new Date().toISOString(), 'Hỗ trợ Song ngữ', 'Đã bổ sung nội dung Anh/Việt.', 'system'],
    ['AI Engine Active', 'Gemini translation active.', new Date().toISOString(), 'Kích hoạt AI', 'Động cơ dịch thuật Gemini đã sẵn sàng.', 'system'],
    ['Content Maintenance', 'Removed inconsistent video series and updated with high-quality multi-part tutorials.', new Date().toISOString(), 'Bảo trì nội dung', 'Đã loại bỏ các chuỗi video thiếu nhất quán và cập nhật bằng các hướng dẫn nhiều phần chất lượng cao.', 'system'],
    ['Updated About section content', 'Rewrote the entire Giới thiệu (About) page with improved English and Vietnamese text — more natural and clearer descriptions of the project vision.', new Date().toISOString(), 'Cập nhật nội dung Giới thiệu', 'Đã viết lại toàn bộ nội dung trang Giới thiệu (About) bằng tiếng Anh và tiếng Việt, diễn đạt tự nhiên và rõ ràng hơn về tầm nhìn dự án.', 'system'],
    ['AI Infrastructure Upgrades', 'Upgraded to gemini-3.5-flash model with automatic retry-on-failure across all Gemini calls. Added fallback SQL insertion when AI is unavailable.', new Date().toISOString(), 'Nâng cấp hạ tầng AI', 'Nâng cấp lên model gemini-3.5-flash với cơ chế tự động retry khi lỗi. Thêm fallback insert SQL khi AI không khả dụng.', 'system']
  ];

  for (const item of news) {
    const exists = await db.execute({
      sql: 'SELECT id FROM updates WHERE title = ? LIMIT 1',
      args: [item[0]]
    });
    if (exists.rows.length === 0) {
      await db.execute({
        sql: 'INSERT INTO updates (title, body, postedAt, titleVi, bodyVi, type) VALUES (?, ?, ?, ?, ?, ?)',
        args: item
      });
    }
  }
}

initDb().catch(console.error);
module.exports = { db, initDb };
