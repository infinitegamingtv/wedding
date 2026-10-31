# Audit webgame Mở Quà Hỷ

Ngày kiểm tra: 30/10/2026. Phạm vi: mã nguồn React/Vite, dữ liệu câu hỏi và quà, tài nguyên trong `public/assets`, build sản phẩm và phản hồi HTTP từ localhost. Quyền điều khiển tab localhost bị tắt trong Work settings, nên các nhận xét giao diện dựa trên CSS và ảnh màn hình người dùng đã gửi; chưa phải kiểm thử trực quan toàn bộ 10 màn ở nhiều kích thước.

## Trạng thái sau chỉnh sửa

- **Đã chấp nhận:** trò chơi chỉ mở trên một máy, nên không cần đồng bộ kho quà giữa nhiều thiết bị.
- **Đã thêm:** bảng điều khiển MC để tạm dừng/phát lại vòng quay, bỏ qua câu với xác nhận hai bước, lưu và khôi phục lượt chơi.
- **Đã thêm:** trạng thái quà đã trao, màn tổng kết quà còn lại và xuất CSV; bản sao JSON được kiểm tra trước khi nhập.
- **Đã tối ưu:** Remotion tải theo nhu cầu, ảnh quà dùng WebP, nhạc nền và SFX dùng MP3. Bản build hiện khoảng 4,6 MB.
- **Đã bỏ phụ thuộc mạng:** trang không tải Google Fonts; máy tổ chức hiện có phông Be Vietnam Pro cài sẵn.
- **Đã sửa:** tên quà, nút tiếp tục và SFX dùng frame của Remotion Player làm mốc thời gian; không còn timer chạy riêng.
- **Đã sửa:** trạng thái “đã hiện đáp án” được lưu cùng lượt chơi và khôi phục sau tải lại.
- **Đã sửa trong CSS:** nút xếp chữ được giữ ở đáy bảng khi cần cuộn, khoảng dọc được thu gọn ở khung 16:9 thấp, chữ phụ lớn và đậm hơn. Độ tương phản của các màu chữ phụ mới trên nền sáng đạt khoảng 6,4–7,5:1.
- **Đã sửa:** ảnh và âm thanh gốc không dùng được chuyển vào `archive/unused-assets`; `public/assets` hiện khoảng 4,0 MB.
- **Đã sửa:** hộp thoại “Chơi lại” giữ focus, xử lý Escape; hoạt ảnh mở quà có nhánh giảm chuyển động.
- **Cần xác nhận trực quan tại máy trình chiếu:** các câu dài ở 1920×1080, 1280×720 và 800×450. Quyền xem tab localhost vẫn bị tắt trong Work settings của phiên này.

Các phát hiện bên dưới ghi lại trạng thái **trước khi chỉnh sửa** để tiện đối chiếu.

## Kết quả tốt

- Build TypeScript/Vite thành công. Trang chủ, mã nguồn và các tài nguyên được kiểm tra đều trả HTTP 200 từ localhost.
- Cả 10 câu hỏi, 10 quà và 10 ảnh quà có dữ liệu hợp lệ. Ba đáp án xếp chữ có đủ chữ, đúng dấu và xử lý được chữ `T` lặp trong câu 10.
- Trong một lượt chơi trên cùng trình duyệt, thứ tự 10 quà được xáo trộn và mỗi câu đúng lấy một quà theo thứ tự đó, không lặp quà trong lượt.
- Các câu xếp chữ hiện có nút tự xếp đáp án; minh họa chỉ xuất hiện sau khi dùng nút này.

## Phát hiện ưu tiên

### P1 — Quà có thể trùng nếu khách chơi trên nhiều thiết bị

Thứ tự quà, số quà đã phát và kết quả chỉ nằm trong `localStorage` của từng trình duyệt (`src/main.tsx`, dòng 15–47, 70–75). Hai điện thoại mở web sẽ xáo trộn và phát quà độc lập. Nếu trò chơi được vận hành trên **một máy chiếu/máy chủ trò chơi**, luồng hiện tại phù hợp. Nếu khách tự chơi trên nhiều điện thoại, không có kho quà chung để bảo đảm 10 phần quà chỉ được phát một lần.

**Hướng xử lý:** chốt rõ mô hình vận hành. Với nhiều thiết bị, cần một phiên chung có máy chủ giữ quyền quyết định quà và ghi nhận quà đã phát.

### P1 — Chữ và nút nhận quà có thể xuất hiện trước hoạt ảnh

Màn quà mở khóa sau `setTimeout(7800)` (`src/main.tsx`, dòng 48–59), còn vòng quay và khung ảnh chạy theo frame của Remotion Player (`src/animations.tsx`, dòng 98–163). Khi tab bị ẩn, máy trình chiếu chậm hoặc Player tạm dừng, hai đồng hồ có thể lệch nhau: tên quà và nút “Câu tiếp theo” hiện trước khi ảnh quà mở xong. SFX cũng dùng các timer riêng trong `src/audio.ts`.

