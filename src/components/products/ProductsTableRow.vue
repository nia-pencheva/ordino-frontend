<template>
    <div class="products-table__row__wrapper">
        <div class="products-table__row"
            @click="toggleDetails"
            :class="[ detailsOpen ? 'products-table__row--details-open' : 'products-table__row--details-closed' ]"
        >
            <div>
                {{ props.product.name }}
            </div>

            <div>
                <TheButton class="products-table__toggle-details">
                    <i :class="[ detailsOpen ? 'products-table__toggle-details__icon--close' : 'products-table__toggle-details__icon--open' ]"></i>
                </TheButton>
            </div>
        </div>

        <div
            v-if="detailsOpen"
            class="products-table__row__details__wrapper"
        >
            <div class="products-table__row__details">
                <p>
                    <b>Notes</b>:
                    {{ props.product.notes ?? '—' }}
                </p>
            </div>

            <div class="products-table__row__details__buttons">
                <TheButton
                    class="products-table__row__details__button"
                    @click="router.push('/products/' + props.product.id)"
                >
                    Edit
                </TheButton>

                <TheButton
                    v-if="props.product.active"
                    class="products-table__row__details__button"
                    :disabled="props.product.deactivateForbiddenReasons.length > 0"
                    :tooltip="props.product.deactivateForbiddenReasons"
                    @click="emit('open-deactivate-popup', props.product)"
                >
                    Deactivate
                </TheButton>

                <TheButton
                    v-else
                    class="products-table__row__details__button"
                    @click="activateProduct"
                >
                    Activate
                </TheButton>

                <TheButton
                    class="products-table__row__details__button"
                    type="important"
                    :disabled="props.product.deleteForbiddenReasons.length > 0"
                    :tooltip="props.product.deleteForbiddenReasons"
                    @click="emit('open-delete-popup', props.product)"
                >
                    Delete
                </TheButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { Product } from './products-models';
    import { useRouter } from 'vue-router';
    import { APICall } from '@/service/api/api';

    import TheButton from '../base/TheButton.vue';

    const router = useRouter();

    interface Props {
        product: Product
    }

    const props = defineProps<Props>();

    const emit = defineEmits<{
        'open-deactivate-popup': [product: Product]
        'open-delete-popup': [product: Product]
        'activated-product': []
    }>();

    const detailsOpen = ref<boolean>(false);

    function toggleDetails() {
        detailsOpen.value = !detailsOpen.value;
    }

    async function activateProduct() {
        await (new APICall(`products/${props.product.id}/activate`, 'POST')).execute();
        emit('activated-product');
    }
</script>

<style lang="scss">
    .products-table__row__wrapper {
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

    .products-table__row {
        padding: 10px;
        border-bottom: 1px solid $lightGrayBorder;
        background: linear-gradient(#fff, #dcdcdc);
    }

    [class*="products-table__row--"] {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color: white;
        border-radius: 5px;
    }

    .products-table__row--details-open {
        border-radius: 5px 5px 0px 0px;
    }

    .products-table__row--details-closed {
        border-radius: 5px;
    }

    .products-table__toggle-details {
        right: 5px;
        top: 10px;
        width: 25px;
        height: 25px;
        font-size: 18px;
    }

    .products-table__toggle-details__icon--open {
        @include arrow-down(black, 2px);

        position: relative;
        bottom: 2px;
        right: 0px;
    }

    .products-table__toggle-details__icon--close {
        @include arrow-up(black, 2px);

        position: relative;
        top: 1px;
        left: 0px;
    }

    .products-table__row__details__wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
        padding: 20px;
        border-radius: 0px 0px 5px 5px;
        background-color: white;
    }

    .products-table__row__details {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .products-table__row__details__buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        flex-wrap: wrap;
    }

    .products-table__row__details__button {
        width: 75px;
        padding: 4px;
    }
</style>
