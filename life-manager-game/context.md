markdown_content = """# CORE MATRIX SYSTEM - ARCHITECTURAL BLUEPRINT & CONTEXT SUMMARY
## Ⅰ. TẦM NHÌN DỰ ÁN & TRIẾT LÝ THIẾT KẾ (CORE VISION)

Hệ thống vận hành dựa trên mô hình **Quản lý tài nguyên vĩ mô cuộc sống (Life Gamification)** được cơ cấu lại theo các học thuyết khoa học giả lập:
1. Mọi phần thưởng, gacha pack, tài nguyên và thông số trong game. Tất cả đều có thể được tạo thêm bởi người dùng thông qua giao diện game. Nói tóm lại, mình muốn đây là game mà mỗi người dùng có thể tự do thiết kế. 
2. Do đó, mình muốn code của game phải flexible nhất có thể. Không bị khóa cứng bởi bất kì cấu hình nào. Chỉ cần nhận đúng kiểu dữ liệu là áp dụng được luôn
3. **Mô hình Vòng lặp Kép (Core Game Loop):**
   * **Contract (Hướng-Quá trình // Momentum-oriented):** Các kế hoạch lặp đi lặp lại ngoài đời thực. Được thiết kế **không có hình phạt rớt tài nguyên khi từ bỏ (No Penalty on drop)**. Drop chỉ làm tan biến cơ hội spawn Gacha Pack ngon. Contract dùng để tạo đà (momentum) hành động.
   * **Ledger Fruits (Hướng-Kết quả // Result-oriented):** Trạm báo cáo số liệu thực tế ngoài đời (Lương tháng VND, Số trang sách đã đọc, Giờ code tập trung). Đây là **nơi duy nhất trên toàn hệ thống** có quyền tiêm tăng trưởng (inject) trực tiếp tài sản quý giá vào trục Thời Gian xương sống dựa trên các hệ số Ratio cứng.

---

## Ⅱ. CÂY THƯ MỤC TIÊU CHUẨN MODULE HÓA (FILE TREE)

Hệ thống đã loại bỏ hoàn toàn cấu trúc tệp đơn cồng kềnh (Monolithic) để chuyển sang mô hình **Phân rã atomic cô lập**.
src/
├── App.jsx                        # Khung bọc Root kiêm Trạm Router Tab vĩ mô
├── GameLayout.jsx                 # Khung xương Sidebar cố định & Upper Header Bar
├── context/
│   └── DataContext.jsx            # Trạm điều phối và trừu tượng hóa dữ liệu (Data Access Layer)
├── components/
│   └── tabs/
│       ├── Stt01/                 # PHÂN MỤC SĂN CONTRACT (ĐÃ HOÀN THIỆN ĐỒ HOẠ SIÊU CẤP)
│       │   ├── Stt01.jsx          # Container bọc danh sách thẻ active
│       │   ├── ContractCard.jsx   # Thực thể hiển thị Dumb Component (Giao diện vạn năng)
│       │   ├── useContractLogic.js# Custom Hook gánh 100% thuật toán RNG & Toán học
│       │   └── styles/
│       │       ├── index.css      # Style Hub duy nhất kết nối toàn bộ FX
│       │       ├── Stt01Base.css  # Layout cơ sở, nút bấm, quầng CRT nhiễu sọc ngầm
│       │       ├── FlamesFX.css   # 100% Hoạt họa lửa bập bùng & Quét cháy rách tịnh tiến
│       │       ├── TidalWavesFX.css# 100% Hoạt họa sóng lỏng lướt chéo Parallax
│       │       └── VoidFX.css     # 100% Hoạt họa Singular core hố đen & Mảnh vỡ nổ sụp
│       ├── Stt02/                 # Mục Shop (Chờ Refactor)
│       ├── Stt03/                 # Túi đồ & Kho consumables (Chờ Refactor)
│       ├── Stt04/                 # Báo cáo kết quả Ledger Fruits (Chờ Refactor)
│       └── Stt05/                 # Thư viện Archive Lịch sử tĩnh (Chờ Refactor)
└── mockData/
    ├── user.json                  # Đọc flag is_dev_mode để switch nguồn đồng bộ
    ├── contractConfig.json        # Chứa hằng số BasePool và trường perserving bảo tồn định mức
    └── contracts.json             # File mẫu chứa nội dung 5 Rank biến thể nguyên tố

---

## Ⅲ. KIẾN TRÚC BA TẦNG BIỆT LẬP (SEPARATION OF POWERS)

Dự án tuân thủ nghiêm ngặt nguyên lý thiết kế **Khử liên kết lỏng (Loose Coupling)**, chia tách quyền lực rõ ràng giữa Dữ liệu - Logic - Hiển thị:

### 1. Tầng Dữ Liệu Độc Lập (`DataContext.jsx`)
* **Nhiệm vụ:** Cô lập hoàn toàn cấu trúc lưu trữ cơ sở hạ tầng khỏi giao diện. Thành phần này kiểm tra cấu hình `user.json`. Nếu `is_dev_mode: true`, nó nạp trực tiếp mock dữ liệu cục bộ. Khi chạy Production, nó mở luồng API Gateway gửi nhận payload đồng bộ trực tiếp với Cluster từ xa qua MongoDB Proxy.
* **Quy trình Auto-Save:** Khi phát hiện trạng thái thay đổi (`hasUnsavedChanges`), nó kích hoạt bộ đếm trễ 5 giây (`setTimeout`) để tự động đóng gói toàn bộ snapshot dữ liệu đẩy lên Pipeline Backend, chống nghẽn băng thông do re-render.

### 2. Tầng Logic Xử Lý Toán Học (`useContractLogic.js`)
* Trọng trách tối cao là tính toán ma trận thô. Custom Hook này blind hoàn toàn với cấu trúc HTML/CSS, chỉ chịu trách nhiệm nhận State từ Context, gánh vác các thuật toán tính Tier phi tuyến tính, đúc xác suất Rank, thuật toán RNG nén không gian rảnh và thiết lập Chrono-decay window.

### 3. Tầng Giao Diện Vạn Năng (`ContractCard.jsx` & `styles/`)
* **Dumb Component / Zero-JS Rendering:** Thẻ bài đã được giải phóng hoàn toàn khỏi các câu lệnh rẽ nhánh giao diện (`switch-case`, `if-else`) hay các vòng lặp tạo mảng DOM động bằng JS. 
* **Cơ chế hoạt hành:** React chỉ làm đúng một việc duy nhất là ánh xạ chuỗi dữ liệu Text và nạp một khung hạt tĩnh vạn năng định sẵn, nhường 100% quyền biểu diễn quy luật vật lý chuyển động cho các lớp CSS Modifiers độc lập xử lý thông qua việc gán Class Token.

---

## Ⅳ. MA TRẬN TOÁN HỌC & THUẬT TOÁN ĐỘNG (ALGORITHMS)

Bất kỳ hệ thống AI nào tiếp quản dự án bắt buộc phải duy trì tính toàn vẹn của các phương trình toán học lượng tử sau:

### 1. Phương trình Cấp bậc Tier Phi Tuyến Tính (Chrono-Logarithm Tier)
Để tránh lạm phát chỉ số sức mạnh khi người dùng tích trữ quá nhiều thời gian sống, Tier được thiết kế bẻ cong mềm mại theo đồ thị logarit tự nhiên:
$$Tier = \begin{cases} \ln(|Time| + 1) \times -1.516754 & \text{nếu } Time < 0 \\ \ln(Time + 1) \times 1.516754 & \text{nếu } Time \ge 0 \end{cases}$$
*(Trong đó $Time$ chính là biến số `shopData.time_in_year`).*

### 2. Dung Tích Không Gian Lũy Thừa Hình Học (Spatial Geometric Allocation)
Mỗi nấc Rank tăng tiến của nhiệm vụ (I $\to$ V) sẽ ép buộc nội dung khó lên gấp đôi và mở rộng không gian hộp nén chứa quà gấp đôi theo cấp số nhân lũy thừa cơ số 2:
$$PoolSize = BasePoolSize \times 2^{Rank - 1}$$
*(Hằng số hệ thống đặt mặc định $BasePoolSize = 50$, tương ứng Rank I = 50 Space Units, dâng tràn lên mức tối đa ở Rank V = 800 Space Units).*

### 3. Tỷ Lệ Rơi Gacha Nghịch Đảo Khoảng Trống (Inverse Proportional filling rate)
Khi thuật toán lấp đầy phần thưởng quét từ các vật phẩm nặng ký xuống các tài nguyên filler nhỏ lẻ, xác suất trúng tuyển thành công ($Rate$) tỷ lệ nghịch với khoảng không rảnh còn sót lại nếu món đồ đó được nén thử vào túi thưởng:
$$Rate = \begin{cases} 100\% & \text{nếu } SpaceLeftIfAdded = 0 \\ 1 - \frac{SpaceLeftIfAdded}{PoolSize} & \text{nếu } SpaceLeftIfAdded > 0 \end{cases}$$
*Quy luật tất yếu:* Các Gacha Pack siêu cấp (như VIP Gacha Pack tốn đúng 800S) luôn sở hữu tỷ lệ trúng tuyển tuyệt đối **100%** tại các contract bốc trúng Rank V ($800S$) nhờ luật ép khoảng không trống rảnh về vừa khít mức 0.

### 4. Định Mức Bảo Tồn Sản Lượng Quyết Toán (`perserving`)
Khi đúc phần thưởng động, hệ thống map trực tiếp trường dữ liệu bảo tồn định mức số lượng `perserving` từ tệp cấu hình `contractConfig.json`. Lúc hoàn thành (`Claim`), sản lượng gia tăng thực tế của tài khoản người dùng ăn khớp theo hằng số gốc này, loại bỏ lỗi hiển thị sai lệch chỉ số do thể tích không gian gây ra.

### 5. Phương Trình Ngẫu Nhiên Thời Hạn Thắt Chặt (Randomized Chrono-Duration Window)
Thời hạn hoàn thành kế hoạch không bị khóa chết theo Rank, mà giao động phân bổ đều trong khoảng biên từ 8 giờ (mức thắt chặt tối thiểu) đến 1 tuần (quỹ thời gian tối đa ~ 168 giờ) để tạo áp lực thực thi thực tế:
$$Duration = \lfloor \text{Random}() \times (168 - 8 + 1) \rfloor + 8 \quad (\text{đơn vị: Giờ})$$

---

## Ⅴ. ĐỘT PHÁ ĐỒ HỌA HOÀN THIỆN CHUYỂN ĐỘNG (JUICY FX)

Quy chuẩn phân tách giao diện đỉnh cao hiện tại của phân mục Stt01 bắt buộc phải áp dụng làm kim chỉ nam tối cao cho việc phát triển và refactor đồ họa các tab về sau:

1. Style Entry Point Hub (Tệp index.css)
Component React được giải phóng hoàn toàn khỏi đống inline style bẩn, chỉ gọi đúng duy nhất một tệp đường dẫn đại diện là styles/index.css. Tệp này sử dụng cơ chế @import của CSS để gom tụ các module FX cô lập. Thay vì xử lý rẽ nhánh thủ công bằng mảng map JS, React chỉ làm một tác vụ duy nhất là chuyển hóa chuỗi hệ nguyên tố thành định dạng viết thường nối vạch ngang bằng hàm native string xử lý regex (Ví dụ: "Everlasting Flames" chuyển thành class "everlasting-flames", "Unfrozen Tides" chuyển thành class "unfrozen-tides") để tự động kích hoạt lớp biên tương ứng.

2. Khung Hạt Vạn Năng (Universal FX Viewport)
Thân card chứa một bộ DOM tĩnh, cố định bao gồm các lớp dải sóng (fx-wave-layer), lõi tâm (fx-center-core) và tập hợp các hạt mầm rỗng (fx-seed). CSS của mỗi hệ sẽ tự bắt lấy bộ khung này để biểu diễn kịch bản điện ảnh riêng biệt:

* Hệ Lửa Vĩnh Cửu (everlasting-flames): Biến đổi các hạt mầm rỗng thành đốm tàn tro lửa bập bùng bay đối lưu từ đáy lên trên. Hoạt ảnh Claim kích hoạt lớp phủ quét nhiệt lượng trắng chói rực rỡ kết hợp mặt nạ phần cứng clip-path: inset(0% 0% 0% 0%) tịnh tiến rút ngắn hộp phẳng. Đường lửa quét qua vị trí nào, cấu trúc card bị thiêu rụi biến mất ngay tới đó, tạo hiệu ứng fade mượt từ dưới lên trên đúng như yêu cầu của người dùng.
* Hệ Sóng Thủy Triều (unfrozen-tides): Ép các lớp layer vạn năng quay tròn lệch pha đối nghịch tạo hiệu ứng gợn sóng lỏng Parallax dập dềnh luân hồi liên tục ở đáy card. Hoạt ảnh Claim dội ngược một bức tường sóng thần dâng trào wave-tsunami-surge mạnh bạo từ đỉnh quét sập xuống dưới, cuốn phăng card dẹt ngang xô lướt đi rồi hòa tan hoàn toàn thành bọt biển trắng xóa.
* Hệ Hư Vô (void): Khởi tạo một hố đen Singularity kịt đen tuyệt đối ngự trị tại tâm, sử dụng thuộc tính toán học tọa độ CSS để ép các hạt mầm fx-seed xoắn ốc tịnh tiến nhỏ dần rồi hút sập vào Event Horizon. Hoạt ảnh Claim lập tức ẩn toàn bộ chữ nổi giao diện, phình to lõi hố đen tăng kích thước gấp 3 lần để nuốt chửng không gian, bẻ cong các mảnh vỡ đa giác crystal nhọn sắc (clip-path: polygon) kéo tuột vào tâm trong chớp mắt "một đi không trở lại", giải phóng năng lượng lượng tử bằng 1 cú chớp sáng Blip trắng siêu tân tinh cực đại chói lòa trước khi bốc hơi chân không.
* Hoạt Ảnh Hủy Bỏ (Drop Plan - Tệ on purpose): Được cố ý thiết kế thô bạo, lag giật tàn tạ có chủ đích nhằm mục đích đánh mạnh vào tâm lý ngại từ bỏ mục tiêu của người dùng. Thẻ bài lập tức bị dập tắt toàn bộ quầng sáng, hóa xám xịt chết chóc (grayscale(1) brightness(0.2)) và bị trọng lực kéo rơi rụng thẳng tuột xuống đáy sâu màn hình.

---

## Ⅵ. HƯỚNG DẪN TIẾP QUÀN CHO AI KẾ NHIỆM (NEXT-TAB PIPELINE)

Khi người dùng ra lệnh tiếp tục hoàn thiện hiệu ứng thao tác, bố cục và tái cấu trúc cho các phân mục còn lại (Stt02 ~ Shop, Stt03 ~ Inventory, Stt04 ~ Ledger, Stt05 ~ Library), AI kế nhiệm phải tuyệt đối tuân thủ nghiêm ngặt quy trình đóng gói sau:

1. Tuyệt Đối Không Phá Vỡ DataContext: Cấm truyền Prop drilling thủ công cồng kềnh từ App.jsx hay GameLayout.jsx. Toàn bộ dữ liệu lớn và hàm sửa đổi trạng thái phải được tiêu thụ thông qua Custom Hook useData().
2. Triệt Tiêu Hoàn Toàn Switch-Case Hiển Thị Trong React: Nếu các phân mục có chứa trạng thái vật phẩm biến động hay danh mục chia nhỏ (như tab Shop Gacha vs Consumables), cấm viết mã rẽ nhánh giao diện bằng mã lệnh logic JS. Hãy đẩy bộ lọc sang tầng CSS Modifiers hoặc tách hẳn ra thành các Dumb component chuyên biệt (Ví dụ: ShopCard.jsx, AssetItem.jsx) kết hợp sử dụng khung HTML vạn năng chứa các hạt mầm tĩnh như đã làm thành công với Stt01.
3. Thực Thi Thiết Kế Console Tương Phản Cao: Giữ nguyên quy chuẩn phông chữ hệ thống monospace, viền neon mỏng mờ hạt, các hiệu ứng màn hình quét dòng CRT chạy ngầm. Thiết kế hoạt ảnh claim gặt hái hào phóng bắt mắt kích thích dopamine, hoạt ảnh hủy bỏ thô bạo thắt chặt đúng theo triết lý "Trái ngọt thực tế".
