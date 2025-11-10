import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '이용약관 | FreeRecorder',
  description: 'FreeRecorder의 이용약관입니다.',
};

export default function TermsPage() {
  return (
    <div className='container py-5'>
      <h1 className='text-4xl font-bold mb-8 text-gray-900 dark:text-white'>
        이용약관
      </h1>

      <div className='prose prose-gray dark:prose-invert max-w-none'>
        <p className='text-sm text-gray-600 dark:text-gray-400 mb-8'>
          최종 수정일: {new Date().toLocaleDateString('ko-KR')}
        </p>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            제1조 (목적)
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
            이 약관은 FreeRecorder(이하 "회사")가 제공하는 온라인 오디오 녹음 및 편집 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            제2조 (정의)
          </h2>
          <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
            <li>"서비스"란 회사가 제공하는 오디오 녹음, 편집, 변환 등의 기능을 포함한 모든 온라인 서비스를 의미합니다.</li>
            <li>"이용자"란 이 약관에 따라 회사가 제공하는 서비스를 받는 개인 또는 법인을 의미합니다.</li>
            <li>"콘텐츠"란 이용자가 서비스를 이용하여 생성, 업로드, 저장한 모든 오디오 파일 및 관련 데이터를 의미합니다.</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            제3조 (약관의 게시와 개정)
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
            회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.
          </p>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
            회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있으며, 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 서비스의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            제4조 (서비스의 제공 및 변경)
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
            회사는 다음과 같은 서비스를 제공합니다:
          </p>
          <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
            <li>오디오 녹음 서비스</li>
            <li>오디오 편집 및 변환 서비스</li>
            <li>오디오 효과 적용 서비스</li>
            <li>기타 회사가 추가로 개발하거나 제휴계약 등을 통해 제공하는 일체의 서비스</li>
          </ul>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed mt-4'>
            회사는 서비스의 내용을 변경할 수 있으며, 변경 시에는 사전에 공지합니다.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            제5조 (서비스의 중단)
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
            회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
          </p>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
            회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, 회사가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            제6조 (이용자의 의무)
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
            이용자는 다음 행위를 하여서는 안 됩니다:
          </p>
          <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
            <li>신청 또는 변경 시 허위내용의 등록</li>
            <li>타인의 정보 도용</li>
            <li>회사가 게시한 정보의 변경</li>
            <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
            <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
            <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
            <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            제7조 (저작권의 귀속 및 이용제한)
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
            회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.
          </p>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
            이용자는 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
          </p>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
            이용자가 서비스 내에 게시한 콘텐츠의 저작권은 해당 이용자에게 귀속됩니다. 다만, 회사는 서비스의 운영, 전시, 전송, 배포, 홍보의 목적으로 이용자의 별도 허락 없이 무상으로 저작권법에 규정하는 공정한 관행에 합치되게 합리적인 범위 내에서 이용할 수 있습니다.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            제8조 (면책조항)
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
            회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
          </p>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
            회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
          </p>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
            회사는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            제9조 (분쟁의 해결)
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
            회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다. 다만, 제소 당시 이용자의 주소 또는 거소가 분명하지 않거나 외국 거주자의 경우에는 민사소송법상의 관할법원에 제기합니다.
          </p>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
            회사와 이용자 간에 제기된 전자상거래 소송에는 한국법을 적용합니다.
          </p>
        </section>

        <div className='mt-12 pt-8 border-t border-gray-200 dark:border-gray-800'>
          <Link
            href='/'
            className='text-blue-600 dark:text-blue-400 hover:underline'
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}

