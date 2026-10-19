import React from 'react';

interface HelpDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpDocsModal: React.FC<HelpDocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#0d1c2d] border border-[#273647] rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between pb-3 border-b border-[#273647]/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7bd0ff]">menu_book</span>
            <h3 className="text-base font-bold text-[#d4e4fa]">
              Serene Study 사용자 가이드 &amp; 음향 기준
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#c6c6cd] hover:text-[#d4e4fa]"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="space-y-4 text-xs text-[#c6c6cd] leading-relaxed">
          <div className="p-3.5 rounded-xl bg-[#122131] border border-[#273647]/50 space-y-2">
            <div className="text-sm font-semibold text-[#7bd0ff] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">graphic_eq</span>
              학습 공간별 적정 소음도 (세계보건기구 WHO 가이드라인)
            </div>
            <ul className="space-y-1.5 pl-1">
              <li className="flex items-center justify-between">
                <span>• 독서실 / 조용한 열람실</span>
                <strong className="text-[#4edea3]">30 ~ 40 dB</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>• 조용한 스터디카페 / 내 방</span>
                <strong className="text-[#4edea3]">40 ~ 45 dB</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>• 잔잔한 음악이 있는 카페</span>
                <strong className="text-[#7bd0ff]">45 ~ 55 dB</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>• 주의가 필요한 소음 환경</span>
                <strong className="text-[#ffb4ab]">60 dB 초과</strong>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[#d4e4fa] text-xs">
              💡 실시간 자동 백색소음 증폭 (Auto-Masking)
            </h4>
            <p>
              주변 환경 소음이 설정한 임계치(예: 50dB 또는 65dB)를 초과하면 백색소음이
              자동으로 증폭되어 외부 소음을 차단하고 몰입을 유지하도록 돕습니다.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[#d4e4fa] text-xs">
              ⏱️ 뽀모도로 세션 규칙
            </h4>
            <p>
              25분 동안 깊은 몰입 후 5분의 뇌 휴식을 부여합니다. 4개 세션을 완료하면 1세트 목표가 달성되며 15~30분의 긴 휴식이 권장됩니다.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[#d4e4fa] text-xs">
              🔒 개인정보 보호 안내
            </h4>
            <p>
              마이크로부터 수집되는 음향 데이터는 음성을 저장하거나 외부 서버로 전송하지 않으며, 오직 데시벨 수치 산출을 위해 기기 브라우저 로컬에서만 실시간 처리됩니다.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#7bd0ff] text-[#00354a] hover:bg-[#7bd0ff]/90 transition-all"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
