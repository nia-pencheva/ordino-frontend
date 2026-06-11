<template>
    <div class="nav-item-expandable">
        <button class="nav-item nav-item-expandable__trigger" @click="toggle">
            <img :class="[ ...iconStyles ?? '' ]" :src="iconSrc" />
            <span><slot></slot></span>
            <i :class="['nav-item-expandable__arrow', { 'nav-item-expandable__arrow--open': isOpen }]"></i>
        </button>
        <div v-show="isOpen" class="nav-item-expandable__submenu">
            <slot name="submenu"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    interface Props {
        iconSrc: string
        iconStyles?: string[]
    }

    const props = defineProps<Props>();

    const isOpen = ref<boolean>(false);

    function toggle() {
        isOpen.value = !isOpen.value;
    }
</script>

<style lang="scss">
    .nav-item-expandable {
        width: 100%;
    }

    .nav-item-expandable__trigger {
        border: none;
        cursor: pointer;
        font-size: inherit;
        font-family: inherit;
        text-align: left;
    }

    .nav-item-expandable__arrow {
        @include arrow(black, 2px);
        position: relative;
        top: -2px;
        transform: rotate(45deg);
        margin-left: auto;
        flex-shrink: 0;
    }

    .nav-item-expandable__arrow--open {
        transform: rotate(-135deg);
        top: 2px;
    }
</style>
