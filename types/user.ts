export type User = {
    id: number
    first_name: string
    second_name: string
    email: string
    phone_number: string
    apartment_id: number
    role: 'USER' | 'ADMIN'
    created_at: string
}