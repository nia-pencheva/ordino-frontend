<template>
    <label :class="['the-checkbox', { 'the-checkbox--checked': model?.includes(value), 'the-checkbox--disabled': disabled }]">
        <input
            type="checkbox"
            class="the-checkbox__input"
            v-model="model"
            :value="value"
            :disabled="disabled"
        />
        <span class="the-checkbox__box">
            <svg v-if="model?.includes(value)" class="the-checkbox__check" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                <polyline points="1.5,5 4,7.5 8.5,2" />
            </svg>
        </span>
        <span v-if="$slots.default" class="the-checkbox__label">
            <slot></slot>
        </span>
    </label>
</template>

<script setup lang="ts">
    interface Props {
        value: string 
        disabled?: boolean
    }

    const props = defineProps<Props>();
    const model = defineModel<string[]>();
</script>

<style lang="scss">
    .the-checkbox {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        user-select: none;
        padding: 1px 3px;
        border-radius: 2px;

        &:hover .the-checkbox__box {
            border-color: rgba(60, 110, 190, 0.80);

            background-image: linear-gradient(
                180deg,
                rgba(220, 235, 255, 0.95) 0%,
                rgba(185, 215, 250, 0.90) 100%
            );

            box-shadow:
                inset 0 1px 0 rgba(255, 255, 255, 0.90),
                0 0 3px rgba(60, 120, 220, 0.30);
        }

        &--checked .the-checkbox__box {
            border-color: rgba(60, 90, 160, 0.75);
        }

        &--disabled {
            cursor: default;
            opacity: 0.55;
        }
    }

    .the-checkbox__input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
        pointer-events: none;

        &:focus-visible + .the-checkbox__box {
            outline: 1px dotted #000;
            outline-offset: 2px;
        }
    }

    .the-checkbox__box {
        flex-shrink: 0;
        width: 13px;
        height: 13px;
        border-radius: 2px;
        border: 1px solid rgba(80, 80, 80, 0.60);

        background-image: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(225, 225, 225, 0.90) 100%
        );

        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.90),
            inset 1px 0 0 rgba(255, 255, 255, 0.55),
            inset -1px 0 0 rgba(255, 255, 255, 0.55),
            0 1px 2px rgba(0, 0, 0, 0.15);

        display: flex;
        align-items: center;
        justify-content: center;

        transition: border-color 0.1s ease, background-image 0.1s ease, box-shadow 0.1s ease;
    }

    .the-checkbox__check {
        width: 9px;
        height: 9px;
        fill: none;
        stroke: #1a4a9e;
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .the-checkbox__label {
        font-size: 12px;
        line-height: 1;

        @include desktop {
            font-size: 14px;
        }
    }
</style>
