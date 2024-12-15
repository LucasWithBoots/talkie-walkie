package io.github.lucaswithboots

import io.github.lucaswithboots.model.MessageResponse
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import kotlinx.coroutines.channels.consumeEach
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.io.File
import java.time.Duration
import java.util.*
import kotlin.collections.LinkedHashSet
import kotlin.io.encoding.Base64
import kotlin.time.Duration.Companion.seconds

fun Application.configureSockets() {
    install(WebSockets) {
        pingPeriod = 15.seconds
        timeout = 15.seconds
        maxFrameSize = Long.MAX_VALUE
        masking = false
    }

    val sessions = Collections.synchronizedSet<DefaultWebSocketSession?>(LinkedHashSet())

    routing {
        webSocket("/ws") {
            // Adicionar a sessão atual à lista
            sessions.add(this)

            try {
                for (frame in incoming) {
                    if (frame is Frame.Text) {
                        val receivedText = frame.readText()
                        val message = MessageResponse(receivedText)

                        // Enviar mensagem para todas as sessões, exceto o remetente
                        sessions.forEach { session ->
                            if (session != this && session.isActive) {
                                session.send(message.message)
                            }
                        }
                    }
                }
            } catch (e: Exception) {
                println("WebSocket exception: ${e.localizedMessage}")
            } finally {
                // Remover a sessão ao desconectar
                sessions.remove(this)
            }
        }


        webSocket("/audio") {
            sessions.add(this)

            for (frame in incoming) {
                if (frame is Frame.Text) {
                   val audioBase64 = frame.readText()
                    val audioBytes = java.util.Base64.getDecoder().decode(audioBase64)
                    sessions.forEach { session ->
                        if (session != this && session.isActive) {
                            session.send(audioBytes)
                        }
                    }
                }
            }
        }
    }
}

fun saveAudioToFile(data: ByteArray) {
    val file = File("audios/received_audio_${System.currentTimeMillis()}.wav")
    file.writeBytes(data)
    println("Áudio salvo em: ${file.absolutePath}")
}