<template>
    <TheLayout>
        <div
            v-if="notification == undefined"
            class="notification-info-view__loader"
        >
            <TheSpinner size="lg" />
        </div>

        <template v-else>
            <TheTitle>Notification - {{ notification.title }}</TheTitle>

            <div class="notification-info-view__header-meta">
                <span>{{ formatDate(notification.createdAt) }}</span>
            </div>

            <div class="notification-info-view__meta-row">
                <span class="notification-info-view__message">{{ notification.message }}</span>
            </div>
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { APICall } from '@/service/api/api';
    import { useAuth } from '@/store/auth/auth';
    import { Notification } from '@/components/notifications/notifications-models';

    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';

    const route = useRoute();
    const auth = useAuth();

    const notification = ref<Notification | undefined>(undefined);

    function formatDate(isoDate: string): string {
        return new Date(isoDate).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    onMounted(async () => {
        notification.value = await (new APICall<Notification>(
            `notifications/${auth.user!.id}/${route.params.id}`
        )).execute();

        await (new APICall(`notifications/${route.params.id}/mark-read`, 'POST')).execute();
    });
</script>

<style>
    .notification-info-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notification-info-view__header-meta {
        display: flex;
        align-items: center;
        gap: 15px;
        color: #666;
        margin-bottom: 20px;
    }

    .notification-info-view__meta-row {
        display: flex;
        align-items: flex-start;
        gap: 6px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }
    
    .notification-info-view__message {
        white-space: pre-line;
    }
</style>
