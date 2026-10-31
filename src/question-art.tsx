import React from 'react';
import {assetUrl} from './asset-url';

const descriptions = [
  'Cân màu hồng',
  'Áo vest và thước dây',
  'Sổ soạn bài và bút chì',
  'Xe máy và hai chiếc mũ bảo hiểm',
  'Điện thoại với tên liên hệ được giấu',
  'Quyển sách và dấu hỏi',
  'Lịch và tập hồ sơ kế hoạch',
  'Ngôi nhà và cây lau nhà',
  'Mèo bên ly cà phê',
  'Món trứng đúc thịt',
];

export const QuestionIllustration: React.FC<{number: number}> = ({number}) => {
  if (number < 1 || number > descriptions.length) return null;
  return <div className="question-illustration">
    <img
      src={assetUrl(`assets/questions/question-${String(number).padStart(2, '0')}.webp`)}
      alt={descriptions[number - 1]}
      decoding="async"
    />
  </div>;
};
