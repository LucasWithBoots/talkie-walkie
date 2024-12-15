package io.github.lucaswithboots

import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import java.util.*
import kotlin.time.Duration.Companion.seconds

fun Application.configureSockets() {
    install(WebSockets) {
        pingPeriod = 15.seconds
        timeout = 15.seconds
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }

    val sessions = mutableMapOf<String, DefaultWebSocketSession>()

    routing {
        webSocket("/audio") {
            val clientId = "client-${UUID.randomUUID()}"
            sessions[clientId] = this

            for (frame in incoming) {
                if (frame is Frame.Text) {
                    println("Recebido de $clientId")
                    val audioBase64 = frame.readText()
                    send(audioBase64)
                }
            }
        }
    }
}