<template>
    <TheLayout :content-styles="['edit-supplier-product-view']">
        <div v-if="supplierProduct === undefined" class="edit-supplier-product-view__loader">
            <TheSpinner size="lg" />
        </div>

        <template v-else>
            <TheTitle>Edit {{ supplierProduct.productName }}</TheTitle>

            <SupplierProductForm
                mode="edit"
                :initial-price="supplierProduct.price"
                :initial-min-order-quantity="supplierProduct.minOrderQuantity"
                :unit-abbreviation="supplierProduct.unitAbbreviation"
                :submitting="submitting"
                :validation-errors="validationErrors"
                @submit="handleSubmit"
                @cancel="router.push({ name: 'supplier-product-info', params: { supplierId: route.params.supplierId, supplierProductId: route.params.supplierProductId } })"
            />
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { APICall } from '@/service/api/api'
    import { UnprocessableContentError } from '@/service/api/models/response-errors'

    import TheLayout from '@/components/layout/TheLayout.vue'
    import TheTitle from '@/components/layout/TheTitle.vue'
    import TheSpinner from '@/components/base/TheSpinner.vue'
    import SupplierProductForm from '@/components/warehouse/suppliers/SupplierProductForm.vue'

    import { SupplierProduct } from '@/components/warehouse/suppliers/suppliers-models'

    const route = useRoute()
    const router = useRouter()

    const supplierProduct = ref<SupplierProduct | undefined>(undefined)
    const submitting = ref<boolean>(false)
    const validationErrors = ref<UnprocessableContentError | undefined>(undefined)

    async function handleSubmit({ price, minOrderQuantity }: { price: number | undefined; minOrderQuantity: number | undefined }) {
        submitting.value = true
        validationErrors.value = undefined

        try {
            await new APICall(`suppliers/${route.params.supplierId}/products/${route.params.supplierProductId}`, 'POST', {
                price,
                minOrderQuantity
            }).execute()

            router.replace({ name: 'supplier-product-info', params: { supplierId: route.params.supplierId, supplierProductId: route.params.supplierProductId } })
        } catch (error: any) {
            if (error instanceof UnprocessableContentError) {
                validationErrors.value = error
            }
        } finally {
            submitting.value = false
        }
    }

    onMounted(async () => {
        supplierProduct.value = await new APICall<SupplierProduct>(
            `suppliers/${route.params.supplierId}/products/${route.params.supplierProductId}`
        ).execute()
    })
</script>

<style lang="scss">
    .edit-supplier-product-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .edit-supplier-product-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
