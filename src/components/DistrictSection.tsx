'use client'

import { useState, useEffect, useMemo } from 'react'
import RestaurantCard from '@/components/RestaurantCard'
import { Restaurant } from '@/types'

const PAGE_SIZE = 12

const districtStyle: Record<string, { border: string; tag: string; btn: string }> = {
  서구: {
    border: 'border-blue-400',
    tag: 'bg-blue-500 text-white',
    btn: 'border-blue-400 text-blue-600 hover:bg-blue-50',
  },
  중구: {
    border: 'border-emerald-400',
    tag: 'bg-emerald-500 text-white',
    btn: 'border-emerald-400 text-emerald-600 hover:bg-emerald-50',
  },
  유성구: {
    border: 'border-violet-400',
    tag: 'bg-violet-500 text-white',
    btn: 'border-violet-400 text-violet-600 hover:bg-violet-50',
  },
}

interface DistrictSectionProps {
  district: string
  items: Restaurant[]
  onSelect: (r: Restaurant) => void
  resetKey: string
}

export default function DistrictSection({ district, items, onSelect, resetKey }: DistrictSectionProps) {
  const [visibleCount, setVisibleCount] = useState(12)
  const style = districtStyle[district] ?? districtStyle['서구']

  useEffect(() => {
    setVisibleCount(12)
  }, [resetKey])

  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = {}
    items.forEach((r) => {
      counts[r.category] = (counts[r.category] ?? 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
  }, [items])

  const visible = items.slice(0, visibleCount)
  const remaining = items.length - visibleCount
  const nextBatch = Math.min(remaining, PAGE_SIZE)

  return (
    <section>
      {/* 섹션 헤더 */}
      <div className={`flex flex-col sm:flex-row sm:items-end gap-3 mb-6 pl-4 border-l-4 ${style.border}`}>
        <div>
          <h2 className="text-2xl font-black text-gray-900">{district}</h2>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${style.tag}`}>
              총 {items.length}곳
            </span>
            {categoryCount.map(([cat, cnt]) => (
              <span key={cat} className="text-xs text-gray-500 font-medium">
                {cat} {cnt}
              </span>
            ))}
          </div>
        </div>
        {visibleCount < items.length && (
          <span className="sm:ml-auto text-xs text-gray-400">
            {visibleCount}개 표시 중
          </span>
        )}
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visible.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} onClick={() => onSelect(r)} />
        ))}
      </div>

      {/* 더 보기 버튼 */}
      {remaining > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className={`inline-flex items-center gap-2 px-7 py-3 bg-white border-2 font-bold rounded-2xl transition-colors shadow-sm ${style.btn}`}
          >
            <span>{district} 맛집 {nextBatch}개 더 보기</span>
            <span className="text-xs font-normal text-gray-400">(남은 {remaining}곳)</span>
          </button>
        </div>
      )}

      {remaining <= 0 && items.length > 12 && (
        <div className="mt-6 text-center text-sm text-gray-400">
          {district}의 모든 맛집 <span className="font-semibold">{items.length}곳</span>을 모두 보고 있어요 ✓
        </div>
      )}
    </section>
  )
}
