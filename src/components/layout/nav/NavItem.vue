<template>
    <router-link 
        :to="props.link"
        class="nav-item"    
    >
        <img 
            :class="[ ...iconStyles ?? '' ]" 
            :src="props.iconSrc"
        />
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
</style>