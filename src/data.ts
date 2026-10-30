export type QuizQuestion = {
  id: number;
  kind: 'choice' | 'letters';
  prompt: string;
  options?: string[];
  correct?: number;
  letters?: string[];
  answer?: string;
  sticker: string;
};

export type Gift = { id: number; title: string; item: string; icon: string };

export const questions: QuizQuestion[] = [
  { id: 1, kind: 'choice', prompt: 'Chú rể đã tăng bao nhiêu kg kể từ khi quen cô dâu?', options: ['5 kg', '7 kg', '10 kg', '15 kg'], correct: 3, sticker: 'image11.png' },
  { id: 2, kind: 'choice', prompt: 'Số đo ba vòng theo “hồ sơ vui” của ban tổ chức dành cho chú rể là bao nhiêu?', options: ['90–70–90 cm', '102–90–100 cm', '110–80–95 cm', '100–100–100 cm'], correct: 1, sticker: 'image14.png' },
  { id: 3, kind: 'choice', prompt: 'Bệnh nghề nghiệp của cô dâu khiến chú rể sợ nhất là gì?', options: ['Bắt chú rể phát âm chuẩn âm cuối', 'Giao bài tập về nhà mỗi cuối tuần', 'Nhìn đâu cũng bắt lỗi chính tả', 'Trừ điểm thi đua mỗi khi chồng làm sai việc nhà'], correct: 2, sticker: 'image8.png' },
  { id: 4, kind: 'choice', prompt: 'Cô dâu thường làm gì khi ngồi sau chú rể trên xe?', options: ['Chỉ đường', 'Hát nhạc chế', 'Hỏi xem hôm nay ăn gì', 'Bàn chuyện showbiz'], correct: 1, sticker: 'image16.png' },
  { id: 5, kind: 'choice', prompt: 'Trong điện thoại chú rể, cô dâu được lưu bằng tên gì?', options: ['Hồng Nhung', 'Vợ yêu', 'Nóc nhà', 'Một cái tên rất tình cảm nhưng không tiện công khai'], correct: 3, sticker: 'image13.png' },
  { id: 6, kind: 'choice', prompt: 'Nếu phải thi IELTS về độ hiểu chú rể, cô dâu tự chấm mình bao nhiêu?', options: ['4.0 — nghe được nhưng chưa hiểu ý', '6.0 — giao tiếp ổn trong tình huống quen thuộc', '8.0 — hiểu cả những điều chưa nói', 'Chưa có điểm vì giám khảo vẫn đang xem xét'], correct: 1, sticker: 'image9.jpg' },
  { id: 7, kind: 'choice', prompt: 'Sau đám cưới, “dự án ma” nào của hai người có khả năng được triển khai đầu tiên?', options: ['Giảm cân', 'Tập thể dục mỗi ngày', 'Đi tuần trăng mật', 'Sửa nhà'], correct: 1, sticker: 'image12.png' },
  { id: 8, kind: 'letters', prompt: 'Bài tập thể dục tại nhà giúp chú rể vừa vận động, vừa tăng điểm trong mắt cô dâu.', letters: ['L', 'A', 'N', 'H', 'À', 'U'], answer: 'LAU NHÀ', sticker: 'image15.png' },
  { id: 9, kind: 'letters', prompt: 'Địa điểm cô dâu muốn chú rể đưa đi mỗi tháng một lần.', letters: ['O', 'P', 'Ê', 'C', 'H', 'È', 'M', 'À'], answer: 'CÀ PHÊ MÈO', sticker: 'image7.png' },
  { id: 10, kind: 'letters', prompt: 'Món ăn đầu tiên cô dâu nấu mà chú rể được thưởng thức.', letters: ['Đ', 'Ứ', 'N', 'G', 'C', 'H', 'Ú', 'T', 'T', 'R', 'Ị', 'T'], answer: 'TRỨNG ĐÚC THỊT', sticker: 'image10.png' },
];

export const gifts: Gift[] = [
  { id: 1, title: 'Tổ chức áo đen', item: '1 kg gạo lứt', icon: '🌾' },
  { id: 2, title: 'Cách để hết khô khan', item: 'Giấy ướt', icon: '💧' },
  { id: 3, title: 'Bộ sưu tập 4 mùa', item: '4 mì cốc', icon: '🍜' },
  { id: 4, title: 'Ok-cho oppa', item: 'Sữa hạt', icon: '🥛' },
  { id: 5, title: 'Tẩy trắng cuộc đời', item: 'Nước rửa bát', icon: '🫧' },
  { id: 6, title: 'Thuốc nhuận tràng', item: 'Cà phê hòa tan', icon: '☕' },
  { id: 7, title: 'Làm mát tâm hồn', item: 'Atiso', icon: '🌿' },
  { id: 8, title: 'Chắc chắn là chấm hết', item: 'Nước mắm + xì dầu', icon: '🍶' },
  { id: 9, title: 'Rửa tay gác kiếm', item: 'Nước rửa tay', icon: '🧴' },
  { id: 10, title: 'Hố đen vũ trụ', item: 'Túi rác', icon: '🗑️' },
];

export const normalizeAnswer = (value: string) => value.normalize('NFC').toLocaleUpperCase('vi-VN').replace(/\s+/g, '');
