export interface Environment {
  /**
   * 서버 환경 설정
   * @property {('development'|'production'|'local')} NODE_ENV - 현재 실행 환경
   * @property {string} PREFIX - API 엔드포인트 접두사 (예: '/api')
   * @property {number} PORT - 서버가 리스닝할 포트 번호
   */
  NODE_ENV: 'development' | 'production' | 'local';
  PREFIX: string;
  PORT: number;

  /**
   * 데이터베이스 연결 설정
   * @property {string} DATABASE_URL - 주 데이터베이스 연결 문자열 (쓰기 작업용)
   * @property {string} READ_REPLICA_URL - 읽기 전용 복제본 데이터베이스 연결 문자열
   */
  DATABASE_URL: string;
  READ_REPLICA_URL: string;

  /**
   * OpenAPI(Swagger) 문서화 설정
   * @property {string} OPEN_API_PREFIX - API 문서 엔드포인트 접두사
   */
  OPEN_API_PREFIX: string;

  /**
   * Redis 캐시 서버 설정
   * @property {string} REDIS_HOST - Redis 서버 호스트 주소
   * @property {number} REDIS_PORT - Redis 서버 포트 번호
   */
  REDIS_HOST: string;
  REDIS_PORT: number;

  /**
   * Google OAuth 인증 설정
   * @property {string} GOOGLE_CLIENT_ID - Google OAuth 클라이언트 ID
   * @property {string} GOOGLE_CLIENT_SECRET - Google OAuth 클라이언트 시크릿
   * @property {string} GOOGLE_CALLBACK_URL - 인증 후 리디렉션될 콜백 URL
   */
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
}
