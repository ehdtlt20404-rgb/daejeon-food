export type District = '서구' | '중구' | '유성구'

export type Category =
  | '전체'
  | '한식'
  | '중식'
  | '일식'
  | '양식'
  | '분식'
  | 'BBQ/고기'
  | '해산물'
  | '카페/디저트'
  | '술집'
  | '레스토랑'

export interface Restaurant {
  id: string
  name: string
  district: District
  address: string
  category: Exclude<Category, '전체'>
  phone?: string
  hours?: string
  description?: string
  tags?: string[]
  lat?: number
  lng?: number
  imageUrl?: string
  rating?: number
  priceRange?: '저렴' | '보통' | '고급'
}
