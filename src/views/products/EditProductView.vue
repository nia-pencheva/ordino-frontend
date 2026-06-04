<template>
    <TheLayout :content-styles="['edit-product-view']">
        <TheTitle>Edit product</TheTitle>

        <br>

        <div class="edit-product-view__loader" v-if="!loaded">
            <TheSpinner size="lg" />
        </div>
        <ProductForm
            v-else
            :product="product"
        />
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { Product } from '@/components/products/products-models';
    import { useRoute } from 'vue-router';
    import { APICall } from '@/service/api/api';

    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import ProductForm from '@/components/products/ProductForm.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';

    const route = useRoute();

    const product = ref<Product | undefined>(undefined);

    const loaded = computed<boolean>(() => {
        return product.value !== undefined;
    });

    async function fetchProduct() {
        product.value = await (new APICall<Product>('products/' + route.params.id)).execute();
    }

    onMounted(async () => {
        await fetchProduct();
    });
</script>

<style lang="scss">
    .edit-product-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .edit-product-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
