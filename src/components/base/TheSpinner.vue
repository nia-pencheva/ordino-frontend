<template>
    <div class="the-spinner" :class="`the-spinner--${size}`">
        <div class="the-spinner__ring"></div>
    </div>
</template>

<script setup lang="ts">
    withDefaults(defineProps<{
        size?: 'xs' | 'sm' | 'md' | 'lg'
    }>(), {
        size: 'md'
    })
</script>

<style lang="scss">
    @keyframes spinner-rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .the-spinner {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;

        &::before,
        &::after {
            content: '';
            position: absolute;
            border-radius: 50%;
            border: 1px solid rgba(255, 255, 255, 0.6);
            outline: 1px solid rgba(0, 80, 160, 0.45);
            pointer-events: none;
        }

        &::before { inset: 0; }
        &::after  { inset: 15%; }

        &--xs .the-spinner__ring {
            width: 15px;
            height: 15px;
        }

        &--sm .the-spinner__ring {
            width: 24px;
            height: 24px;
        }

        &--md .the-spinner__ring {
            width: 40px;
            height: 40px;
        }

        &--lg .the-spinner__ring {
            width: 64px;
            height: 64px;
        }

        &__ring {
            border-radius: 50%;
            position: relative;
            animation: spinner-rotate 1.2s linear infinite;

            background: radial-gradient(
                circle at 35% 30%,
                rgb(220, 235, 250) 0%,
                rgb(180, 210, 240) 28%,
                rgb(140, 185, 230) 62%,
                rgb(100, 155, 210) 100%
            );

            mask: radial-gradient(farthest-side, transparent 70%, black 71%);
            -webkit-mask: radial-gradient(farthest-side, transparent 70%, black 71%);

            filter: drop-shadow(0 0 5px rgba(77, 200, 194, 0.6));

            &::before {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: 50%;
                background: radial-gradient(
                    ellipse at 32% 26%,
                    rgba(255, 255, 255, 0.55) 0%,
                    rgba(255, 255, 255, 0.18) 35%,
                    transparent 55%
                );
            }
        }
    }
</style>
