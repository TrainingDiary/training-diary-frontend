import { useState, useEffect } from 'react';

import { scheduleList } from 'src/mocks/data/scheduleList';

const useSchedules = () => {
  const [data, setData] = useState<{
    scheduledDates: string[];
    reservedDates: string[];
    reservedAndAppliedDates: {
      startDate: string;
      notAllowedTimes: string[];
    }[];
  }>({ scheduledDates: [], reservedDates: [], reservedAndAppliedDates: [] });
  const [isLoading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const getSchedules = () => {
      try {
        console.log('api조회');
        // 스케줄 목록 조회 API 단계 추가 (현재는 더미 데이터 사용)

        const scheduled: string[] = [];
        const reserved: string[] = [];
        const reservedAndApplied: {
          startDate: string;
          notAllowedTimes: string[];
        }[] = [];

        scheduleList.forEach((schedule) => {
          if (schedule.existReserved) reserved.push(schedule.startDate);

          reservedAndApplied.push({
            startDate: schedule.startDate,
            notAllowedTimes: schedule.details
              .filter(
                (detail) =>
                  detail.status === 'RESERVED' ||
                  detail.status === 'RESERVE_APPLIED'
              )
              .map((detail) => detail.startTime),
          });

          scheduled.push(schedule.startDate);
        });

        setData({
          scheduledDates: scheduled,
          reservedDates: reserved,
          reservedAndAppliedDates: reservedAndApplied,
        });
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    getSchedules();
  }, []);

  return { data, isLoading, error };
};

export default useSchedules;
