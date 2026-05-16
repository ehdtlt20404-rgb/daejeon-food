'use client'

import { useState, useMemo } from 'react'
import FilterBar from '@/components/FilterBar'
import DistrictSection from '@/components/DistrictSection'
import RestaurantModal from '@/components/RestaurantModal'
import { restaurants } from '@/data/restaurants'
import { Category, District, Restaurant } from '@/types'

const districtOrder: District[] = ['서구', '중구', '유성구']

const districtMeta: Record<string, { color: string; bg: string; text: string }> = {
  서구: { color: 'border-blue-400', bg: 'bg-blue-500', text: '둔산·갈마·탄방·관저' },
  중구: { color: 'border-emerald-400', bg: 'bg-emerald-500', text: '은행·대흥·선화·목동' },
  유성구: { color: 'border-violet-400', bg: 'bg-violet-500', text: '봉명·온천·궁동·어은·노은' },
}

export default function Home() {
  const [selectedDistrict, setSelectedDistrict] = useState<District | '전체'>('전체')
  const [selectedCategory, setSelectedCategory] = useState<Category>('전체')
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      const matchDistrict = selectedDistrict === '전체' || r.district === selectedDistrict
      const matchCategory = selectedCategory === '전체' || r.category === selectedCategory
      const matchSearch =
        searchQuery === '' ||
        r.name.includes(searchQuery) ||
        r.description?.includes(searchQuery) ||
        r.tags?.some((t) => t.includes(searchQuery))
      return matchDistrict && matchCategory && matchSearch
    })
  }, [selectedDistrict, selectedCategory, searchQuery])

  const grouped = useMemo(() => {
    if (selectedDistrict !== '전체') {
      return { [selectedDistrict]: filtered }
    }
    const groups: Record<string, Restaurant[]> = {}
    filtered.forEach((r) => {
      if (!groups[r.district]) groups[r.district] = []
      groups[r.district].push(r)
    })
    return groups
  }, [filtered, selectedDistrict])

  const districtCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    restaurants.forEach((r) => {
      counts[r.district] = (counts[r.district] ?? 0) + 1
    })
    return counts
  }, [])

  const resetKey = `${selectedDistrict}-${selectedCategory}-${searchQuery}`

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 히어로 */}
      <header className="bg-gradient-to-br from-orange-500 via-orange-400 to-red-500 text-white relative overflow-hidden">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 text-6xl">🍜</div>
          <div className="absolute top-2 right-16 text-5xl">🥩</div>
          <div className="absolute bottom-4 left-24 text-4xl">☕</div>
          <div className="absolute bottom-2 right-8 text-6xl">🍣</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold mb-3">
                <span>📍</span> 대전광역시 음식점 가이드
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                대전 맛지도
              </h1>
              <p className="text-orange-100 mt-2 text-base">
                서구 · 중구 · 유성구 <span className="font-bold text-white">{restaurants.length}개</span> 맛집 한 눈에
              </p>
            </div>

            {/* 구별 카운트 카드 */}
            <div className="flex gap-2">
              {districtOrder.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setSelectedDistrict(d)
                    setSelectedCategory('전체')
                  }}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-4 py-3 text-center transition-all cursor-pointer border border-white/20"
                >
                  <div className="text-2xl font-black">{districtCounts[d] ?? 0}</div>
                  <div className="text-xs font-semibold text-orange-100 mt-0.5">{d}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 검색창 */}
          <div className="mt-6 max-w-lg">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="가게 이름, 음식, 태그로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl text-gray-800 bg-white shadow-xl outline-none focus:ring-2 focus:ring-orange-300 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 필터 */}
      <FilterBar
        selectedDistrict={selectedDistrict}
        selectedCategory={selectedCategory}
        onDistrictChange={setSelectedDistrict}
        onCategoryChange={setSelectedCategory}
        totalCount={filtered.length}
      />

      {/* 구별 탭 빠른 이동 (전체 선택 시) */}
      {selectedDistrict === '전체' && !searchQuery && selectedCategory === '전체' && (
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <div className="grid grid-cols-3 gap-4">
            {districtOrder.map((d) => {
              const meta = districtMeta[d]
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDistrict(d)}
                  className={`border-l-4 ${meta.color} bg-white rounded-xl p-4 text-left hover:shadow-md transition-all`}
                >
                  <div className="font-black text-gray-800 text-lg">{d}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{meta.text}</div>
                  <div className={`inline-flex items-center gap-1 mt-2 text-white text-xs font-bold px-2.5 py-1 rounded-full ${meta.bg}`}>
                    {districtCounts[d]}개 가게
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 식당 목록 */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <div className="text-6xl mb-4">🍽️</div>
            <div className="text-xl font-bold text-gray-600">검색 결과가 없어요</div>
            <div className="text-sm mt-2">다른 지역이나 카테고리를 선택해보세요</div>
            {(searchQuery || selectedCategory !== '전체') && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('전체'); setSelectedDistrict('전체') }}
                className="mt-4 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
              >
                필터 초기화
              </button>
            )}
          </div>
        ) : (
          districtOrder
            .filter((d) => grouped[d])
            .map((district) => (
              <DistrictSection
                key={district}
                district={district}
                items={grouped[district]}
                onSelect={(r: Restaurant) => setSelectedRestaurant(r)}
                resetKey={resetKey}
              />
            ))
        )}
      </div>

      {/* 푸터 */}
      <footer className="bg-white border-t border-gray-100 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="font-black text-gray-800 text-lg">대전 맛지도</div>
              <div className="text-sm text-gray-400 mt-1">서구 · 중구 · 유성구 {restaurants.length}개 맛집</div>
            </div>
            <div className="text-xs text-gray-400 leading-relaxed">
              <p>전화번호는 미확인 정보를 포함할 수 있습니다.</p>
              <p>방문 전 영업시간을 꼭 확인하세요.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* 모달 */}
      <RestaurantModal
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
      />
    </main>
  )
}
