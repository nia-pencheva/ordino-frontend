<template>
    <div class="the-nav__horizontal-strip">
        <div class="the-nav__horizontal-strip__right">
            <RouterLink 
                :to="{ name: 'current-user' }"
                class="the-nav__horizontal-strip__current-user-link"
            >
                {{ auth.user?.name }}
            </RouterLink>
            <RouterLink
                :to="{ name: 'notifications' }"
                class="the-nav__notifications-link"
            >
                <img
                    :src="notifications.hasUnread ? '/images/icons/notifications-unread.png' : '/images/icons/notifications.png'"
                    class="the-nav__notifications-icon"
                />
            </RouterLink>
            <TheButton
                @click="emit('logging-out')"
                class="the-nav__logout-button"
            >
                Logout
            </TheButton>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, onUnmounted } from 'vue';

    import TheButton from '../../base/TheButton.vue';

    import { useAuth } from '@/store/auth/auth';
    import { useNotifications } from '@/store/notifications/notifications';

    const auth = useAuth();
    const notifications = useNotifications();

    const emit = defineEmits([ "logging-out" ]);

    onMounted(() => {
        notifications.fetchUnreadStatus()
    });
</script>

<style lang="scss">
    .the-nav__horizontal-strip {
        @include glass-texture;
        @include glass-gray-shadow;
        
        z-index: 900;
        position: fixed;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        padding: 10px 10px 10px 45px;
        background-color: $lightGray;
    }

    .the-nav__horizontal-strip__right {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
    }

    .the-nav__horizontal-strip__current-user-link {
        color: $fontColorMain;
        opacity: 0.55;

        &:hover {
            opacity: 1;
        }
    }

    .the-nav__notifications-link {
        display: flex;
        align-items: center;
        justify-content: center;

        opacity: 0.55;

        &:hover {
            opacity: 1;
        }
    }

    .the-nav__notifications-icon {
        width: 15px;
        height: 15px;
    }

    .the-nav__logout-button {
        width: 75px;
        padding: 4px;
    }
</style>
