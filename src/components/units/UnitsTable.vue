<template>
    <div class="units-table">
        <UnitsTableRow
            v-for="unit in props.units"
            :key="unit.id"
            :unit="unit"
            @open-delete-popup="(unit) => emit('open-delete-popup', unit)"
        />
    </div>
</template>

<script setup lang="ts">
    import { Unit } from './units-models';

    import UnitsTableRow from './UnitsTableRow.vue';

    interface Props {
        units: Unit[] | undefined
    }

    const props = defineProps<Props>();

    const emit = defineEmits<{
        'open-delete-popup': [unit: Unit]
    }>();
</script>

<style lang="scss">
    .units-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        height: 600px;
    }
</style>
