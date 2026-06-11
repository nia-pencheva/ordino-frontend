<template>
    <div
        :class="[
            `recipe-ingredient-categories-item`,
            `recipe-ingredient-categories-item--level-${level}`,
            { 'recipe-ingredient-categories-item--selected': isSelected }
        ]"
        @click="toggle"
    >
        <span class="recipe-ingredient-categories-item__name">{{ category.category }}</span>
        <i
            v-if="hasSubCategories"
            :class="['recipe-ingredient-categories-item__arrow', { 'recipe-ingredient-categories-item__arrow--open': isOpen }]"
        ></i>
    </div>

    <template v-if="hasSubCategories && isOpen">
        <RecipeIngredientCategoryItem
            v-for="subCategory in category.subCategories"
            :key="subCategory.id"
            :category="subCategory"
            :level="level + 1"
        />
    </template>
</template>

<script setup lang="ts">
    import { ref, computed, watch, inject, provide } from 'vue';
    import type { Ref } from 'vue';
    import { useRoute } from 'vue-router';
    import router from '@/router';

    import type { RecipeIngredientCategory } from './recipe-ingredient-categories-models';

    interface Props {
        category: RecipeIngredientCategory
        level: number
    }

    const props = defineProps<Props>();

    const route = useRoute();

    const openSiblingId = inject<Ref<number | null>>('recipe-ingredient-open-child', ref(null));

    const openChildId = ref<number | null>(null);

    const hasSubCategories = computed(() => !!props.category.subCategories?.length && props.level < 4);

    const isOpen = computed(() => openSiblingId.value === props.category.id);

    const selectedId = computed(() => Number(route.params.id));

    const isSelected = computed(() => props.category.id === selectedId.value);

    const isAncestorOfSelected = computed(() =>
        !!props.category.subCategories?.some(sub => containsId(sub, selectedId.value))
    );

    watch(isAncestorOfSelected, (val) => {
        if (val) openSiblingId.value = props.category.id;
    }, { immediate: true });

    function containsId(cat: RecipeIngredientCategory, id: number): boolean {
        if (cat.id === id) return true;
        return cat.subCategories?.some(sub => containsId(sub, id)) ?? false;
    }

    function toggle() {
        if (hasSubCategories.value) openSiblingId.value = isOpen.value ? null : props.category.id;
        router.push({ name: "recipe-ingredient-category-detail", params: { id: props.category.id } });
    }

    
    provide('recipe-ingredient-open-child', openChildId);
</script>

<style lang="scss">
    .recipe-ingredient-categories-item {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 37px;
        width: 100%;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        cursor: pointer;
        user-select: none;
        color: black;

        &--level-1 {
            background: linear-gradient(#fff, #dcdcdc);
            padding: 10px 10px 10px 10px;

            &.recipe-ingredient-categories-item--selected {
                background: linear-gradient(#ebf4ff, #aec2dd);
            }
        }

        &--level-2 {
            background-color: white;
            padding: 10px 10px 10px 22px;

            &.recipe-ingredient-categories-item--selected {
                background-color: #ebf4ff;
            }
        }

        &--level-3 {
            background-color: darken(white, 14%);
            padding: 10px 10px 10px 34px;

            &.recipe-ingredient-categories-item--selected {
                background-color: #c2d8f4;
            }
        }

        &--level-4 {
            background-color: darken(white, 28%);
            padding: 10px 10px 10px 46px;

            &.recipe-ingredient-categories-item--selected {
                background-color: #a4c2e8;
            }
        }

        &--selected {
            font-weight: bold;
        }
    }

    .recipe-ingredient-categories-item__name {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .recipe-ingredient-categories-item__arrow {
        @include arrow(black, 2px);

        position: relative;
        transform: rotate(45deg);
        margin-left: auto;
        flex-shrink: 0;
        top: -1px;

        &--open {
            transform: rotate(-135deg);
            top: 1px;
        }
    }
</style>
