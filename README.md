# Mở Quà Hỷ

Webgame tiệc cưới của Quang Trưởng và Hồng Nhung: 10 câu hỏi, phần xếp chữ, vòng quay quà ngẫu nhiên, âm thanh và màn hình điều khiển cho MC. Game chạy hoàn toàn trong trình duyệt; lượt chơi được lưu trên **chính trình duyệt/máy đang mở**.

## Chạy trên máy

Yêu cầu Node.js 22 trở lên.

```bash
npm ci
npm run dev
```

Mở địa chỉ do Vite hiển thị, thường là `http://localhost:5173/`. Để kiểm tra bản phát hành: `npm run build` rồi `npm run preview`.

## Trước khi chiếu

Mở **Kiểm tra trước tiệc** ở màn đầu hoặc trong **MC ⚙**. Đợi trạng thái **Chơi khi mất mạng** báo đủ tệp, thử loa, bật toàn màn hình và tải bản sao lượt chơi. Sau lần tải đầu thành công, trình duyệt có thể mở lại game khi mất mạng trên chính thiết bị đó. Mỗi lần cập nhật web, hãy mở trang khi có mạng để tải bản mới trước khi ngắt mạng.

Phím tắt cho MC: `H` mở điều khiển, `M` bật/tắt âm thanh, `F` bật/tắt toàn màn hình, `Space` tạm dừng/tiếp tục vòng quay và `→` sang câu tiếp theo sau khi đã mở quà. Phím tắt không hoạt động khi hộp thoại đang mở.

## Tự đưa lên GitHub Pages

Repo đã có workflow `.github/workflows/deploy-pages.yml`. Sau khi mã nguồn được đẩy lên GitHub:

1. Vào **Settings → Pages** của repo.
2. Ở **Build and deployment → Source**, chọn **GitHub Actions**.
3. Vào tab **Actions**, mở workflow **Deploy GitHub Pages** và chọn **Run workflow** nếu lần chạy đầu chưa tự bắt đầu hoặc đã thất bại trước khi bật Pages.
4. Chờ workflow hoàn tất; đường dẫn sẽ có dạng `https://<tai-khoan>.github.io/<ten-repo>/`.

Các lần đẩy mã tiếp theo lên nhánh `main` sẽ tự cập nhật web. Workflow tự đặt đường dẫn tài nguyên theo tên repo. Tùy gói GitHub của bạn, Pages từ repo riêng tư có thể bị giới hạn; có thể dùng repo công khai hoặc một dịch vụ host static khác.

## Trước khi dùng tại tiệc cưới

- Mở web trên máy trình chiếu và thử một lượt quay, nhạc, video giải đặc biệt.
- Lượt chơi không đồng bộ giữa các máy hoặc trình duyệt. Dùng **MC ⚙ → Lưu lượt chơi** để tải bản sao JSON; xem [RUNBOOK.md](RUNBOOK.md) để vận hành và khôi phục.
- Repo chứa ảnh, nhạc và đoạn video dùng trong game. Hãy kiểm tra quyền chia sẻ các tệp này trước khi đặt repo hoặc Pages ở chế độ công khai.
