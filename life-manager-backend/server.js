// server.js
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();

// Kích hoạt CORS để cho phép dữ liệu từ React Frontend (Port 5173) đi qua cổng 5000 mượt mà
app.use(cors());
app.use(express.json());

// [SỬA LỖI 404]: Định nghĩa các tuyến đường phụ để hứng các request tự động từ trình duyệt
app.get("/", (req, res) => {
  console.log("⚙️ [BACKEND LOG]: Received a raw GET status ping from client interface.");
  res.json({ status: "ONLINE", message: "BYODB Gateway Engine Active" });
});

app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.json({ status: "OK" }); // Triệt tiêu lỗi CSP ngầm của Chrome DevTools
});

// [CORE PIPELINE API]: Tiếp nhận thông tin kết nối và dữ liệu game từ Frontend gửi qua
app.post("/api/save-game", async (req, res) => {
  const { connectionUri, userId, payload } = req.body;

  if (!connectionUri || !userId) {
    console.error("❌ [BACKEND LOG]: Transaction rejected. Missing identifiers.");
    return res.status(400).json({ error: "Missing DB Connection Keys (URI or UserID)" });
  }

  console.log(`\n⚙️ [BACKEND LOG]: Handshake sequence activated for Agent ID: [${userId}]`);
  
  let client;
  try {
    // THIẾT LẬP BỘ CẤU HÌNH ĐỘNG KHỬ CONFLICT CHUỖI KẾT NỐI (SRV VS NON-SRV)
    const clientOptions = {
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4,           // Ép driver phân giải địa chỉ thông qua IPv4
      proxyHost: null      // Đảm bảo không bị nghẽn bởi cấu hình proxy ngầm của Chrome
    };

    // TỰ ĐỘNG PHÂN TÍCH: Chỉ kích hoạt srvMaxHosts nếu người dùng dán chuỗi định dạng srv
    if (connectionUri.startsWith("mongodb+srv://")) {
      clientOptions.srvMaxHosts = 0; // Khống chế lỗi nghẽn mạch DNS mạng local
      console.log("⚙️ [BACKEND LOG]: Giao thức SRV detected. Activating srvMaxHosts flag.");
    } else {
      console.log("⚙️ [BACKEND LOG]: Giao thức Standard TCP detected. Bypassing srv flags to protect connection.");
    }

    // Nạp chuỗi và cấu hình động đã được tính toán sạch sẽ vào Driver
    client = new MongoClient(connectionUri, clientOptions);

    console.log("⚙️ [BACKEND LOG]: Establishing TCP socket handshake with MongoDB Atlas Cluster...");
    await client.connect();
    console.log("⚙️ [BACKEND LOG]: Network Handshake Established.");

    // TÓM TẮT THAY ĐỔI: Chuyển đổi tên Database mục tiêu từ "NeoDrive" sang "EVO-042"
    // Mục đích: Tránh làm ảnh hưởng đến vùng dữ liệu cũ của bạn và đồng bộ đúng kho lưu trữ mới
    const db = client.db("EVO-042");
    const collection = db.collection("vault_collection");

    console.log(`⚙️ [BACKEND LOG]: Committing object structures payload into [EVO-042.vault_collection]...`);
    
    // Thực hiện lưu trữ dữ liệu thông qua cơ chế CamelCase cập nhật đồng bộ
    await collection.updateOne(
      { user_id: userId }, 
      { 
        $set: { 
          vault: payload, // Đóng gói mảng dữ liệu vào biến "vault" 
          updated_at: new Date() 
        } 
      },
      { upsert: true }
    );

    console.log("✅ [BACKEND LOG]: Transaction completed. Status 200 returned.");
    res.json({ 
      status: "SUCCESS", 
      message: "Directly connected and written data to EVO-042 Database!" 
    });

  } catch (error) {
    console.error("❌ [BACKEND CRASH]: MongoDB Driver Exception:", error.message);
    res.status(500).json({ 
      status: "FAILED", 
      error: error.message 
    });
  } finally {
    if (client) {
      await client.close();
      console.log("⚙️ [BACKEND LOG]: Socket pool connection closed safely.");
    }
  }
});

// Chạy server tại cổng 5000
app.listen(5000, () => console.log("🚀 BYODB Core Backend Engine listening on port 5000"));