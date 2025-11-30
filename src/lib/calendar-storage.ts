/**
 * 달력 일정 데이터를 로컬 스토리지에 저장/불러오기하는 유틸리티
 */

// 일정 데이터 타입 정의
export interface CalendarEvent {
  date: string; // YYYY-MM-DD 형식
  events: string[]; // 해당 날짜의 일정 목록
}

// 통일된 로컬스토리지 키 (calendar-section.tsx와 일치시킴)
const STORAGE_KEY = 'blog-calendar-events-v2';

/**
 * 로컬 스토리지에서 모든 일정 데이터를 불러옵니다.
 */
export function getAllCalendarEvents(): Record<string, string[]> {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {};
    }
    const data = JSON.parse(stored) as Record<string, string[]>;
    return data;
  } catch (error) {
    console.error('달력 데이터 로드 실패:', error);
    return {};
  }
}

/**
 * 특정 날짜의 일정을 가져옵니다.
 * @param date YYYY-MM-DD 형식의 날짜 문자열
 */
export function getEventsByDate(date: string): string[] {
  const allEvents = getAllCalendarEvents();
  return allEvents[date] || [];
}

/**
 * 특정 날짜에 일정을 저장합니다.
 * @param date YYYY-MM-DD 형식의 날짜 문자열
 * @param events 일정 목록
 */
export function saveEventsByDate(date: string, events: string[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const allEvents = getAllCalendarEvents();
    if (events.length === 0) {
      // 일정이 없으면 해당 날짜 삭제
      delete allEvents[date];
    } else {
      // 일정이 있으면 업데이트
      allEvents[date] = events;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allEvents));
  } catch (error) {
    console.error('달력 데이터 저장 실패:', error);
  }
}

/**
 * 특정 날짜에 일정을 추가합니다.
 * @param date YYYY-MM-DD 형식의 날짜 문자열
 * @param event 추가할 일정 텍스트
 */
export function addEvent(date: string, event: string): void {
  const existingEvents = getEventsByDate(date);
  if (!existingEvents.includes(event)) {
    saveEventsByDate(date, [...existingEvents, event]);
  }
}

/**
 * 특정 날짜의 일정을 삭제합니다.
 * @param date YYYY-MM-DD 형식의 날짜 문자열
 * @param eventIndex 삭제할 일정의 인덱스
 */
export function removeEvent(date: string, eventIndex: number): void {
  const existingEvents = getEventsByDate(date);
  const newEvents = existingEvents.filter((_, index) => index !== eventIndex);
  saveEventsByDate(date, newEvents);
}

/**
 * 특정 날짜의 모든 일정을 삭제합니다.
 * @param date YYYY-MM-DD 형식의 날짜 문자열
 */
export function clearEventsByDate(date: string): void {
  saveEventsByDate(date, []);
}

