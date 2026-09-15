# 🎵 MELORA — Nền Tảng Âm Nhạc Trực Tuyến Hiện Đại

**Melora** là một nền tảng nghe nhạc trực tuyến (Music Streaming Platform) được thiết kế và phát triển đặc biệt, tập trung tối ưu hóa trải nghiệm cho người yêu nhạc.

### 🎯 Mục tiêu & Hướng tiếp cận (Dự án là gì?)
Được lấy cảm hứng từ các hệ thống âm nhạc hàng đầu quốc tế như Spotify hay Apple Music, Melora mang đến một không gian thưởng thức âm nhạc chuyên nghiệp, cá nhân hoá nhưng vẫn cực kỳ tối giản và dễ sử dụng. Dự án được xây dựng theo kiến trúc công nghệ hiện đại **API-driven** (tách biệt hoàn toàn Frontend và Backend) với các điểm sáng tiếp cận:

- **Trải nghiệm âm nhạc liền mạch (Seamless):** Trình phát nhạc (Player) chạy ngầm độc lập ở dưới cùng, giúp bạn chuyển trang, tìm kiếm mà không hề làm gián đoạn bài hát đang nghe.
- **Tập trung vào Cá nhân hóa:** Cung cấp cho mỗi người dùng một kho thư viện riêng (Quản lý bài hát yêu thích, Lịch sử nghe nhạc, Các danh sách phát được thuật toán AI chắt lọc).
- **Thực tiễn & Sẵn sàng mở rộng:** Ứng dụng tích hợp luồng xử lý người dùng thực tế từ Đăng nhập 1 chạm (Google OAuth), hệ thống cơ sở dữ liệu mạnh mẽ, cho đến các bản phác thảo API để thanh toán/nâng cấp tài khoản tương lai.

---

## 📖 HƯỚNG DẪN SỬ DỤNG TRANG WEB MELORA (USER GUIDE)
Chào mừng bạn đến với **Melora**! Dưới đây là luồng tính năng chính để bạn trải nghiệm website:

### 1. Dành cho Khách truy cập (Chưa đăng nhập)
- **Trang chủ (Home):** Nơi hiển thị siêu mượt các bảng xếp hạng (Trending), bài hát tuyển chọn (AI Mix), danh sách nghệ sĩ nổi bật và album mới ra mắt trong vòng 24h.
- **Tìm kiếm thông minh:** Bấm vào ô tìm kiếm trên Header, một hộp thoại (Modal) sẽ hiện ra cho phép bạn gõ tên bài hát/nghệ sĩ. Hệ thống sẽ tự động tìm và trả về kết quả ngay lập tức (real-time).
- **Nghe thử nhạc:** Bạn có thể bấm nút ▶️ (Play) ở bất kỳ bài hát nào để nghe thử. Tuy nhiên, nếu chưa có tài khoản, hệ thống sẽ tự động điều hướng bạn sang trang Đăng nhập sau **10 giây**.

### 2. Trải nghiệm Người dùng (Tài khoản Member)
- **Đăng ký/Đăng nhập:** Truy cập `/login`. Hệ thống hỗ trợ Đăng nhập chuẩn bằng Email/Mật khẩu hoặc Đăng nhập nhanh 1 chạm bằng Google.
- **Thanh phát nhạc toàn cầu (Player):** 
  - Nằm ở dưới cùng màn hình và phát nhạc xuyên suốt mà không bị ngắt quãng khi bạn di chuyển sang trang khác.
  - Đầy đủ nút tính năng: Phát/Dừng, Bài kế/Trước đó, Thanh tiến trình thông minh (Seek), và Chỉnh âm lượng (Khung Control mượt mà).
- **Thư viện cá nhân (Library):**
  - **Yêu thích (Wishlist):** Bấm biểu tượng 💚 (Trái tim) ở bảng xếp hạng hoặc thanh phát nhạc để đưa bài hát vào playlist Yêu thích trong thư viện.
  - **Lịch sử nghe (History):** Quên mất mình vừa nghe bài gì hay? Truy cập `/history` hoặc tab "Nghe Gần Đây" ở trang chủ để xem lại.

### 3. Tính năng đang phát triển 
- Nâng cấp tài khoản **Premium (Lossless 24-bit)** và thanh toán trực tuyến qua tích hợp ví điện tử VNPay.
- Sáng tạo và chia sẻ Playlist cá nhân cho cộng đồng.
*(Lưu ý: Bạn có thể sử dụng giao diện trên cả Máy tính lẫn Điện thoại. Để tận hưởng toàn bộ tính năng, hãy tạo ngay 1 tài khoản nhé!)*

---

## 🛠 TÀI LIỆU KỸ THUẬT (Dành cho Lập trình viên & AI)

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY
Dự án Melora được tối ưu hóa để chạy trực tiếp trên bất kỳ máy tính nào thông qua hệ thống Container của **Docker**, giúp bạn không cần phải cài đặt phức tạp (Node.js, PHP, MySQL...) lên máy thật.

### Bước 1: Trích xuất / Tải mã nguồn
Để lấy mã nguồn Frontend mới nhất, bạn vui lòng sử dụng lệnh `git clone`:
```bash
git clone https://github.com/lehungvuong2004/melora-web.git
```
*(Nếu bạn đã nhận file ZIP toàn bộ dự án gồm API và Web, hãy giải nén ra một thư mục `melora_Project`).*

### Bước 2: Chuẩn bị môi trường Docker
- Hãy chắc chắn rằng trên máy tính của bạn đã cài đặt **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**.
- Bật phần mềm Docker Desktop lên để Engine bắt đầu chạy.

### Bước 3: Khởi chạy dự án bằng 1 Click
Mở thư mục gốc của dự án (nơi có chứa file `docker-compose.yml`) trong Terminal (Command Prompt / Powershell / Git Bash) và chạy duy nhất lệnh sau:

```bash
docker-compose up -d --build
```

**Giải thích lệnh:**
- `up`: Lệnh khởi chạy toàn bộ các dịch vụ (Database, Backend API, Frontend Web).
- `-d`: (Detached mode) Chạy ngầm để không báo rác log liên tục trên màn hình Terminal của bạn.
- `--build`: Ép Docker tải lại thư viện (npm install, composer install) và build code mới nhất.

### Bước 4: Thưởng thức UI
Quá trình build lần đầu tiên mất khoảng **2-5 phút** tùy thuộc vào tốc độ mạng. Sau khi thành công, bạn có thể truy cập dự án vào các link cục bộ (Localhost) sau:
- 🌐 **Web Frontend (Next.js):** [http://localhost:3000](http://localhost:3000)
- 🔌 **Backend API (Laravel):** [http://localhost:8000](http://localhost:8000)
- 🗄️ **Database (MySQL):** Chạy ở cổng `3306` ngầm định.

### Bước 5: Tắt hệ thống
Khi bạn không muốn sử dụng web nữa hoặc muốn tắt máy tính để tiết kiệm RAM, bạn chỉ cần gõ lệnh tắt container:
```bash
docker compose down
docker compose stop
```
Lệnh này giúp dọn dẹp các tiến trình tạm mà **vẫn giữ nguyên Database** bài hát cho lần chạy tiếp theo.
