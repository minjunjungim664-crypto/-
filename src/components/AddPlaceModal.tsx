import React, { useState } from 'react';
import { StudyPlace } from '../types';

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlace: (place: StudyPlace) => void;
}

export const AddPlaceModal: React.FC<AddPlaceModalProps> = ({ isOpen, onClose, onAddPlace }) => {
  const [name, setName] = useState('');
  const [targetDb, setTargetDb] = useState(45);
  const [statusText, setStatusText] = useState('조용함');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddPlace({
      id: `place-${Date.now()}`,
      name: name.trim(),
      targetDb,
      statusText,
      isCustom: true,
    });
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0d1c2d] border border-[#273647] rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#273647]/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7bd0ff]">add_location</span>
            <h3 className="text-lg font-bold text-[#d4e4fa]">새 학습 장소 추가</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#c6c6cd] hover:text-[#d4e4fa] hover:bg-[#1c2b3c] transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#c6c6cd] mb-1.5">
              장소 이름
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 학교 도서관 2열람실, 거실 책상"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#122131] border border-[#273647] text-[#d4e4fa] placeholder-[#c6c6cd]/40 focus:outline-none focus:border-[#7bd0ff] text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-[#c6c6cd]">
                목표 적정 소음 기준
              </label>
              <span className="text-sm font-bold text-[#7bd0ff]">{targetDb} dB</span>
            </div>
            <input
              type="range"
              min="30"
              max="70"
              value={targetDb}
              onChange={(e) => setTargetDb(Number(e.target.value))}
              className="w-full h-1.5 bg-[#1c2b3c] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#c6c6cd]/60 mt-1">
              <span>30 dB (아주 조용)</span>
              <span>45 dB (표준)</span>
              <span>70 dB (카페)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#c6c6cd] mb-1.5">
              장소 상태 라벨
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['아주 조용함', '조용함', '보통 수준'].map((label) => (
                <button
                  type="button"
                  key={label}
                  onClick={() => setStatusText(label)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                    statusText === label
                      ? 'bg-[#00a6e0]/20 border-[#7bd0ff] text-[#7bd0ff]'
                      : 'bg-[#122131] border-[#273647] text-[#c6c6cd] hover:text-[#d4e4fa]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#c6c6cd] hover:bg-[#1c2b3c] transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#7bd0ff] text-[#00354a] hover:bg-[#7bd0ff]/90 transition-all shadow-md active:scale-95"
            >
              장소 등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
