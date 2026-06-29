import { ref } from 'vue'
import { defineStore } from 'pinia'
import { onMessage } from 'firebase/messaging'

import { APICall } from '@/service/api/api'
import { messaging } from '@/lib/firebase'

export const useNotifications = defineStore('notifications', () => {
    const hasUnread = ref(false)
    const receivedCount = ref(0)

    async function fetchUnreadStatus() {
        hasUnread.value = await new APICall<boolean>('notifications/has-unread').execute()
    }

    function onNotificationReceived() {
        hasUnread.value = true
        receivedCount.value++
        console.log('receivedCount: ' + receivedCount.value);
    }

    onMessage(messaging, onNotificationReceived)

    const broadcastChannel = new BroadcastChannel('notifications')
    broadcastChannel.onmessage = onNotificationReceived

    return { hasUnread, receivedCount, fetchUnreadStatus }
})
