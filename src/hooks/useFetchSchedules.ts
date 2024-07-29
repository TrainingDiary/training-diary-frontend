import { QueryClient, useQuery } from 'react-query';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import CreateAppointmentApi from 'src/api/appointment';

interface ScheduleDetail {
  scheduleId: number;
  startTime: string;
  trainerId: number;
  trainerName: string;
  traineeId: number | null;
  traineeName: string | null;
  scheduleStatus: 'OPEN' | 'RESERVED' | 'RESERVE_APPLIED';
}

interface Schedule {
  startDate: string;
  existReserved: boolean;
  details: ScheduleDetail[];
}

interface ScheduleData {
  scheduledDates: string[];
  reservedDates: string[];
  reservedAndAppliedDates: {
    startDate: string;
    notAllowedTimes: string[];
  }[];
}

const fetchSchedules = async (
  navigate: NavigateFunction,
  startDate: string,
  endDate: string
): Promise<ScheduleData> => {
  const appointmentApi = CreateAppointmentApi(navigate);

  const response = await appointmentApi.getSchedules(startDate, endDate);
  const scheduleList: Schedule[] = response?.data;

  const scheduled: string[] = [];
  const reserved: string[] = [];
  const reservedAndApplied: {
    startDate: string;
    notAllowedTimes: string[];
  }[] = [];

  scheduleList.forEach(schedule => {
    if (schedule.existReserved) reserved.push(schedule.startDate);

    reservedAndApplied.push({
      startDate: schedule.startDate,
      notAllowedTimes: schedule.details
        .filter(
          detail =>
            detail.scheduleStatus === 'RESERVED' ||
            detail.scheduleStatus === 'RESERVE_APPLIED'
        )
        .map(detail => detail.startTime),
    });

    scheduled.push(schedule.startDate);
  });

  return {
    scheduledDates: scheduled,
    reservedDates: reserved,
    reservedAndAppliedDates: reservedAndApplied,
  };
};

const useFetchSchedules = (startDate: string, endDate: string) => {
  const navigate = useNavigate();
  const queryClient = new QueryClient();

  const queryKey = ['schedules', startDate, endDate];

  const {
    data,
    error,
    isLoading,
    refetch: baseRefetch,
  } = useQuery<ScheduleData, Error>(
    queryKey,
    () => fetchSchedules(navigate, startDate, endDate),
    {
      staleTime: 30 * 1000,
      keepPreviousData: true,
    }
  );

  const refetch = (options?: { force: boolean }) => {
    if (options?.force) {
      queryClient.invalidateQueries(queryKey);
    }
    return baseRefetch();
  };

  const initialData: ScheduleData = {
    scheduledDates: [],
    reservedDates: [],
    reservedAndAppliedDates: [],
  };

  return { data: data || initialData, error, isLoading, refetch };
};

export default useFetchSchedules;
