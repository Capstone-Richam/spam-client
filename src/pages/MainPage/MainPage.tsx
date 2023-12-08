/* eslint-disable @typescript-eslint/no-explicit-any */
import { ManipulateType } from "dayjs";
import { ErrorBoundary } from "react-error-boundary";
import { useRecoilValue } from "recoil";

import MailList from "@/components/MailList";
import { MailFilterAtom } from "@/recoil/atom/mail";
import { MailFilterType } from "@/types";

import * as styles from "./MainPage.style";

const INFO: Record<any, { title: string; description: string }> = {
  ALL: {
    title: "전체",
    description:
      "당신의 모든 메일을 보여주고 있어요. 현재 저희 서비스는 구글과 네이버만 지원 중에요.",
  },
  NAVER: { title: "네이버", description: "당신의 네이버 메일이에요." },
  GOOGLE: { title: "구글", description: "당신의 구글 메일이에요." },
};

const MainPage = () => {
  const mailFilter = useRecoilValue(MailFilterAtom);

  const fallbackRender = ({ error, resetErrorBoundary }: any) => {
    return <div>{error.message}</div>;
  };

  return (
    <styles.Container>
      <styles.Title>{INFO[mailFilter].title} 메일</styles.Title>
      <styles.Description>{INFO[mailFilter].description}</styles.Description>
      <ErrorBoundary fallbackRender={fallbackRender}>
        <MailList type={mailFilter as Exclude<MailFilterType, "KEYWORD">} />
      </ErrorBoundary>
    </styles.Container>
  );
};

export default MainPage;
