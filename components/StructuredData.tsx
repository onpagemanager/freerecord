'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  data: object | object[];
}

/**
 * 구조화된 데이터(JSON-LD)를 페이지에 추가하는 컴포넌트
 * SEO 최적화를 위해 검색 엔진에 정보를 제공합니다.
 * 단일 객체 또는 객체 배열을 받을 수 있습니다.
 */
export default function StructuredData({ data }: StructuredDataProps) {
  useEffect(() => {
    // 기존 구조화된 데이터 스크립트들을 모두 제거
    const existingScripts = document.querySelectorAll('[id^="structured-data"]');
    existingScripts.forEach((script) => script.remove());

    // 데이터가 배열인지 확인
    const dataArray = Array.isArray(data) ? data : [data];

    // 각 스키마 데이터에 대해 스크립트 생성
    dataArray.forEach((schemaData, index) => {
      const script = document.createElement('script');
      script.id = `structured-data-${index}`;
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
    });

    // 컴포넌트 언마운트 시 정리
    return () => {
      const scriptsToRemove = document.querySelectorAll('[id^="structured-data"]');
      scriptsToRemove.forEach((script) => script.remove());
    };
  }, [data]);

  return null;
}

