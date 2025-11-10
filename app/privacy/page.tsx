import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '개인정보처리방침 | FreeRecorder',
  description: 'FreeRecorder의 개인정보처리방침입니다.',
};

export default function PrivacyPage() {
  return (
    <div className='container py-5'>
      <h1 className='text-4xl font-bold mb-8 text-gray-900 dark:text-white'>
        개인정보처리방침
      </h1>

      <div className='prose prose-gray dark:prose-invert max-w-none'>
        <p className='text-sm text-gray-600 dark:text-gray-400 mb-8'>
          최종 수정일: {new Date().toLocaleDateString('ko-KR')}
        </p>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            1. 개인정보의 처리 목적
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
            FreeRecorder는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
          </p>
          <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
            <li>서비스 제공: 오디오 녹음 및 편집 서비스 제공</li>
            <li>서비스 개선: 사용자 경험 향상 및 서비스 품질 개선</li>
            <li>고객 지원: 문의사항 처리 및 기술 지원</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            2. 개인정보의 처리 및 보유기간
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
            FreeRecorder는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
          </p>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
            각각의 개인정보 처리 및 보유 기간은 다음과 같습니다:
          </p>
          <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4'>
            <li>서비스 이용 기록: 서비스 종료 시까지</li>
            <li>문의사항 기록: 문의 처리 완료 후 3년</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            3. 처리하는 개인정보의 항목
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
            FreeRecorder는 다음의 개인정보 항목을 처리하고 있습니다:
          </p>
          <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
            <li>자동 수집 항목: IP 주소, 쿠키, 서비스 이용 기록, 기기 정보</li>
            <li>선택 항목: 이메일 주소 (문의사항 접수 시)</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            4. 개인정보의 제3자 제공
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
            FreeRecorder는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            5. 개인정보처리의 위탁
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
            FreeRecorder는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
          </p>
          <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
            <li>호스팅 서비스: 서버 운영 및 관리</li>
            <li>분석 서비스: 서비스 이용 통계 분석</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            6. 정보주체의 권리·의무 및 그 행사방법
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
            정보주체는 FreeRecorder에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
          </p>
          <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300'>
            <li>개인정보 처리정지 요구권</li>
            <li>개인정보 열람요구권</li>
            <li>개인정보 정정·삭제요구권</li>
            <li>개인정보 처리정지 요구권</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            7. 개인정보의 파기
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
            FreeRecorder는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
          </p>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
            파기의 절차 및 방법은 다음과 같습니다:
          </p>
          <ul className='list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mt-4'>
            <li>파기절차: 이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다.</li>
            <li>파기방법: 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            8. 개인정보 보호책임자
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
            FreeRecorder는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <div className='bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mt-4'>
            <p className='text-gray-700 dark:text-gray-300'>
              <strong>개인정보 보호책임자</strong>
            </p>
            <p className='text-gray-700 dark:text-gray-300 mt-2'>
              이메일: privacy@freerecorder.com
            </p>
          </div>
        </section>

        <section className='mb-8'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-900 dark:text-white'>
            9. 개인정보 처리방침 변경
          </h2>
          <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
            이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
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

