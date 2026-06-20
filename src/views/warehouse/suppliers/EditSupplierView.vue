<template>
    <TheLayout :content-styles="['edit-supplier-view']">
        <TheTitle>Edit supplier</TheTitle>

        <br />

        <div class="edit-supplier-view__loader" v-if="!loaded">
            <TheSpinner size="lg" />
        </div>

        <SupplierForm
            v-else
            :supplier="supplier"
        />
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue'
    import { useRoute } from 'vue-router'

    import { APICall } from '@/service/api/api'
    import { Supplier } from '@/components/warehouse/suppliers/suppliers-models'

    import TheLayout from '@/components/layout/TheLayout.vue'
    import TheTitle from '@/components/layout/TheTitle.vue'
    import TheSpinner from '@/components/base/TheSpinner.vue'
    import SupplierForm from '@/components/warehouse/suppliers/SupplierForm.vue'

    const route = useRoute()

    const supplier = ref<Supplier | undefined>(undefined)

    const loaded = computed<boolean>(() => supplier.value !== undefined)

    async function fetchSupplier() {
        supplier.value = await new APICall<Supplier>(`suppliers/${route.params.id}`).execute()
    }

    onMounted(fetchSupplier)
</script>

<style lang="scss">
    .edit-supplier-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .edit-supplier-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
