import React, { useEffect, useState } from 'react';

interface CountdownProps {
  targetDateString: string;
  serifFontClass?: string;
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDateString,
  serifFontClass = 'font-serif',
}) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; passed: boolean }>({
    days: 0,
    hours: 0,
    minutes: 0,
    passed: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(targetDateString).getTime();
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, passed: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({ days, hours, minutes, passed: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 30000);
    return () => clearInterval(timer);
  }, [targetDateString]);

  if (timeLeft.passed) {
    return (
      <div className="mt-8 p-4 rounded-xl border border-amber-300/30 bg-amber-950/20 text-amber-200 text-sm">
        Phiên chợ đã diễn ra. Hẹn bạn ở Chồ trong những dịp cuối năm ấm áp tiếp theo!
      </div>
    );
  }

  return (
    <div className="flex gap-2 sm:gap-3 mt-8 items-center" aria-label="Đếm ngược đến phiên chợ">
      <div className="min-w-[68px] sm:min-w-[76px] rounded-xl border border-white/25 bg-black/10 px-3 py-2 text-center backdrop-blur-xs">
        <b className={`block text-2xl sm:text-3xl leading-none ${serifFontClass} tabular-nums text-white`}>
          {timeLeft.days}
        </b>
        <small className="text-xs uppercase tracking-wider text-amber-200/80">ngày</small>
      </div>

      <span className="text-xl text-amber-300/50 pb-3 font-serif">:</span>

      <div className="min-w-[68px] sm:min-w-[76px] rounded-xl border border-white/25 bg-black/10 px-3 py-2 text-center backdrop-blur-xs">
        <b className={`block text-2xl sm:text-3xl leading-none ${serifFontClass} tabular-nums text-white`}>
          {timeLeft.hours}
        </b>
        <small className="text-xs uppercase tracking-wider text-amber-200/80">giờ</small>
      </div>

      <span className="text-xl text-amber-300/50 pb-3 font-serif">:</span>

      <div className="min-w-[68px] sm:min-w-[76px] rounded-xl border border-white/25 bg-black/10 px-3 py-2 text-center backdrop-blur-xs">
        <b className={`block text-2xl sm:text-3xl leading-none ${serifFontClass} tabular-nums text-white`}>
          {timeLeft.minutes}
        </b>
        <small className="text-xs uppercase tracking-wider text-amber-200/80">phút</small>
      </div>
    </div>
  );
};
