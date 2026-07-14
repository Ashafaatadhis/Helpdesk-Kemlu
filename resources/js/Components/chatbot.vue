<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const toggleButton = ref(null)
const chatContainer = ref(null)
const maximizeButton = ref(null)

let handleToggle = null
let handleMaximize = null
let handleFullscreenChange = null

const syncFullscreenState = () => {
    const container = chatContainer.value
    const maximize = maximizeButton.value

    if (!container || !maximize) return

    const isFullscreen = document.fullscreenElement === container
    container.classList.toggle('maximized', isFullscreen)
    maximize.classList.toggle('active', isFullscreen)
}

onMounted(() => {
    const button = toggleButton.value
    const container = chatContainer.value
    const maximize = maximizeButton.value

    if (!button || !container || !maximize) return

    handleToggle = () => {
        container.classList.toggle('show')
        button.classList.toggle('active')
    }

    handleMaximize = async () => {
        if (!document.fullscreenEnabled) {
            container.classList.toggle('maximized')
            return
        }

        try {
            if (document.fullscreenElement === container) {
                await document.exitFullscreen()
            } else {
                await container.requestFullscreen()
            }
        } catch (error) {
            console.error('Gagal mengubah mode fullscreen:', error)
            container.classList.toggle('maximized')
        }
    }

    handleFullscreenChange = () => {
        syncFullscreenState()
    }

    button.addEventListener('click', handleToggle)
    maximize.addEventListener('click', handleMaximize)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    syncFullscreenState()
})

onBeforeUnmount(() => {
    if (toggleButton.value && handleToggle) {
        toggleButton.value.removeEventListener('click', handleToggle)
    }

    if (maximizeButton.value && handleMaximize) {
        maximizeButton.value.removeEventListener('click', handleMaximize)
    }

    if (handleFullscreenChange) {
        document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
})
</script>

<template>
    <button
        ref="toggleButton"
        id="chatbot-toggle-btn"
        class="chatbot-toggler"
        type="button"
        aria-label="Buka chatbot"
    >
        <svg class="chatbot-icon icon-open" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Zm0 14H6l-2 2V4h16v12Z" fill="currentColor"/>
            <path d="M7 9h2v2H7Zm4 0h2v2h-2Zm4 0h2v2h-2Z" fill="currentColor"/>
        </svg>
        <svg class="chatbot-icon icon-close" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
    </button>

    <div ref="chatContainer" id="chatbot-container" class="chatbot-container">
        <div class="chatbot-header">
            <span>AI Chatbot - Kemlu RI</span>

            <div class="header-controls">
                <button
                    ref="maximizeButton"
                    id="chatbot-maximize-btn"
                    class="control-btn"
                    type="button"
                    aria-label="Maksimalkan chatbot"
                >
                    <svg class="icon icon-maximize" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M5 4h5v2H7v3H5V4Zm14 0v5h-2V7h-3V5h5Zm0 14h-5v-2h3v-3h2v5Zm-14 0v-5h2v3h3v2H5Z" fill="currentColor" />
                    </svg>
                    <svg class="icon icon-restore" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M7 7h5v-2H7a2 2 0 0 0-2 2v5h2V7Zm10 10h-5v2h5a2 2 0 0 0 2-2v-5h-2v5Zm-5-2h-5v2h5v-2Zm0-10v2h5V7h-5Zm-2 5h2V9h-2v3Z" fill="currentColor" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="chatbot-content">
            <iframe
                src="http://127.0.0.1:5000"
                title="Chatbot"
                scrolling="no"
            ></iframe>
        </div>

        <div class="resize-handle"></div>
    </div>
</template>

<style src="../../css/chatbot.css"></style>