<template>
    <router-link :to="link" class="nav-sub-item">
        <slot></slot>
    </router-link>
</template>

<script setup lang="ts">
    interface Props {
        link: string
    }

    const props = defineProps<Props>();
</script>

<style lang="scss">
    .nav-sub-item {
        display: flex;
        align-items: center;
        width: 100%;
        background-color: $midGray;
        border-bottom: 1px solid $lightGrayBorder;
        padding: 8px 10px 8px 24px;
        font-size: 0.875em;
        color: black;
        text-decoration: none;

        &:hover {
            background-color: darken($midGray, 6%);
        }
    }
</style>
