<template>
    <div class="the-pager">
        <TheButton
            @click="emit('previous')"
            class="the-pager__button"
            :disabled="isFirst"
        >
            <i class="the-pager__arrow--previous"></i>
        </TheButton>
        <TheButton
            @click="emit('next')"
            class="the-pager__button"
            :disabled="isLast"
        >
            <i class="the-pager__arrow--next"></i>
        </TheButton>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue';

    import TheButton from './TheButton.vue';

    interface Props {
        currentPage: number,
        totalPages?: number,
    }

    const props = defineProps<Props>();

    const isFirst = computed<boolean>(() => props.currentPage === 1);
    const isLast = computed<boolean>(() => props.currentPage >= (props.totalPages ?? 1));

    const emit = defineEmits([ "next", "previous" ]);
</script>

<style lang="scss">
    .the-pager {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .the-pager__button {
        width: 24px;
        height: 24px;
        font-size: 18px;
    }

    .the-pager__arrow--previous {
        @include arrow-left(black, 2px);

        position: relative;
        bottom: 1px;
        left: 1px;
    }

    .the-pager__arrow--next {
        @include arrow-right(black, 2px);

        position: relative;
        bottom: 1px;
        right: 1px;
    }

    .the-button--disabled {
        .the-pager__arrow--previous,
        .the-pager__arrow--next {
            border-color: rgba(0, 0, 0, 0.25);
        }
    }
</style>
