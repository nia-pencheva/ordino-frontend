<template>
    <div class="the-window__border">
        <div class="the-window__content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss">
    .the-window__border {
        @include glass-texture;
        @include glass-gray-shadow;

        padding: 10px;
        border-radius: 5px;
    }

    .the-window__content {
        background-color: $lightGray;
        padding: 25px;
    }
</style>
