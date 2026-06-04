<template>
    <div class="the-searchbar">
        <i class="the-searchbar__icon"></i>
        <input
            v-model="model"
            type="text"
            :placeholder="placeholder ?? 'Search...'"
            autocomplete="off"
        />
    </div>
</template>

<script setup lang="ts">
    interface Props {
        placeholder?: string
    }

    const props = defineProps<Props>();

    const model = defineModel<string>();
</script>

<style lang="scss" scoped>
    .the-searchbar {
        position: relative;
        display: flex;
        align-items: center;
        max-width: 300px;
        width: 100%;
    }

    .the-searchbar__icon {
        position: absolute;
        left: 12px;
        top: 7px;
        width: 12px;
        height: 12px;
        border: 2px solid #888;
        border-radius: 50%;
        pointer-events: none;

        &::after {
            content: '';
            position: absolute;
            width: 2px;
            height: 6px;
            background: #888;
            bottom: -6px;
            right: 9px;
            transform: rotate(45deg);
            border-radius: 1px;
        }
    }

    input {
        width: 100%;
        border-radius: 3px;
        padding: 3px 8px 3px 30px;
        height: 30px;
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
    }
</style>
