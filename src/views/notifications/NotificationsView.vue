<template>
    <TheLayout>
        <TheTitle>Notifications</TheTitle>

        <div class="notifications-view__tabs">
            <div
                @click="read = false"
                :class="['notifications-view__tab', { 'notifications-view__tab--active': !read }]"
            >
                Unread
            </div>
            <div
                @click="read = true"
                :class="['notifications-view__tab', { 'notifications-view__tab--active': read }]"
            >
                Read
            </div>
        </div>

        <div class="notifications-view__tab__wrapper">
            <div
                v-if="!loaded"
                class="notifications-view__loader"
            >
                <TheSpinner size="lg" />
            </div>
            <template v-else>
                <div
                    v-if="notificationsPage?.totalElements != 0"
                    class="notifications-view__results"
                >
                    <div class="notifications-view__list">
                        <div
                            v-for="notification in notificationsPage?.notifications"
                            :key="notification.id"
                            class="notifications-view__item"
                            @click="router.push({ name: 'notification-info', params: { id: notification.id } })"
                        >
                            <p class="notifications-view__item__title">{{ notification.title }}</p>
                            <p class="notifications-view__item__date">{{ formatDate(notification.createdAt) }}</p>
                        </div>
                    </div>

                    <ThePager
                        v-if="(notificationsPage?.totalElements ?? 0) > pageSize"
                        :current-page="currentPage"
                        :total-pages="notificationsPage?.totalPages"
                        @previous="getPreviousPage()"
                        @next="getNextPage()"
                    />
                </div>

                <div
                    v-else
                    class="notifications-view__no-results"
                >
                    <p>No notifications found</p>
                </div>
            </template>
        </div>
    </TheLayout>
</template>

<script setup lang="ts">
    import router from '@/router';
    import { computed, onMounted, ref, watch } from 'vue';
    import { NotificationsPage } from '@/components/notifications/notifications-models';
    import { APICall } from '@/service/api/api';
    import { useAuth } from '@/store/auth/auth';
    import { useNotifications } from '@/store/notifications/notifications';

    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';
    import ThePager from '@/components/base/ThePager.vue';

    const auth = useAuth();
    const pageSize = 10;

    const notificationsPage = ref<NotificationsPage | undefined>(undefined);
    const read = ref<boolean>(false);
    const currentPage = ref<number>(1);

    const loaded = computed<boolean>(() => notificationsPage.value != undefined);

    watch(read, () => {
        currentPage.value = 1;
        notificationsPage.value = undefined;
        fetchNotifications();
    });

    async function fetchNotifications() {
        console.log("fetching fucking notifications")
        notificationsPage.value = await (new APICall<NotificationsPage>(
            `notifications/${auth.user!.id}?read=${read.value}&page=${currentPage.value}`
        )).execute();
    }

    async function getNextPage() {
        currentPage.value++;
        notificationsPage.value = undefined;
        await fetchNotifications();
    }

    async function getPreviousPage() {
        currentPage.value--;
        notificationsPage.value = undefined;
        await fetchNotifications();
    }

    function formatDate(isoDate: string): string {
        return new Date(isoDate).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    const notificationsStore = useNotifications();

    watch(() => notificationsStore.receivedCount, async () => {
        console.log(notificationsStore.receivedCount, read.value)
        if (!read.value) await fetchNotifications();
    });

    onMounted(async () => {
        await fetchNotifications();
    });
</script>

<style lang="scss">
    .notifications-view__tabs {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        width: 100%;
        border-bottom: 1px solid $lightGrayBorder;
        padding-top: 4px;
    }

    .notifications-view__tab {
        padding: 5px 16px;
        cursor: pointer;
        border: 1px solid $lightGrayBorder;
        border-bottom: none;
        border-radius: 4px 4px 0 0;
        background: $darkGray;
        color: #888;
        font-size: 14px;
        user-select: none;
        margin-right: 2px;

        &:hover:not(.notifications-view__tab--active) {
            background: darken($darkGray, 4%);
        }

        &--active {
            background: white;
            color: $fontColorMain;
            position: relative;
            z-index: 1;
            margin-bottom: -1px;
            border: 1px solid #9d9d9d;
            border-bottom: 1px solid white;
            clip-path: inset(-10px -10px 0px -10px);

            @include glass-gray-shadow();
        }
    }

    .notifications-view__tab__wrapper {
        flex: 1;
        display: flex;
        padding: 15px 5px 5px;
        clip-path: inset(-10px 0px 1px 1px);

        @include glass-gray-shadow();
    }

    .notifications-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .notifications-view__results {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 20px;
    }

    .notifications-view__list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }

    .notifications-view__item {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: $tableRowHeight;
        padding: 10px;
        background-color: white;
        border: 1px solid $midGray;
        border-radius: 5px;

        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1.00),
            inset 0 -1px 0 rgba(255, 255, 255, 0.40),
            inset 1px 0 0 rgba(255, 255, 255, 0.55),
            inset -1px 0 0 rgba(255, 255, 255, 0.55),
            0 1px 2px rgba(0, 0, 0, 0.20),
            0 1px 0 rgba(255, 255, 255, 0.60);

        p {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }

    .notifications-view__item__title {
        font-size: 14px;
        color: $fontColorMain;
    }

    .notifications-view__item__date {
        font-size: 13px;
        color: #888;
        flex-shrink: 0;
        margin-left: 16px;
    }

    .notifications-view__no-results {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;

        p {
            font-weight: bold;
        }
    }
</style>
