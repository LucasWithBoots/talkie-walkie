package io.github.lucaswithboots

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.websocket.*
import io.ktor.http.*
import io.ktor.websocket.*
import kotlinx.coroutines.runBlocking
import java.io.File

fun main() {
    val client = HttpClient(CIO) {
        install(WebSockets)
    }

    val audioFile = File("audio_to_send.mp3")
    val audioBytes = audioFile.readBytes()

    runBlocking {
        client.webSocket(method = HttpMethod.Get, host = "127.0.0.1", port = 8080, path = "/audio") {
            send(Frame.Binary(true, audioBytes))
            println("Audio sent!")
        }
    }
    client.close()
}