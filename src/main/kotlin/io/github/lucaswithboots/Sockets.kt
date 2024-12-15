package io.github.lucaswithboots

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import java.io.File
import java.time.Duration
import kotlin.io.encoding.Base64
import kotlin.time.Duration.Companion.seconds

fun Application.configureSockets() {
    install(WebSockets) {
        pingPeriod = 15.seconds
        timeout = 15.seconds
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }
    routing {
        webSocket("/ws") { // websocketSession
            for (frame in incoming) {
                if (frame is Frame.Text) {
                    val text = frame.readText()
                    outgoing.send(Frame.Text("YOU SAID: $text"))
                    if (text.equals("bye", ignoreCase = true)) {
                        close(CloseReason(CloseReason.Codes.NORMAL, "Client said BYE"))
                    }
                }
            }
        }

        webSocket("/audio") {
            for (frame in incoming) {
                if (frame is Frame.Text) {
                   val audioBase64 = frame.readText()
                    val audioBytes = java.util.Base64.getDecoder().decode(audioBase64)
                    saveAudioToFile(audioBytes)
                    outgoing.send(Frame.Text("Audio saved, size: ${audioBytes.size}"))
                }
            }
        }
    }
}

fun saveAudioToFile(data: ByteArray) {
    val file = File("received_audio_${System.currentTimeMillis()}.wav")
    file.writeBytes(data)
    println("Áudio salvo em: ${file.absolutePath}")
}