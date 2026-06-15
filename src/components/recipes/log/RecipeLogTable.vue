<template>
    <div class="recipe-log-view__table">
        <template v-for="group in logs" :key="group.key">
            <div class="recipe-log-view__day-header">{{ group.date }}</div>
            <RecipeLogTableRow 
                v-for="entry in group.entries"
                :key="entry.id"
                :entry="entry"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
    import { RecipeLogPageEntry } from './recipe-log-models';
    import RecipeLogTableRow from './RecipeLogTableRow.vue';

    interface Props {
        logs: { key: string, date: string, entries: RecipeLogPageEntry[] }[]
    }

    const props = defineProps<Props>()
</script>

<style lang="scss">
    .recipe-log-view__table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }

    .recipe-log-view__day-header {
        padding: 14px 0 0px;
    }
</style>
