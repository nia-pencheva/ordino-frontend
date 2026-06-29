<template>
    <TheLayout :content-styles="['add-supplier-product-view']">
        <TheTitle>Add {{ route.query.productName }} to catalog</TheTitle>

        <SupplierProductForm
            :unit-abbreviation="(route.query.unitAbbreviation as string) || undefined"
            :submitting="submitting"
            :validation-errors="validationErrors"
            @submit="handleSubmit"
            @cancel="router.push({ name: 'supplier-info', params: { supplierId: route.params.id } })"
        />
    </TheLayout>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { APICall } from '@/service/api/api'
    import { UnprocessableContentError } from '@/service/api/models/response-errors'

    import TheLayout from '@/components/layout/TheLayout.vue'
    import TheTitle from '@/components/layout/TheTitle.vue'
    import SupplierProductForm from '@/components/warehouse/suppliers/SupplierProductForm.vue'

    const route = useRoute()
    const router = useRouter()

    const submitting = ref<boolean>(false)
    const validationErrors = ref<UnprocessableContentError | undefined>(undefined)

    async function handleSubmit({ price, minOrderQuantity }: { price: number | undefined; minOrderQuantity: number | undefined }) {
        submitting.value = true
        validationErrors.value = undefined

        try {
            await new APICall(`suppliers/${route.params.id}/products`, 'POST', {
                warehouseProductId: Number(route.query.warehouseProductId),
                price,
                minOrderQuantity
            }).execute()

            router.replace({ name: 'supplier-info', params: { id: route.params.id } })
        } catch (error: any) {
            if (error instanceof UnprocessableContentError) {
                validationErrors.value = error
            }
        } finally {
            submitting.value = false
        }
    }
</script>

<style lang="scss">
    .add-supplier-product-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>
