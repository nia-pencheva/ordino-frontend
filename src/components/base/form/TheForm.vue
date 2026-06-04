<template>
    <TheWindow>
        <div class="the-form">
            <slot></slot>
        </div>
    </TheWindow>
</template>

<script setup lang="ts">
    import { onMounted, onUnmounted } from 'vue';

    import TheWindow from '../TheWindow.vue';

    let enterEventListener = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            emit("enter-pressed");
        }
    };

    const emit = defineEmits([ "enter-pressed" ]); 

    onMounted(() => {
        document.addEventListener('keydown', enterEventListener);
    });

    onUnmounted(() => {
        document.removeEventListener('keydown', enterEventListener);
    });
</script>

<style lang="scss">
    .the-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        width: 100%;
        margin: 20px 0px;
    }
</style>
