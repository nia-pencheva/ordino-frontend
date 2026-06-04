<template>
    <a
        @click="!props.disabled && emit('click')"
        :class="[
            'the-button', props.type ? `the-button--${props.type}` : '', 
            { 'the-button--disabled': props.disabled },
            { 'the-button--with-tooltip': props.tooltip?.length }
        ]"
    >
        <slot></slot>
        <div v-if="props.tooltip?.length" class="the-button__tooltip">
            <div v-for="reason in props.tooltip" :key="reason" class="the-button__tooltip-reason">
                {{ reason }}
            </div>
        </div>
    </a>
</template>

<script setup lang="ts">
    interface Props {
        type?: 'important'
        disabled?: boolean
        tooltip?: string[]
    }

    const props = defineProps<Props>();
    const emit = defineEmits([ "click" ]);
</script>

<style lang="scss">
    .the-button {
        display: inline-block;
        border-radius: 3px;
        cursor: pointer;
        outline: none;
        text-align: center;

        border: 1px solid rgba(80, 80, 80, 0.55);

        background-image: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.90) 0%,
            rgba(225, 225, 225, 0.85) 45%,
            rgba(200, 200, 200, 0.90) 50%,
            rgba(215, 215, 215, 0.95) 100%
        );

        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1.00),
            inset 0 -1px 0 rgba(255, 255, 255, 0.40),
            inset 1px 0 0 rgba(255, 255, 255, 0.55),
            inset -1px 0 0 rgba(255, 255, 255, 0.55),
            0 1px 2px rgba(0, 0, 0, 0.20),
            0 1px 0 rgba(255, 255, 255, 0.60);

        transition: background-image 0.1s ease, box-shadow 0.1s ease;

        &:hover {
            border-color: rgba(60, 110, 190, 0.70);

            background-image: linear-gradient(
                180deg,
                rgba(220, 235, 255, 0.95) 0%,
                rgba(185, 215, 250, 0.90) 45%,
                rgba(160, 200, 245, 0.95) 50%,
                rgba(185, 215, 250, 1.00) 100%
            );

            box-shadow:
                inset 0 1px 0 rgba(255, 255, 255, 0.95),
                inset 0 -1px 0 rgba(255, 255, 255, 0.35),
                inset 1px 0 0 rgba(255, 255, 255, 0.50),
                inset -1px 0 0 rgba(255, 255, 255, 0.50),
                0 0 4px rgba(60, 120, 220, 0.35),
                0 1px 0 rgba(255, 255, 255, 0.60);
        }

        &:active {
            background-image: linear-gradient(
                180deg,
                rgba(190, 190, 190, 0.95) 0%,
                rgba(210, 210, 210, 0.90) 100%
            );

            box-shadow:
                inset 0 1px 3px rgba(0, 0, 0, 0.25),
                inset 0 1px 1px rgba(0, 0, 0, 0.15),
                0 1px 0 rgba(255, 255, 255, 0.60);
        }

        &:hover .the-button__tooltip {
            display: block;
        }
    }

    .the-button__tooltip {
        display: none;
        position: absolute;
        bottom: calc(100% + 6px);
        left: 50%;
        transform: translateX(-50%);
        z-index: 100;
        min-width: 160px;
        max-width: 280px;
        padding: 6px 10px;
        border-radius: 4px;
        background: rgba(40, 40, 40, 0.92);
        color: rgba(255, 255, 255, 0.90);
        font-size: 12px;
        white-space: normal;
        pointer-events: none;

        &::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 5px solid transparent;
            border-top-color: rgba(40, 40, 40, 0.92);
        }
    }

    .the-button__tooltip-reason {
        &:not(:last-child) {
            margin-bottom: 4px;
            padding-bottom: 4px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }
    }

    .the-button--disabled {
        cursor: not-allowed;
        border-color: rgba(80, 80, 80, 0.25);
        color: rgba(0, 0, 0, 0.35);

        background-image: linear-gradient(
            180deg,
            rgba(240, 240, 240, 0.80) 0%,
            rgba(225, 225, 225, 0.80) 100%
        );

        box-shadow: none;

        &:hover, &:active {
            border-color: rgba(80, 80, 80, 0.25);
            background-image: linear-gradient(
                180deg,
                rgba(240, 240, 240, 0.80) 0%,
                rgba(225, 225, 225, 0.80) 100%
            );
            box-shadow: none;
        }
    }

    .the-button--important {
        border-color: rgba(185, 40, 40, 0.65);

        background-image: linear-gradient(
            180deg,
            rgba(255, 198, 198, 0.95) 0%,
            rgba(237, 145, 145, 0.90) 45%,
            rgba(215, 110, 110, 0.95) 50%,
            rgba(230, 132, 132, 1.00) 100%
        );

        &:hover {
            border-color: rgba(160, 22, 22, 0.80);

            background-image: linear-gradient(
                180deg,
                rgba(255, 172, 172, 0.95) 0%,
                rgba(227, 112, 112, 0.90) 45%,
                rgba(202, 75, 75, 0.95) 50%,
                rgba(217, 97, 97, 1.00) 100%
            );

            box-shadow:
                inset 0 1px 0 rgba(255, 255, 255, 0.90),
                inset 0 -1px 0 rgba(255, 255, 255, 0.30),
                inset 1px 0 0 rgba(255, 255, 255, 0.45),
                inset -1px 0 0 rgba(255, 255, 255, 0.45),
                0 0 4px rgba(200, 30, 30, 0.40),
                0 1px 0 rgba(255, 255, 255, 0.60);
        }

        &:active {
            background-image: linear-gradient(
                180deg,
                rgba(188, 65, 65, 0.95) 0%,
                rgba(205, 85, 85, 0.90) 100%
            );
        }
    }

    .the-button--with-tooltip {
        position: relative;
    }
</style>