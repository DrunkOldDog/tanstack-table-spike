export type HouseOwner = {
  userId: string
  firstName: string
  lastName: string
  email: string
}

export type HouseData = {
  price: number
  area: number
  bedrooms: number
  bathrooms: number
  stories: number
  mainroad: boolean
  guestroom: boolean
  basement: boolean
  hotwaterheating: boolean
  airconditioning: boolean
  parking: number
  prefarea: boolean
  furnishingstatus: string
  houseOwner: HouseOwner
}
