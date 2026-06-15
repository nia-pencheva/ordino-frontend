<template>
    <input
        v-model.number="model"
        type="number"
        :placeholder="props.placeholder ?? ''"
        :min="props.min"
        :max="props.max"
        autocomplete="off"
        :class="{ 'number-input--invalid': props.invalid }"
    />
</template>

<script setup lang="ts">
    interface Props {
        placeholder?: string
        min?: number
        max?: number
        invalid?: boolean
    }

    const props = defineProps<Props>()
    const model = defineModel<number | null>()
</script>

<style lang="scss" scoped>
    input {
        border-radius: 3px;
        padding: 3px 8px;
        height: 30px;
        width: 100%;
        border: 1px solid rgba(100, 130, 170, 0.55);
        background-color: #fff;
        color: #1a1a1a;
        outline: none;

        box-shadow:
            inset 0 1px 3px rgba(0, 0, 0, 0.20),
            inset 0 1px 1px rgba(0, 0, 0, 0.12),
            inset 1px 0 2px rgba(0, 0, 0, 0.06),
            0 1px 0 rgba(255, 255, 255, 0.80);

        transition: border-color 0.15s ease, box-shadow 0.15s ease;

        &:hover {
            border-color: rgba(80, 120, 180, 0.75);
        }

        &:focus {
            border-color: rgba(60, 120, 210, 0.90);

            box-shadow:
                inset 0 1px 3px rgba(0, 0, 0, 0.18),
                inset 0 1px 1px rgba(0, 0, 0, 0.10),
                0 0 0 2px rgba(80, 150, 230, 0.28),
                0 0 5px rgba(60, 130, 220, 0.20),
                0 1px 0 rgba(255, 255, 255, 0.80);
        }

        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
            opacity: 1;
        }

        &.number-input--invalid {
            border: 2px solid $fontColorError;
            box-shadow:
                inset 0 1px 3px rgba(0, 0, 0, 0.20),
                inset 0 1px 1px rgba(0, 0, 0, 0.12),
                inset 1px 0 2px rgba(0, 0, 0, 0.06),
                0 1px 0 rgba(255, 255, 255, 0.80);
        }
    }
</style>
