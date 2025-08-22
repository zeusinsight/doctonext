import { db } from "@/database/db"
import { users } from "@/database/schema"

async function checkUsers() {
    try {
        const allUsers = await db.select().from(users)
        
        console.log("All users:")
        allUsers.forEach(user => {
            console.log(`- ${user.email}: role = ${user.role}`)
        })
        
        if (allUsers.length === 0) {
            console.log("No users found in database")
        }
    } catch (error) {
        console.error("Error:", error)
    }

    process.exit(0)
}

checkUsers()