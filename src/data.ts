import {assetUrl} from './asset-url';

export type QuizQuestion = {
  id: number;
  kind: 'choice' | 'letters';
  prompt: string;
  options?: string[];
  correct?: number;
  letters?: string[];
  answer?: string;
};

export type Gift = { id: number; title: string; item: string; icon: string; image: string };

export const questions: QuizQuestion[] = [
  { id: 1, kind: 'choice', prompt: 'Chú rể tăng bao nhiêu kg kể từ khi quen cô dâu?', options: ['5 kg', '7 kg', '10 kg', '15 kg'], correct: 3 },
  { id: 2, kind: 'choice', prompt: 'Theo “hồ sơ vui”, số đo ba vòng của chú rể là bao nhiêu?', options: ['90 - 70 - 90', '102 - 90 - 100', '110 - 80 - 95', '100 - 100 - 100'], correct: 3 },
  { id: 3, kind: 'choice', prompt: 'Bệnh nghề nghiệp nào của cô dâu khiến chú rể sợ nhất?', options: ['Bắt chú rể phát âm chuẩn âm cuối', 'Giao bài tập về nhà mỗi cuối tuần', 'Nhìn đâu cũng bắt lỗi chính tả', 'Trừ điểm thi đua khi chồng làm sai việc nhà'], correct: 2 },
  { id: 4, kind: 'choice', prompt: 'Cô dâu thường làm gì khi ngồi sau xe chú rể?', options: ['Chỉ đường', 'Hát nhạc chế', 'Hỏi xem hôm nay ăn gì', 'Bàn chuyện showbiz'], correct: 1 },
  { id: 5, kind: 'choice', prompt: 'Trong điện thoại chú rể, cô dâu được lưu tên gì?', options: ['Hồng Nhung', 'Vợ yêu', 'Nóc nhà', 'Một cái tên rất tình cảm, không tiện công khai'], correct: 3 },
  { id: 6, kind: 'choice', prompt: 'Nếu thi IELTS về độ hiểu chú rể, cô dâu tự chấm bao nhiêu?', options: ['4.0 — nghe được nhưng chưa hiểu ý', '6.0 — giao tiếp ổn trong tình huống quen thuộc', '8.0 — hiểu cả những điều chưa nói', 'Chưa có điểm vì giám khảo vẫn đang xem xét'], correct: 1 },
  { id: 7, kind: 'choice', prompt: 'Sau đám cưới, “dự án ma” nào của hai người có khả năng triển khai đầu tiên?', options: ['Giảm cân', 'Tập thể dục mỗi ngày', 'Đi tuần trăng mật', 'Sửa nhà'], correct: 1 },
  { id: 8, kind: 'letters', prompt: 'Bài tập nào giúp chú rể vận động tại nhà và ghi điểm với cô dâu?', letters: ['L', 'A', 'N', 'H', 'À', 'U'], answer: 'LAU NHÀ' },
  { id: 9, kind: 'letters', prompt: 'Cô dâu muốn chú rể đưa đi đâu mỗi tháng một lần?', letters: ['O', 'P', 'Ê', 'C', 'H', 'È', 'M', 'À'], answer: 'CÀ PHÊ MÈO' },
  { id: 10, kind: 'letters', prompt: 'Món đầu tiên cô dâu nấu cho chú rể là gì?', letters: ['Đ', 'Ứ', 'N', 'G', 'C', 'H', 'Ú', 'T', 'T', 'R', 'Ị', 'T'], answer: 'TRỨNG ĐÚC THỊT' },
];

export const gifts: Gift[] = [
  { id: 1, title: 'Tổ chức áo đen', item: '1 kg gạo lứt', icon: '🌾', image: assetUrl('assets/gifts/drive-03.webp') },
  { id: 2, title: 'Cách để hết khô khan', item: 'Giấy ướt', icon: '💧', image: assetUrl('assets/gifts/drive-10.webp') },
  { id: 3, title: 'Bộ sưu tập 4 mùa', item: '4 mì cốc', icon: '🍜', image: assetUrl('assets/gifts/drive-06.webp') },
  { id: 4, title: 'Ok-cho oppa', item: 'Sữa hạt', icon: '🥛', image: assetUrl('assets/gifts/drive-02.webp') },
  { id: 5, title: 'Tẩy trắng cuộc đời', item: 'Nước rửa bát', icon: '🫧', image: assetUrl('assets/gifts/drive-09.webp') },
  { id: 6, title: 'Thuốc nhuận tràng', item: 'Cà phê hòa tan', icon: '☕', image: assetUrl('assets/gifts/drive-08.webp') },
  { id: 7, title: 'Làm mát tâm hồn', item: 'Atiso', icon: '🌿', image: assetUrl('assets/gifts/drive-05.webp') },
  { id: 8, title: 'Chắc chắn là chấm hết', item: 'Nước mắm + xì dầu', icon: '🍶', image: assetUrl('assets/gifts/drive-07.webp') },
  { id: 9, title: 'Rửa tay gác kiếm', item: 'Nước rửa tay', icon: '🧴', image: assetUrl('assets/gifts/drive-04.webp') },
  { id: 10, title: 'Hố đen vũ trụ', item: 'Túi rác', icon: '🗑️', image: assetUrl('assets/gifts/drive-01.webp') },
];

export const normalizeAnswer = (value: string) => value.normalize('NFC').toLocaleUpperCase('vi-VN').replace(/\s+/g, '');

export const orderedLetterIndices = (letters: string[], answer: string): number[] => {
  const used = new Set<number>();
  const order = Array.from(normalizeAnswer(answer), character => {
    const index = letters.findIndex((letter, candidate) => !used.has(candidate) && normalizeAnswer(letter) === character);
    if (index >= 0) used.add(index);
    return index;
  });
  return order.length === letters.length && order.every(index => index >= 0) ? order : [];
};
