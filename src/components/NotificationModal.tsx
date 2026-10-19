import React from 'react';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'safe' | 'alert' | 'session';
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onClear: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-sm mt-12 bg-[#0d1c2d] border border-[#273647] rounded-2xl p-4 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-[#273647]/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#7bd0ff] text-xl">notifications</span>
            <span className="font-bold text-[#d4e4fa] text-sm">알림 보관함</span>
            <span className="px-2 py-0.5 rounded-full bg-[#00a6e0]/20 text-[#7bd0ff] text-[10px] font-bold">
              {notifications.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={onClear}
                className="text-[11px] text-[#c6c6cd] hover:text-[#7bd0ff] transition-colors"
              >
                모두 지우기
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded text-[#c6c6cd] hover:text-white"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
          {notifications.length === 0 ? (
            <div className="text-center py-6 text-xs text-[#c6c6cd]/60">
              새로운 알림이 없습니다.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#122131] border border-[#273647]/50 flex gap-2.5 items-start text-left"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    item.type === 'safe'
                      ? 'bg-[#001c10] text-[#4edea3]'
                      : item.type === 'alert'
                      ? 'bg-[#93000a]/30 text-[#ffb4ab]'
                      : 'bg-[#00374d] text-[#7bd0ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {item.type === 'safe'
                      ? 'verified'
                      : item.type === 'alert'
                      ? 'warning'
                      : 'alarm'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#d4e4fa] truncate">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-[#c6c6cd]/60 shrink-0 ml-1">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#c6c6cd] mt-0.5 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
