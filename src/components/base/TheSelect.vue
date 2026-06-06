<template>
    <div class="the-select" :class="{ 'the-select--open': isOpen, 'the-select--disabled': props.disabled }">
        <div class="the-select__trigger" @click="!props.disabled && toggle()">
            <span class="the-select__value">{{ selectedLabel }}</span>
            <span class="the-select__arrow"></span>
        </div>

        <div v-if="isOpen" class="the-select__dropdown">
            <div
                v-for="option in props.options"
                :key="option.value"
                class="the-select__option"
                :class="{ 'the-select__option--selected': option.value === model }"
                @click="select(option)"
            >
                {{ option.label }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, onUnmounted } from 'vue'

    export interface SelectOption {
        value: string | number
        label: string
    }

    interface Props {
        options: SelectOption[]
        placeholder?: string
        disabled?: boolean
    }

    const props = defineProps<Props>()
    const model = defineModel<string | number | null>()

    const isOpen = ref(false)

    const selectedLabel = computed(() => {
        const match = props.options.find(o => o.value === model.value)
        return match ? match.label : (props.placeholder ?? 'Select...')
    })

    function toggle() {
        isOpen.value = !isOpen.value
    }

    function select(option: SelectOption) {
        model.value = option.value
        isOpen.value = false
    }

    function onClickOutside(e: MouseEvent) {
        const el = (e.target as HTMLElement).closest('.the-select')
        if (!el) isOpen.value = false
    }

    onMounted(() => document.addEventListener('click', onClickOutside))
    onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style lang="scss">
    .the-select {
        position: relative;
        display: inline-block;
        min-width: 160px;
        font-size: 13px;
        user-select: none;
    }

    .the-select__trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 6px;
        cursor: pointer;

        border: 1px solid rgba(80, 80, 80, 0.55);
        border-radius: 3px;

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
            0 1px 2px rgba(0, 0, 0, 0.20);

        &:hover {
            border-color: rgba(60, 110, 190, 0.70);

            background-image: linear-gradient(
                180deg,
                rgba(220, 235, 255, 0.95) 0%,
                rgba(185, 215, 250, 0.90) 45%,
                rgba(160, 200, 245, 0.95) 50%,
                rgba(185, 215, 250, 1.00) 100%
            );
        }
    }

    .the-select--open .the-select__trigger {
        border-color: rgba(60, 110, 190, 0.70);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;

        background-image: linear-gradient(
            180deg,
            rgba(185, 215, 250, 1.00) 0%,
            rgba(160, 200, 245, 0.95) 50%,
            rgba(185, 215, 250, 0.90) 55%,
            rgba(220, 235, 255, 0.95) 100%
        );
    }

    .the-select__value {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .the-select__arrow {
        flex-shrink: 0;
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 5px solid rgba(60, 60, 60, 0.75);
        transition: transform 0.15s ease;

        .the-select--open & {
            transform: rotate(180deg);
        }
    }

    .the-select__dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 200;
        border: 1px solid rgba(60, 110, 190, 0.70);
        border-top: none;
        border-radius: 0 0 3px 3px;
        background: #fff;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
        max-height: 220px;
        overflow-y: auto;
    }

    .the-select__option {
        padding: 4px 6px;
        cursor: pointer;

        &:hover {
            background-color: rgba(60, 110, 190, 0.85);
            color: #fff;
        }

        &--selected {
            background-color: rgba(60, 110, 190, 0.15);
            font-weight: 500;

            &:hover {
                background-color: rgba(60, 110, 190, 0.85);
                color: #fff;
            }
        }
    }

    .the-select--disabled {
        .the-select__trigger {
            cursor: not-allowed;
            border-color: rgba(80, 80, 80, 0.25);
            color: rgba(0, 0, 0, 0.35);

            background-image: linear-gradient(
                180deg,
                rgba(240, 240, 240, 0.80) 0%,
                rgba(225, 225, 225, 0.80) 100%
            );

            box-shadow: none;

            &:hover {
                border-color: rgba(80, 80, 80, 0.25);
                background-image: linear-gradient(
                    180deg,
                    rgba(240, 240, 240, 0.80) 0%,
                    rgba(225, 225, 225, 0.80) 100%
                );
            }
        }

        .the-select__arrow {
            border-top-color: rgba(60, 60, 60, 0.30);
        }
    }
</style>
