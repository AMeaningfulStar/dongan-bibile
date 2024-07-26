export enum EmailValidationStatus {
  Default = 0,            // 기본값
  Error = 400,            // 중복되었을 때
  Success = 200,          // 성공했을 때
  InvalidFormat = 422,    // 이메일 형식이 잘못되었을 때
}
