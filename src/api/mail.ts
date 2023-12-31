/* eslint-disable @typescript-eslint/no-explicit-any */
import { MailDetailInfoResponse, MailListResponse } from "@/types";

import { ApiResponse, getAsync, postAsync } from ".";

/** IMAP 메일 데이터 업데이트  */
export const updateImapMailAsync = async (type: string) => {
  const res = await getAsync(`/mail/mails?type=${type}`);
  return res;
};

interface MailListRequest {
  type?: "ALL" | "GOOGLE" | "NAVER";
  page: number;
}

/** 메일 목록 조회하는 함수 */
export async function getMailListAysnc({
  type = "ALL",
  page,
}: MailListRequest): Promise<MailListResponse> {
  const { data } = await getAsync<any>("/mail/header", {
    params: { type: type.toUpperCase(), page },
  });

  if (page == 0) {
    const [res1, res2] = await Promise.all([
      type !== "GOOGLE" ? updateImapMailAsync("NAVER") : () => true,
      type !== "NAVER" ? updateImapMailAsync("GOOGLE") : () => true,
    ]);

    if (res1 && res2) {
      return {
        content: data?.content,
        page: data.pageable?.pageNumber,
        hasNextPage: !data.last,
      };
    }
  }
  return {
    content: data?.content,
    page: data.pageable?.pageNumber,
    hasNextPage: !data.last,
  };
}

/** 키워드 기반으로 필터링 된 메일 목록을 조회하는 함수 */
export async function getFilteredMailListAsync({
  keywords,
  page,
}: {
  keywords: string[];
  page: number;
}): Promise<MailListResponse> {
  const { data } = await postAsync<any, { keywords: string[] }>(
    "/filter",
    { keywords },
    {
      params: { page },
    }
  );
  return {
    content: data?.content,
    page: data.pageable?.pageNumber,
    hasNextPage: !data.last,
  };
}

/** 메일 상세 데이터 조회하는 함수 */
export async function getMailDetailInfoAsync(id: number): Promise<MailDetailInfoResponse> {
  const { data } = await getAsync<ApiResponse<MailDetailInfoResponse>>(`/mail/detail/${id}`);

  return data;
}
