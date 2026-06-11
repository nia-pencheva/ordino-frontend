<template>
    <TheLayout :content-styles="[ 'move-warehouse-product-category-view' ]">
        <div
            v-if="categoryOptions == undefined"
            class="move-warehouse-product-category-view__loader"
        >
            <TheSpinner size="lg" />
        </div>
        <template v-else>
            <TheTitle>
                Move category {{ categoryToMove?.category }} to:
            </TheTitle>

            <br>

            <TheForm class="move-warehouse-product-category-form">
                <FormElement id="category">
                    <TheSelect
                        v-model="newParentId"
                        :options="categoryOptions"
                        :root-parent="rootParentOption"
                        placeholder="Select category to move to..."
                    ></TheSelect>
                </FormElement>

                <br>

                <div class="move-warehouse-product-category-form__buttons__wrapper">
                    <TheButton
                        @click="handleSubmit()"
                        class="move-warehouse-product-category-form__button"
                        :disabled="submitting"
                    >
                        Move
                        <TheSpinner v-if="submitting" size="xs" class="move-warehouse-product-category-form__spinner" />
                    </TheButton>
                    <TheButton
                        @click="router.back()"
                        class="move-warehouse-product-category-form__button"
                        type="important"
                    >
                        Cancel
                    </TheButton>
                </div>
            </TheForm>
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
    import { WarehouseProductCategory } from '@/components/warehouse/product_categories/warehouse-product-categories-models';
    import { fetchWarehouseProductCategories, findCategoryById, findParentById } from '@/components/warehouse/product_categories/warehouse-product-categories-utils';
    import { computed, onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { SelectOption } from '@/components/base/TheSelect.vue';
    import router from '@/router';
    import { APICall } from '@/service/api/api';

    import TheSelect from '@/components/base/TheSelect.vue';
    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import TheForm from '@/components/base/form/TheForm.vue';
    import FormElement from '@/components/base/form/FormElement.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';
    import TheButton from '@/components/base/TheButton.vue';

    const route = useRoute();

    const categoryToMove = ref<WarehouseProductCategory | undefined>(undefined);
    const categoryOptions = ref<SelectOption[] | undefined>(undefined);
    const newParentId = ref<number | null>(null);

    const rootParentOption = computed<SelectOption | undefined>(() =>
        categoryOptions.value ? { value: categoryOptions.value[0].value, label: categoryOptions.value[0].label } : undefined
    );

    const submitting = ref<boolean>(false);

    function toOptions(items: WarehouseProductCategory[]): SelectOption[] {
        return [{ value: -1, label: 'Product categories', children: toFlatOptions(items) }];
    }

    function toFlatOptions(items: WarehouseProductCategory[]): SelectOption[] {
        return items
            .filter(c => !(c.id == parseInt(route.params.id as string)))
            .filter(c => !(c.products?.length && !c.subCategories?.length))
            .map(c => {
                const children = c.subCategories?.length ? toFlatOptions(c.subCategories) : [];
                return {
                    value: c.id,
                    label: c.category,
                    ...(children.length ? { children } : {})
                };
            });
    }

    async function handleSubmit() {
        submitting.value = true;

        let newParentIdValue = (newParentId.value == -1) ? null : newParentId.value;

        await (new APICall(`warehouse-product-categories/${route.params.id}/move`, "POST", { parentId: newParentIdValue })).execute();
        router.replace({ name: 'warehouse-product-categories' });

        submitting.value = false;
    }

    onMounted(async () => {
        const categories = await fetchWarehouseProductCategories();

        const id = parseInt(route.params.id as string);
        categoryOptions.value = toOptions(categories);
        categoryToMove.value = findCategoryById(categories, id);
        newParentId.value = findParentById(categories, id)?.id ?? null;
    });
</script>

<style lang="scss">
    .move-warehouse-product-category-view {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .move-warehouse-product-category-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .move-warehouse-product-category-form {
        max-width: 350px;
        width: 100%;
    }

    .move-warehouse-product-category-form__buttons__wrapper {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .move-warehouse-product-category-form__button {
        width: 75px;
        padding: 4px;
        position: relative;
        overflow: hidden;
    }

    .move-warehouse-product-category-form__button-label--hidden {
        visibility: hidden;
    }

    .move-warehouse-product-category-form__spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