**Hướng xử lý:** điều khiển trạng thái mở quà và mốc âm thanh từ tiến độ Player, hoặc dùng một timeline duy nhất làm nguồn thời gian.

### P2 — Tải lại trang làm trạng thái xếp chữ không nhất quán

`chosenLetters` được lưu nhưng `letterArtRevealed` và `autoFilledLetters` không được lưu (`src/main.tsx`, dòng 34, 43–47). Nếu tải lại sau khi bấm “Hiện đáp án”, chữ vẫn nằm sẵn trong ô nhưng minh họa biến mất; người chơi phải bấm nút lần nữa để xem minh họa.

**Hướng xử lý:** lưu trạng thái đã mở đáp án theo câu hỏi, hoặc xóa các chữ tự xếp khi khôi phục trang.

### P2 — Nội dung có nguy cơ cần cuộn trong khung trình chiếu nhỏ

Màn chơi khóa tỉ lệ 16:9 và ẩn phần tràn ở các khung ngoài; riêng bảng câu hỏi cuộn bên trong (`src/style.css`, dòng 5, 43, 49–51). Ảnh người dùng gửi ở câu 10 đã cho thấy thanh cuộn và chữ cuối bị khuất trước bản sửa gần nhất. CSS mới ép 12 ô đáp án cùng một hàng, nhưng ở cửa sổ 16:9 nhỏ chữ sẽ bị co để vừa chiều ngang. Chưa kiểm tra trực quan sau sửa ở nhiều kích thước.

**Hướng xử lý:** kiểm thử thực tế các câu 5, 6, 9, 10 tại 1920×1080, 1280×720 và 800×450; ưu tiên giữ nút hành động luôn thấy được, cho phần nội dung phụ co lại trước.

### P2 — Gói tài nguyên còn lớn do ảnh không dùng

`public/assets` hiện khoảng **35,7 MB**. Riêng 12 ảnh `image*.png/jpg` chiếm **21,9 MB**; trường `sticker` trong `src/data.ts` không được giao diện sử dụng. Các ảnh `bride.jpg`, `groom.jpg`, `couple.jpg`, hai ảnh hộp quà raster và `wedding-stage.png` cũng không cần cho giao diện hiện tại. Vite vẫn sao chép chúng vào bản phát hành.

**Hướng xử lý:** chuyển tài nguyên dự phòng ra ngoài `public`, giữ lại ảnh chibi đang dùng, 10 ảnh quà và âm thanh. Việc này đặc biệt có ích nếu đưa web lên mạng hoặc phát qua Wi‑Fi tại tiệc cưới.

### P2 — Chữ phụ nhỏ và độ tương phản thấp khi chiếu xa

Một số nhãn giao diện dùng cỡ tối thiểu 9–11 px trong khung 16:9 (`src/style.css`, dòng 44–45; `src/pastel.css`, các lớp `.eyebrow`, `.round-label`). Với màu hiện tại, chữ hồng `#b8708b` trên nền `#fffaf9` đạt khoảng 3,54:1; chữ `#946e7d` đạt khoảng 4,24:1. Cả hai thấp hơn mức 4,5:1 thường dùng cho chữ nhỏ. Người ngồi xa sân khấu khó đọc tiến độ và nhãn phụ.

**Hướng xử lý:** tăng cỡ chữ phụ quan trọng trên 720p và làm màu chữ đậm hơn; kiểm tra từ khoảng cách trình chiếu thực tế.

### P3 — Hỗ trợ bàn phím và giảm chuyển động còn thiếu

Hộp thoại “Chơi lại” không giữ focus trong hộp thoại và không xử lý Escape (`src/main.tsx`, dòng 138). CSS có `prefers-reduced-motion` cho một số hiệu ứng sân khấu, nhưng vòng quay, chớp sáng và pháo giấy trong Remotion vẫn chạy (`src/animations.tsx`, dòng 98–156). Những điểm này không chặn luồng chơi trên máy chiếu nhưng ảnh hưởng khả năng sử dụng với bàn phím và người nhạy với chuyển động.

**Hướng xử lý:** thêm quản lý focus/Escape cho modal và một chế độ hiệu ứng nhẹ cho màn quà.

## Thứ tự xử lý đề xuất

1. Xác định trò chơi chạy trên một thiết bị hay nhiều thiết bị; nếu nhiều, xử lý kho quà chung trước khi dùng thật.
2. Đồng bộ trạng thái hiện quà với Player.
3. Kiểm thử màn trình chiếu ở các kích thước chuẩn, sửa phần nội dung phải cuộn và tăng độ rõ của chữ phụ.
4. Sửa trạng thái sau tải lại, dọn tài nguyên không dùng, rồi hoàn thiện hỗ trợ bàn phím/chuyển động.
