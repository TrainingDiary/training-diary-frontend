// email
export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

// email 인증 코드 6자리 난수
export const codePattern = /^\d{6}$/;

// password 영어/숫자/기호 모두 포함 8 ~ 15자
export const passwordPattern =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
