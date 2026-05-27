<template>
    <a 
        @click="emit('click')"
        class="the-button"
    >
        <slot></slot>
    </a>
</template>

<script setup lang="ts">
    const emit = defineEmits([ "click" ])
</script>

<style lang="scss">
    .the-button {
        display: inline-block;
        border-radius: 3px;
        cursor: pointer;
        outline: none;
        text-align: center;

        border: 1px solid rgba(80, 80, 80, 0.55);

        background-image: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.90) 0%,
            rgba(225, 225, 225, 0.85) 45%,
            rgba(200, 200, 200, 0.90) 50%,
            rgba(215, 215, 215, 0.95) 100%
        );

        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1.00),
            inset 0 -1px 0 rgba(255, 255, 255, 0.40),
            inset 1px 0 0 rgba(255, 255, 255, 0.55),
            inset -1px 0 0 rgba(255, 255, 255, 0.55),
            0 1px 2px rgba(0, 0, 0, 0.20),
            0 1px 0 rgba(255, 255, 255, 0.60);

        transition: background-image 0.1s ease, box-shadow 0.1s ease;

        &:hover {
            border-color: rgba(60, 110, 190, 0.70);

            background-image: linear-gradient(
                180deg,
                rgba(220, 235, 255, 0.95) 0%,
                rgba(185, 215, 250, 0.90) 45%,
                rgba(160, 200, 245, 0.95) 50%,
                rgba(185, 215, 250, 1.00) 100%
            );

            box-shadow:
                inset 0 1px 0 rgba(255, 255, 255, 0.95),
                inset 0 -1px 0 rgba(255, 255, 255, 0.35),
                inset 1px 0 0 rgba(255, 255, 255, 0.50),
                inset -1px 0 0 rgba(255, 255, 255, 0.50),
                0 0 4px rgba(60, 120, 220, 0.35),
                0 1px 0 rgba(255, 255, 255, 0.60);
        }

        &:active {
            background-image: linear-gradient(
                180deg,
                rgba(190, 190, 190, 0.95) 0%,
                rgba(210, 210, 210, 0.90) 100%
            );

            box-shadow:
                inset 0 1px 3px rgba(0, 0, 0, 0.25),
                inset 0 1px 1px rgba(0, 0, 0, 0.15),
                0 1px 0 rgba(255, 255, 255, 0.60);
        }
    }
</style>