import { PrismaClient, ReportStatus, RequestStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const random = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min

const randomPastDate = (yearsBack = 5) => {
    const now = new Date()
    const past = new Date()
    past.setFullYear(now.getFullYear() - rand(1, yearsBack))
    return past
}

const firstNames = [
    "Michael", "Emma", "Olivia", "James", "Sophia", "Daniel", "Isabella", "Lucas",
    "Ethan", "Charlotte", "Henry", "Amelia", "Jacob", "Ava", "Harper", "Noah",
    "Liam", "Mason", "Ella", "Grace"
]

const lastNames = [
    "Smith", "Johnson", "Brown", "Taylor", "Anderson", "Martinez", "Davis", "Moore",
    "Walker", "Hall", "Allen", "Young", "King", "Wright", "Scott", "Hill",
    "Green", "Adams", "Baker", "Turner"
]

const problemTitles = [
    "Leaking faucet in bathroom",
    "Broken elevator",
    "Heating not working",
    "Wi-Fi issues in apartment",
    "Noise complaint from neighbors",
    "Lights not working in hallway",
    "Broken mailbox lock",
    "Water pressure too low",
    "Cracked window",
    "Strange smell on the floor"
]

const problemDescriptions = [
    "Water keeps dripping even when the faucet is closed.",
    "Elevator gets stuck between floors.",
    "Radiators remain cold despite heating being on.",
    "Internet connection keeps dropping.",
    "Neighbors are being loud late at night.",
    "Hall lights flicker or stay off completely.",
    "The mailbox cannot be locked properly.",
    "Shower pressure is very weak since yesterday.",
    "Window in the living room has a visible crack.",
    "Unpleasant smell coming from the trash chute."
]

const newsTitles = [
    "Planned Power Outage",
    "Maintenance of Central Heating System",
    "Renovation Works in the Parking Lot",
    "New Recycling Rules Introduced",
    "Annual Fire Safety Inspection",
    "Playground Upgrade Completed",
    "Water Pipeline Maintenance",
    "Garden Area Refresh",
    "Elevator Modernization Plan",
    "Community Meeting Scheduled"
]

const newsContents = [
    "Due to maintenance work, a temporary power outage is scheduled for tomorrow between 10:00 and 14:00.",
    "Heating system maintenance will take place this weekend.",
    "Parking lot resurfacing will start next Monday. Expect limited access.",
    "New waste sorting rules take effect next month.",
    "Fire safety inspection will be carried out in all apartments this Friday.",
    "The playground has been upgraded with new equipment.",
    "Water system maintenance may cause temporary pressure drops.",
    "Gardens will be refreshed with new plants this spring.",
    "Elevator modernization will start soon; details will be announced shortly.",
    "A community meeting will be held next Wednesday at 18:00."
]

async function main() {

    await prisma.message.deleteMany()
    await prisma.chat.deleteMany()
    await prisma.problemReport.deleteMany()
    await prisma.sharedSpaceReservation.deleteMany()
    await prisma.sharedSpace.deleteMany()
    await prisma.news.deleteMany()
    await prisma.users.deleteMany()
    await prisma.apartment.deleteMany()
    await prisma.community.deleteMany()
    await prisma.userRequest.deleteMany()

    const hashedPassword = await bcrypt.hash("123", 10)

    await prisma.community.createMany({
        data: [
            { name: "Sunset Residences", address: "Sunset Avenue 12, Seattle" },
            { name: "Riverpark Estate", address: "River Road 55, Austin" },
            { name: "Greenview Heights", address: "Hilltop Street 22, Denver" }
        ]
    })

    const communities = await prisma.community.findMany()

    for (const c of communities) {
        for (let i = 1; i <= 7; i++) {
            await prisma.apartment.create({
                data: {
                    number: `${i}0${c.id}`,
                    community_id: c.id
                }
            })
        }
    }

    const apartments = await prisma.apartment.findMany()

    const admin = await prisma.users.create({
        data: {
            email: "admin@admin.com",
            password: hashedPassword,
            role: "ADMIN",
            first_name: "System",
            second_name: "Admin",
            phone_number: "+1 555 909 000",
            residence_start: new Date(),
            residence_end: null
        }
    })

    const users: any[] = []

    for (let i = 1; i <= 25; i++) {
        const user = await prisma.users.create({
            data: {
                email: `resident${i}@mail.com`,
                password: hashedPassword,
                role: "USER",
                first_name: random(firstNames),
                second_name: random(lastNames),
                phone_number: `+1 555 21${rand(10, 99)}`,
                apartment_id: random(apartments).id,
                residence_start: randomPastDate(5),
                residence_end: null
            }
        })
        users.push(user)
    }

    for (let i = 0; i < 10; i++) {
        await prisma.news.create({
            data: {
                title: newsTitles[i],
                content: newsContents[i],
                created_by: admin.id,
                community_id: random(communities).id
            }
        })
    }

    const spaces: any[] = []

    for (const c of communities) {
        spaces.push(
            await prisma.sharedSpace.create({
                data: {
                    name: "Gym",
                    description: "Community fitness room",
                    max_places: 10,
                    community_id: c.id
                }
            }),
            await prisma.sharedSpace.create({
                data: {
                    name: "Meeting Room",
                    description: "Room for resident meetings",
                    max_places: 20,
                    community_id: c.id
                }
            })
        )
    }

    for (let i = 0; i < 20; i++) {
        const start = new Date()
        start.setHours(9 + (i % 6))
        const end = new Date(start.getTime() + 90 * 60 * 1000)

        await prisma.sharedSpaceReservation.create({
            data: {
                shared_space_id: random(spaces).id,
                start_time: start,
                end_time: end,
                places_reserved: rand(1, 5),
                user_id: random(users).id
            }
        })
    }

    const statuses = Object.values(ReportStatus)

    for (let i = 0; i < 25; i++) {
        const status = random(statuses)

        await prisma.problemReport.create({
            data: {
                title: random(problemTitles),
                description: random(problemDescriptions),
                status,
                reported_by: random(users).id,
                handled_by: status !== ReportStatus.REPORTED ? admin.id : null,
                accepted_at: status !== ReportStatus.REPORTED ? new Date() : null,
                started_at: status === ReportStatus.IN_PROGRESS ? new Date() : null,
                closed_at: status === ReportStatus.COMPLETED ? new Date() : null,
                rejection_reason: status === ReportStatus.REJECTED ? "Not enough information" : null
            }
        })
    }

    for (let i = 0; i < 10; i++) {
        const user = random(users)
        const chat = await prisma.chat.create({
            data: { userId: user.id, adminId: admin.id }
        })

        await prisma.message.createMany({
            data: [
                { chatId: chat.id, senderId: user.id, content: "Hi, I have a problem with my heating." },
                { chatId: chat.id, senderId: admin.id, content: "Hello! Can you describe the issue?" }
            ]
        })
    }

    for (let i = 1; i <= 15; i++) {
        await prisma.userRequest.create({
            data: {
                email: `request${i}@gmail.com`,
                pesel: `90010112${100 + i}`,
                first_name: random(firstNames),
                second_name: random(lastNames),
                phone_number: `+1 555 30${rand(10, 99)}`,
                status: [RequestStatus.APPROVED, RequestStatus.PENDING, RequestStatus.REJECTED][i % 3]
            }
        })
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
