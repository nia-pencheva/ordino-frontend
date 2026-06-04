<template>
    <div class="units-table__row">
        <div class="units-table__row__name__wrapper">
            <span class="units-table__row__name">{{ props.unit.unit }}</span>
            <span class="units-table__row__abbreviation">({{ props.unit.abbreviation }})</span>
        </div>

        <div class="units-table__row__buttons">
            <TheButton
                class="units-table__row__button"
                @click="router.push('/units/' + props.unit.id)"
            >
                Edit
            </TheButton>

            <TheButton
                class="units-table__row__button"
                type="important"
                :disabled="props.unit.deleteForbiddenReasons.length > 0"
                :tooltip="props.unit.deleteForbiddenReasons"
                @click="emit('open-delete-popup', props.unit)"
            >
                Delete
            </TheButton>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useRouter } from 'vue-router';

    import TheButton from '../base/TheButton.vue';

    import { Unit } from './units-models';

    const router = useRouter();

    interface Props {
        unit: Unit
    }

    const props = defineProps<Props>();

    const emit = defineEmits<{
        'open-delete-popup': [unit: Unit]
    }>();
</script>

<style lang="scss">
    .units-table__row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-radius: 5px;
        background-color: white;

        border: 1px solid $midGray;
        background: linear-gradient(#fff, #dcdcdc);
        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1.00),
            inset 0 -1px 0 rgba(255, 255, 255, 0.40),
            inset 1px 0 0 rgba(255, 255, 255, 0.55),
            inset -1px 0 0 rgba(255, 255, 255, 0.55),
            0 1px 2px rgba(0, 0, 0, 0.20),
            0 1px 0 rgba(255, 255, 255, 0.60);
    }

    .units-table__row__name__wrapper {
        min-width: 0;
        flex: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
        font-size: 14px;
    }

    .units-table__row__name {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .units-table__row__abbreviation {
        color: #999;
        font-size: 13px;
    }

    .units-table__row__buttons {
        display: flex;
        flex-direction: row;
        gap: 5px;
    }

    .units-table__row__button {
        width: 60px;
        padding: 4px;
    }
</style>
