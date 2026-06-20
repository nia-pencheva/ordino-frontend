<template>
    <div class="suppliers-table__row__wrapper">
        <div
            class="suppliers-table__row"
            @click="router.push(`/warehouse/suppliers/${props.supplier.id}`)"
        >
            <p>{{ props.supplier.name }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router'

    import { SupplierForPage } from './suppliers-models'

    const router = useRouter()

    interface Props {
        supplier: SupplierForPage
    }

    const props = defineProps<Props>()
</script>

<style lang="scss">
    .suppliers-table__row {
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

        p {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }
</style>
