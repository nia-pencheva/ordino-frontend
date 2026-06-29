<template>
    <router-link 
        :to="props.link"
        class="nav-item"    
    >
        <div class="nav-item__icon__wrapper">
            <img 
                :class="[ ...iconStyles ?? '' ]" 
                :src="props.iconSrc"
            />
        </div>

        <span>
            <slot></slot>
        </span>
    </router-link>
</template>

<script setup lang="ts">
    interface Props {
        iconSrc: string,
        iconStyles?: string[],
        link: string,
    }

    const props = defineProps<Props>(); 
</script>

<style lang="scss">
    .nav-item {
        display: flex; 
        flex-direction: row; 
        align-items: center; 
        gap: 5px;
        width: 100%;
        background: linear-gradient(#fff, #dcdcdc);
        border-bottom: 1px solid #ccc;
        padding: 10px;
    }

    .nav-item__icon__wrapper {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
    }
</style>