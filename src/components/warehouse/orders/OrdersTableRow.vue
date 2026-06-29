<template>
    <div
        class="orders-table__row"
        @click="router.push({ name: 'order-info', params: { id: props.order.id } })"
    >
        <span class="orders-table__row__id">#{{ props.order.id }}</span>
        <span class="orders-table__row__date">{{ formatDate(props.order.createdAt) }}</span>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router'

    import { OrderForPage } from './orders-models'

    interface Props {
        order: OrderForPage
    }

    const props = defineProps<Props>()

    const router = useRouter()

    function formatDate(isoString: string): string {
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(isoString))
    }
</script>

<style lang="scss">
    .orders-table__row {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: $tableRowHeight;
        padding: 10px;
        background-color: white;
        border: 1px solid $midGray;
        border-radius: 5px;

        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1.00),
            inset 0 -1px 0 rgba(255, 255, 255, 0.40),
            inset 1px 0 0 rgba(255, 255, 255, 0.55),
            inset -1px 0 0 rgba(255, 255, 255, 0.55),
            0 1px 2px rgba(0, 0, 0, 0.20),
            0 1px 0 rgba(255, 255, 255, 0.60);
    }

    .orders-table__row__date {
        color: rgba(0, 0, 0, 0.55);
        font-size: 13px;
    }
</style>
