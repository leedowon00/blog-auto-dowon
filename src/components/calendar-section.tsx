"use client"

import React, { useState, useEffect, useMemo } from "react"
// Using a custom month grid instead of react-big-calendar for more predictable rendering
import {
  format,
  startOfWeek,
  addMonths,
  addWeeks,
  addDays,
  isSameDay,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
} from "date-fns"
import { ko } from "date-fns/locale"
// NOTE: global CSS for react-big-calendar is imported in _app.tsx
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// locale (한국어) is used directly with date-fns format functions

type CalendarViewMode = "month" | "week" | "day"

const generateEventId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2, 11)
}

// 이벤트 타입 정의
interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  desc?: string
  allDay?: boolean
}

export default function CalendarSection() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, "id">>({
    title: "",
    desc: "",
    start: new Date(),
    end: new Date(),
    allDay: true,
  })

  // 초기 로드 시 로컬 스토리지에서 이벤트 불러오기
  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem("blog-calendar-events-v2")
    if (stored) {
      const parsed = (JSON.parse(stored) as CalendarEvent[]).map((event) => ({
        ...event,
        id: event.id ?? generateEventId(),
        start: new Date(event.start),
        end: new Date(event.end),
      }))
      // 로컬 스토리지의 초기 데이터를 한 번만 동기화
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEvents(parsed)
    }
  }, [])

  const persistEvents = (nextEvents: CalendarEvent[]) => {
    setEvents(nextEvents)
    if (typeof window !== "undefined") {
      localStorage.setItem("blog-calendar-events-v2", JSON.stringify(nextEvents))
    }
  }

  const openCreateDialog = (startDate?: Date, endDate?: Date) => {
    const date = startDate ?? currentDate
    setNewEvent({
      title: "",
      desc: "",
      start: date,
      end: endDate ?? date,
      allDay: true,
    })
    setIsDialogOpen(true)
  }

  const handleDaySlotClick = (date: Date) => {
    openCreateDialog(date, date)
  }

  // 이벤트 저장
  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) return

    const eventToSave: CalendarEvent = {
      ...newEvent,
      id: generateEventId(),
    }

    const updatedEvents = [...events, eventToSave]
    persistEvents(updatedEvents)
    setIsDialogOpen(false)
    setNewEvent((prev) => ({
      ...prev,
      title: "",
      desc: "",
    }))
  }

  // 날짜 슬롯 선택 시 (월 뷰) - BigCalendar의 SlotInfo 대신 단순 파라미터 버전 유지
  const handleSelectSlot = (start?: Date, end?: Date) => {
    if (!start) return
    openCreateDialog(start, end ?? start)
  }

  const handleNavigate = (direction: "prev" | "next") => {
    if (viewMode === "month") {
      setCurrentDate((prev) => addMonths(prev, direction === "next" ? 1 : -1))
    } else if (viewMode === "week") {
      setCurrentDate((prev) => addWeeks(prev, direction === "next" ? 1 : -1))
    } else {
      setCurrentDate((prev) => addDays(prev, direction === "next" ? 1 : -1))
    }
  }

  // "오늘" 버튼 클릭 시 오늘 날짜로 이동하고 월간 뷰에서만 스크롤
  const handleTodayClick = () => {
    const today = new Date()
    setCurrentDate(today)

    // 월간 뷰에서만 스크롤 (약간의 지연을 주어 렌더링 후 스크롤)
    if (viewMode === 'month') {
      setTimeout(() => {
        const dateId = `date-${format(today, 'yyyy-MM-dd')}`
        const element = document.getElementById(dateId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 150)
    }
  }

  const weekDays = useMemo(() => {
    // 사용자의 요청에 따라 주간 뷰에서는 '오늘'(currentDate)부터 7일을 보여줍니다.
    // 기존: const start = startOfWeek(currentDate, { locale: ko })
    const start = currentDate
    return Array.from({ length: 7 }).map((_, idx) => addDays(start, idx))
  }, [currentDate])

  const getEventsByDate = (date: Date) =>
    events.filter((event) => isSameDay(event.start, date))

  const renderEventCard = (event: CalendarEvent) => (
    <div
      key={event.id}
      className="rounded-2xl border border-primary bg-primary/10 p-3 text-sm shadow-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-base font-semibold text-foreground">{event.title}</p>
      <p className="text-xs text-muted-foreground mt-1">
        {format(event.start, "a h:mm", { locale: ko })} -{" "}
        {format(event.end, "a h:mm", { locale: ko })}
      </p>
      {event.desc && (
        <p className="mt-2 text-sm leading-relaxed text-foreground/90">
          {event.desc}
        </p>
      )}
    </div>
  )

  const renderWeekList = () => (
    <div className="space-y-8">
      {weekDays.map((date) => {
        const dayEvents = getEventsByDate(date)
        return (
          <div
            key={date.toISOString()}
            className="space-y-4 rounded-2xl border border-border/40 bg-muted/20 p-4 cursor-pointer transition hover:border-primary/60"
            onClick={() => handleDaySlotClick(date)}
          >
            <p className="text-base font-semibold text-foreground">
              {format(date, "M월 d일 (EEE)", { locale: ko })}
            </p>
            {dayEvents.length > 0 ? (
              <div className="space-y-4">
                {dayEvents.map((event) => renderEventCard(event))}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/30 p-5 text-lg text-muted-foreground">
                등록된 일정이 없습니다.
              </p>
            )}
          </div>
        )
      })}
    </div>
  )

  const renderDayView = () => {
    const dayEvents = getEventsByDate(currentDate)
    return (
      <div
        className="space-y-4 rounded-2xl border border-border/40 bg-card p-5 cursor-pointer transition hover:border-primary/60"
        onClick={() => handleDaySlotClick(currentDate)}
      >
        <p className="text-lg font-semibold">
          {format(currentDate, "yyyy년 M월 d일 (EEE)", { locale: ko })}
        </p>
        {dayEvents.length > 0 ? (
          <div className="space-y-4">
            {dayEvents.map((event) => renderEventCard(event))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/30 p-6 text-lg text-muted-foreground">
            아직 등록된 일정이 없습니다.
          </p>
        )}
      </div>
    )
  }

  // 커스텀 날짜 포맷 (월 뷰에서만 사용)
  const formats = {
    monthHeaderFormat: (date: Date) =>
      format(date, "yyyy년 M월", { locale: ko }),
    dayHeaderFormat: (date: Date) =>
      format(date, "M월 d일 (E)", { locale: ko }),
    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${format(start, "M월 d일", { locale: ko })} - ${format(end, "M월 d일", {
        locale: ko,
      })}`,
    timeGutterFormat: () => "",
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">일정 캘린더</h2>
          <p className="text-sm text-muted-foreground mt-1">
            주/일 뷰에서 일정이 크게 표시되어 한눈에 확인할 수 있습니다.
          </p>
        </div>
        <Button onClick={() => openCreateDialog()} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          일정 추가
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-full border border-border/60 bg-muted/40 p-1">
          {(["month", "week", "day"] as CalendarViewMode[]).map((mode) => (
            <button
              key={mode}
              className={cn(
                "px-4 py-1.5 text-sm font-semibold rounded-full transition-colors",
                viewMode === mode
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setViewMode(mode)}
            >
              {mode === "month" ? "월" : mode === "week" ? "주" : "일"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleNavigate("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTodayClick}
          >
            오늘
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleNavigate("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "month" ? (
        <div className="min-h-[800px] lg:min-h-[1100px] bg-card border rounded-2xl shadow-lg p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-xl font-semibold">
              {format(currentDate, "yyyy년 M월", { locale: ko })}
            </div>
            <div className="text-sm text-muted-foreground">
              {format(startOfWeek(currentDate, { locale: ko }), "yyyy.MM.dd", { locale: ko })} - {format(endOfWeek(endOfMonth(currentDate), { locale: ko }), "yyyy.MM.dd", { locale: ko })}
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-muted-foreground mb-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const d = addDays(startOfWeek(new Date(), { locale: ko }), i)
              return <div key={i}>{format(d, "EEEEEE", { locale: ko })}</div>
            })}
          </div>

          {/* Month grid (6 rows x 7 cols) */}
          <div className="grid grid-rows-6 gap-2">
            {(() => {
              const monthStart = startOfMonth(currentDate)
              const monthEnd = endOfMonth(monthStart)
              const gridStart = startOfWeek(monthStart, { locale: ko })
              let day = gridStart
              const weeks: React.ReactNode[] = []

              for (let w = 0; w < 6; w++) {
                const days: React.ReactNode[] = []
                for (let d = 0; d < 7; d++) {
                  const thisDay = day
                  const dayEvents = getEventsByDate(thisDay)
                  days.push(
                    <div
                      key={thisDay.toISOString()}
                      id={`date-${format(thisDay, 'yyyy-MM-dd')}`}
                      onClick={() => handleDaySlotClick(thisDay)}
                      className={cn(
                        "min-h-[120px] rounded-lg border p-3 cursor-pointer",
                        !isSameMonth(thisDay, monthStart)
                          ? "bg-muted/10 text-muted-foreground"
                          : "bg-card"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="text-sm font-medium">{format(thisDay, "d")}</div>
                      </div>

                      <div className="mt-2 space-y-2">
                        {dayEvents.length > 0 ? (
                          dayEvents.map((ev) => (
                            <div key={ev.id} className="rounded-md bg-primary/10 p-2 text-sm">
                              <div className="font-semibold text-sm">{ev.title}</div>
                              <div className="text-xs text-muted-foreground">{format(ev.start, "HH:mm")} - {format(ev.end, "HH:mm")}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-muted-foreground">&nbsp;</div>
                        )}
                      </div>
                    </div>
                  )
                  day = addDays(day, 1)
                }
                weeks.push(
                  <div key={w} className="grid grid-cols-7 gap-2">
                    {days}
                  </div>
                )
              }
              return weeks
            })()}
          </div>
        </div>
      ) : viewMode === "week" ? (
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-lg">
          {renderWeekList()}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-lg">
          {renderDayView()}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 일정 추가</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="일정 제목"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="desc">설명</Label>
              <Textarea
                id="desc"
                value={newEvent.desc}
                onChange={(e) =>
                  setNewEvent((prev) => ({ ...prev, desc: e.target.value }))
                }
                placeholder="상세 내용"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>시작</Label>
                <Input
                  type="datetime-local"
                  value={
                    newEvent.start
                      ? format(newEvent.start, "yyyy-MM-dd'T'HH:mm")
                      : ""
                  }
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      start: new Date(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>종료</Label>
                <Input
                  type="datetime-local"
                  value={
                    newEvent.end
                      ? format(newEvent.end, "yyyy-MM-dd'T'HH:mm")
                      : ""
                  }
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      end: new Date(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSaveEvent}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
