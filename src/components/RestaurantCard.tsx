import { Restaurant } from '@/types'

const categoryEmoji: Record<string, string> = {
  한식: '🍲', 중식: '🥟', 일식: '🍣', 양식: '🍝', 분식: '🌮',
  'BBQ/고기': '🥩', 해산물: '🦞', '카페/디저트': '☕', 술집: '🍺', 레스토랑: '🕯️',
}

const districtAccent: Record<string, string> = {
  서구: 'bg-blue-500',
  중구: 'bg-emerald-500',
  유성구: 'bg-violet-500',
}

const districtBadge: Record<string, string> = {
  서구: 'bg-blue-50 text-blue-700 border border-blue-200',
  중구: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  유성구: 'bg-violet-50 text-violet-700 border border-violet-200',
}

const priceColor: Record<string, string> = {
  저렴: 'text-emerald-600',
  보통: 'text-amber-600',
  고급: 'text-rose-600',
}

const priceLabel: Record<string, string> = {
  저렴: '₩ 저렴',
  보통: '₩₩ 보통',
  고급: '₩₩₩ 고급',
}

interface RestaurantCardProps {
  restaurant: Restaurant
  onClick: () => void
}

export default function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  const isHighlyRated = restaurant.rating && restaurant.rating >= 4.4

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
    >
      {/* 상단 컬러 헤더 */}
      <div className="relative h-28 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shrink-0">
        {/* 지역별 왼쪽 액센트 바 */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${districtAccent[restaurant.district]}`} />

        {/* 카테고리 이모지 */}
        <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform duration-200 select-none">
          {categoryEmoji[restaurant.category] ?? '🍽️'}
        </span>

        {/* 인기 배지 */}
        {isHighlyRated && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            인기
          </div>
        )}

        {/* 가격대 */}
        {restaurant.priceRange && (
          <div className={`absolute bottom-3 right-3 text-xs font-semibold ${priceColor[restaurant.priceRange]}`}>
            {priceLabel[restaurant.priceRange]}
          </div>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        {/* 이름 */}
        <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-orange-600 transition-colors line-clamp-1">
          {restaurant.name}
        </h3>

        {/* 지역·카테고리 뱃지 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${districtBadge[restaurant.district]}`}>
            {restaurant.district}
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
            {restaurant.category}
          </span>
        </div>

        {/* 평점 */}
        {restaurant.rating && (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(restaurant.rating!) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs font-bold text-gray-700">{restaurant.rating.toFixed(1)}</span>
          </div>
        )}

        {/* 주소 */}
        <p className="text-xs text-gray-400 truncate flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{restaurant.address.replace('대전 ', '')}</span>
        </p>

        {/* 영업시간 */}
        {restaurant.hours && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
            </svg>
            <span className="truncate">{restaurant.hours.split(' (')[0]}</span>
          </p>
        )}

        {/* 소개 */}
        {restaurant.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{restaurant.description}</p>
        )}

        {/* 태그 */}
        {restaurant.tags && restaurant.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-auto pt-1">
            {restaurant.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
