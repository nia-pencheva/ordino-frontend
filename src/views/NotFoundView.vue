<template>
    <TheLayout>
        <div class="not-found">
            <span class="not-found__code">404</span>
            <span class="not-found__message">Page not found</span>
            <TheButton class="not-found__button" @click="router.back()">Go back</TheButton>
        </div>
    </TheLayout>
</template>

<script setup lang="ts">
import TheLayout from '@/components/layout/TheLayout.vue';
import TheButton from '@/components/base/TheButton.vue';
import router from '@/router';
</script>

<style lang="scss">
    .not-found {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 6px;
    }

    .not-found__code {
        font-size: 72px;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.12);
        line-height: 1;
    }

    .not-found__message {
        font-size: 16px;
        color: rgba(0, 0, 0, 0.45);
    }

    .not-found__button {
        margin-top: 8px;
        padding: 4px 16px;
    }
</style>
