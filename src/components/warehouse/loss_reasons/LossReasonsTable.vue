<template>
    <div class="loss-reasons-table">
        <LossReasonsTableRow
            v-for="lossReason in lossReasons"
            :key="lossReason.id"
            :lossReason="lossReason"
            @delete="emit('delete', $event)"
        />
    </div>
</template>

<script setup lang="ts">
    import { LossReason } from './loss-reasons-models';
    import LossReasonsTableRow from './LossReasonsTableRow.vue';

    interface Props {
        lossReasons: LossReason[] | undefined
    }

    const props = defineProps<Props>();
    const emit = defineEmits<{
        delete: [lossReason: LossReason]
    }>();
</script>

<style lang="scss">
    .loss-reasons-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        min-height: $tableMinHeight;
    }
</style>
