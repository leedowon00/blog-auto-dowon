/**
 * 블로그 태그 상수 정의
 * 기본 태그 목록과 각 태그별 색상, 아이콘 매핑
 */

// 기본 태그 목록
export const DEFAULT_TAGS = [
  '에어드랍',
  '바이브코딩',
  'AI 최신 소식',
  '할인 이벤트',
  '몰입',
] as const;

// 태그별 색상 정의 (Tailwind CSS 클래스)
export const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '에어드랍': {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300 dark:border-blue-700',
  },
  '바이브코딩': {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-300 dark:border-purple-700',
  },
  'AI 최신 소식': {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-300 dark:border-green-700',
  },
  '할인 이벤트': {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-300 dark:border-orange-700',
  },
  '몰입': {
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    text: 'text-pink-700 dark:text-pink-300',
    border: 'border-pink-300 dark:border-pink-700',
  },
};

// 태그별 아이콘 매핑 (이모지 기반)
export const TAG_ICONS: Record<string, string> = {
  '에어드랍': '✨',
  '바이브코딩': '🧠',
  'AI 최신 소식': '🤖',
  '할인 이벤트': '💸',
  '몰입': '🎯',
};

/**
 * 태그의 색상을 가져옵니다. 기본값을 반환합니다.
 */
export function getTagColor(tag: string) {
  return TAG_COLORS[tag] || {
    bg: 'bg-gray-100 dark:bg-gray-900/30',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-300 dark:border-gray-700',
  };
}

/**
 * 태그의 아이콘을 가져옵니다.
 */
export function getTagIcon(tag: string) {
  return TAG_ICONS[tag] || '🏷️';
}

