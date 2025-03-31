import { ApiStatusCode } from './api-status-code';

interface PagingResponse<T> {
  items: T;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export class ApiResponse<T = null> {
  /**
   * 응답 데이터
   */
  data: T;

  /**
   * 응답 메시지
   */
  message?: string;

  /**
   * Response Status Code
   * 1000: 성공
   * 4000: 일반 에러
   */
  status: number = 1000;

  protected constructor(data: T, message = 'success', status = ApiStatusCode.SUCCESS) {
    this.data = data;
    this.message = message;
    this.status = status;
  }

  /**
   * 일반 응답 객체 생성
   * @param data 응답 데이터 (객체, 문자열, null 등)
   * @param message 응답 메시지
   * @param status 상태 코드
   * @returns Response 객체
   */
  static success<T = null>(data: T, message?: string, status?: number): ApiResponse<T> {
    return new ApiResponse(data, message, status);
  }

  /**
   * 페이징 응답 객체 생성
   * @param items 페이징 아이템 배열
   * @param total 전체 아이템 수
   * @param page 현재 페이지
   * @param limit 페이지당 아이템 수
   * @param message 응답 메시지
   * @returns Response 객체
   */
  static paging<T extends Array<unknown>>(
    items: T,
    total: number,
    page: number,
    limit: number,
    message?: string,
    status?: number,
  ): ApiResponse<PagingResponse<T>> {
    const totalPages = Math.ceil(total / limit);

    return new ApiResponse(
      {
        items,
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      message,
      status,
    );
  }

  /**
   * 에러 응답 객체 생성
   * @param message 에러 메시지
   * @param status 상태 코드
   * @returns Response 객체
   */
  static error(message: string, status?: number): ApiResponse<unknown> {
    return new ApiResponse(null, message, status ?? ApiStatusCode.CLIENT_ERROR);
  }
}
