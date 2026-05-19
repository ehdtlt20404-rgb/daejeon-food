'use client'

import { useState, useEffect, useMemo } from 'react'
import RestaurantCard from '@/components/RestaurantCard'
import { Restaurant } from '@/types'

const PAGE_SIZE = 12

const districtStyle: Record<string, { border: string; tag: string; btn: string; dongHeader: string }> = {
  서구: {
    border: 'border-blue-400',
    tag: 'bg-blue-500 text-white',
    btn: 'border-blue-400 text-blue-600 hover:bg-blue-50',
    dongHeader: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  중구: {
    border: 'border-emerald-400',
    tag: 'bg-emerald-500 text-white',
    btn: 'border-emerald-400 text-emerald-600 hover:bg-emerald-50',
    dongHeader: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  },
  유성구: {
    border: 'border-violet-400',
    tag: 'bg-violet-500 text-white',
    btn: 'border-violet-400 text-violet-600 hover:bg-violet-50',
    dongHeader: 'bg-violet-50 border-violet-200 text-violet-700',
  },
  동구: {
    border: 'border-rose-400',
    tag: 'bg-rose-500 text-white',
    btn: 'border-rose-400 text-rose-600 hover:bg-rose-50',
    dongHeader: 'bg-rose-50 border-rose-200 text-rose-700',
  },
}

interface DistrictSectionProps {
  district: string
  items: Restaurant[]
  onSelect: (r: Restaurant) => void
  resetKey: string
}

function extractDong(address: string): string {
  const parts = address.split(' ')
  const dong = parts[2] ?? ''
  if (dong.endsWith('동') || dong.endsWith('가')) return dong
  return '기타'
}

interface DongGroupProps {
  dong: string
  items: Restaurant[]
  onSelect: (r: Restaurant) => void
  style: { border: string; tag: string; btn: string; dongHeader: string }
}

function DongGroup({ dong, items, onSelect, style }: DongGroupProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const visible = items.slice(0, visibleCount)
  const remaining = items.length - visibleCount

  return (
    <div className="mb-8">
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border mb-3 ${style.dongHeader}`}>
        <span className="font-bold text-sm">{dong}</span>
        <span className="text-xs opacity-70">{items.length}곳</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visible.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} onClick={() => onSelect(r)} />
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className={`inline-flex items-center gap-2 px-5 py-2 bg-white border-2 font-bold rounded-xl text-sm transition-colors shadow-sm ${style.btn}`}
          >
            <span>{dong} 맛집 {Math.min(remaining, PAGE_SIZE)}개 더 보기</span>
            <span className="text-xs font-normal text-gray-400">(남은 {remaining}곳)</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default function DistrictSection({ district, items, onSelect, resetKey }: DistrictSectionProps) {
  const style = districtStyle[district] ?? districtStyle['서구']

  const dongGroups = useMemo(() => {
    const map = new Map<string, Restaurant[]>()
    items.forEach((r) => {
      const d = r.dong ?? extractDong(r.address)
      if (!map.has(d)) map.set(d, [])
      map.get(d)!.push(r)
    })
    // 기타를 마지막으로
    const sorted = Array.from(map.entries()).sort(([a], [b]) => {
      if (a === '기타') return 1
      if (b === '기타') return -1
      return a.localeCompare(b, 'ko')
    })
    return sorted
  }, [items])

  const categoryCount = useMemo(() => {
    const counts: Record<string, number> = {}
    items.forEach((r) => {
      counts[r.category] = (counts[r.category] ?? 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
  }, [items])

  return (
    <section>
      <div className={`flex flex-col sm:flex-row sm:items-end gap-3 mb-6 pl-4 border-l-4 ${style.border}`}>
        <div>
          <h2 className="text-2xl font-black text-gray-900">{district}</h2>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${style.tag}`}>
              총 {items.length}곳
            </span>
            <span className="text-xs text-gray-400">
              {dongGroups.length}개 동
            </span>
            {categoryCount.map(([cat, cnt]) => (
              <span key={cat} className="text-xs text-gray-500 font-medium">
                {cat} {cnt}
              </span>
            ))}
          </div>
        </div>
      </div>

      {dongGroups.map(([dong, dongItems]) => (
        <DongGroup
          key={dong + resetKey}
          dong={dong}
          items={dongItems}
          onSelect={onSelect}
          style={style}
        />
      ))}
    </section>
  )
}
