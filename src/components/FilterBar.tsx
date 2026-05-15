'use client'

import { Category, District } from '@/types'

const districts: District[] = ['서구', '중구', '유성구']

const categories: { value: Category; emoji: string }[] = [
  { value: '전체', emoji: '🍽️' },
  { value: '한식', emoji: '🍲' },
  { value: 'BBQ/고기', emoji: '🥩' },
  { value: '일식', emoji: '🍣' },
  { value: '중식', emoji: '🥟' },
  { value: '양식', emoji: '🍝' },
  { value: '분식', emoji: '🌮' },
  { value: '해산물', emoji: '🦞' },
  { value: '카페/디저트', emoji: '☕' },
  { value: '술집', emoji: '🍺' },
  { value: '레스토랑', emoji: '🕯️' },
]

const districtStyles: Record<string, { active: string; hover: string }> = {
  전체: { active: 'bg-orange-500 text-white shadow-md', hover: 'hover:bg-orange-50 hover:text-orange-600' },
  서구: { active: 'bg-blue-500 text-white shadow-md', hover: 'hover:bg-blue-50 hover:text-blue-600' },
  중구: { active: 'bg-emerald-500 text-white shadow-md', hover: 'hover:bg-emerald-50 hover:text-emerald-600' },
  유성구: { active: 'bg-violet-500 text-white shadow-md', hover: 'hover:bg-violet-50 hover:text-violet-600' },
}

interface FilterBarProps {
  selectedDistrict: District | '전체'
  selectedCategory: Category
  onDistrictChange: (d: District | '전체') => void
  onCategoryChange: (c: Category) => void
  totalCount: number
}

export default function FilterBar({
  selectedDistrict,
  selectedCategory,
  onDistrictChange,
  onCategoryChange,
  totalCount,
}: FilterBarProps) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 py-3 space-y-2.5">
        {/* 지역 필터 */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide shrink-0">지역</span>
          <div className="flex gap-2">
            {(['전체', ...districts] as const).map((d) => {
              const style = districtStyles[d]
              const isActive = selectedDistrict === d
              return (
                <button
                  key={d}
                  onClick={() => onDistrictChange(d)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    isActive ? style.active : `bg-gray-100 text-gray-600 ${style.hover}`
                  }`}
                >
                  {d}
                </button>
              )
            })}
          </div>
          <div className="ml-auto shrink-0 text-xs text-gray-400">
            <span className="font-bold text-orange-500">{totalCount}</span>개 가게
          </div>
        </div>

        {/* 카테고리 필터 - 가로 스크롤 */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide -mx-1 px-1">
          {categories.map(({ value, emoji }) => (
            <button
              key={value}
              onClick={() => onCategoryChange(value)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                selectedCategory === value
                  ? 'bg-orange-500 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              <span className="text-sm">{emoji}</span>
              <span>{value}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
