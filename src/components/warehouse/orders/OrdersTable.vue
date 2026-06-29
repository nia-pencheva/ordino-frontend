<template>
    <div class="orders-table">
        <OrdersTableRow
            v-for="order in orders"
            :key="order.id"
            :order="order"
        />
    </div>
</template>

<script setup lang="ts">
    import { OrderForPage } from './orders-models'

    import OrdersTableRow from './OrdersTableRow.vue'

    interface Props {
        orders: OrderForPage[] | undefined
    }

    const props = defineProps<Props>()
</script>

<style lang="scss">
    .orders-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }
</style>
