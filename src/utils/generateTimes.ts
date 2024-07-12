export const generateTimes = () => {
  const times = [];
  for (let hour = 5; hour <= 23; hour++) {
    const formattedHour = hour < 10 ? `0${hour}` : hour;
    const period = hour < 12 ? 'am' : 'pm';
    const fullTime = `${formattedHour}:00 ${period}`;
    const shortTime = `${formattedHour}:00`;
    times.push({ fullTime, shortTime });
  }
  return times;
};
