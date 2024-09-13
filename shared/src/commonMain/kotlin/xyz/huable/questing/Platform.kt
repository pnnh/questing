package xyz.huable.questing

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform