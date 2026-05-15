'use client'

import { Restaurant } from '@/types'
import { useEffect } from 'react'

interface RestaurantModalProps {
  restaurant: Restaurant | null
  onClose: () => void
}

const districtColor: Record<string, string> = {
  서구: 'bg-blue-100 text-blue-700',
  중구: 'bg-green-100 text-green-700',
  유성구: 'bg-purple-100 text-purple-700',
}
const priceRangeLabel: Record<string, string> = { 저렴: '₩ 저렴', 보통: '₩₩ 보통', 고급: '₩₩₩ 고급' }

export default function RestaurantModal({ restaurant, onClose }: RestaurantModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!restaurant) return null

  const kakaoSearchUrl = `https://map.kakao.com/link/search/${encodeURIComponent(restaurant.name + ' ' + restaurant.address)}`
  const naverBlogUrl = `https://search.naver.com/search.naver?where=blog&query=${encodeURIComponent('대전 ' + restaurant.district + ' ' + restaurant.name)}&sm=tab_opt&nso=so%3Ar%2Cp%3A1m`

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 이미지 */}
        <div className="h-48 bg-gradient-to-br from-orange-200 to-red-100 flex items-center justify-center relative shrink-0">
          <span className="text-7xl opacity-70">🍽️</span>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="text-2xl font-bold text-gray-800">{restaurant.name}</h2>
              {restaurant.priceRange && (
                <span className="text-sm text-gray-400 font-medium shrink-0 pt-1">
                  {priceRangeLabel[restaurant.priceRange]}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${districtColor[restaurant.district]}`}>
                {restaurant.district}
              </span>
              <span className="text-xs bg-orange-50 text-orange-600 font-semibold px-2.5 py-1 rounded-full">
                {restaurant.category}
              </span>
              {restaurant.rating && (
                <span className="text-sm font-semibold text-gray-700">
                  ★ {restaurant.rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>

          {restaurant.description && (
            <p className="text-gray-600 leading-relaxed">{restaurant.description}</p>
          )}

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-base">📍</span>
              <span>{restaurant.address}</span>
            </div>
            {restaurant.phone && (
              <div className="flex items-center gap-2">
                <span className="text-base">📞</span>
                <a href={`tel:${restaurant.phone}`} className="text-orange-500 hover:underline">
                  {restaurant.phone}
                </a>
                <span className="text-xs text-gray-400">(미확인 번호)</span>
              </div>
            )}
            {restaurant.hours && (
              <div className="flex items-center gap-2">
                <span className="text-base">🕐</span>
                <span>{restaurant.hours}</span>
              </div>
            )}
          </div>

          {restaurant.tags && restaurant.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {restaurant.tags.map((tag) => (
                <span key={tag} className="text-sm bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2 pt-1">
            <a
              href={naverBlogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
              </svg>
              최신 블로그 후기 보기
            </a>
            <a
              href={kakaoSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 rounded-xl transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.477 3 2 6.925 2 11.764c0 2.983 1.674 5.617 4.237 7.25L5.18 22.5l4.08-2.157A11.55 11.55 0 0012 20.527c5.523 0 10-3.925 10-8.763C22 6.925 17.523 3 12 3z"/>
              </svg>
              카카오맵에서 보기
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
