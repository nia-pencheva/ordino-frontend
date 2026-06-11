<template>
    <div class="the-select" :class="{ 'the-select--open': isOpen, 'the-select--disabled': props.disabled }">
        <div class="the-select__trigger" @click="!props.disabled && toggle()">
            <span class="the-select__value">{{ selectedLabel }}</span>
            <span class="the-select__arrow"></span>
        </div>

        <div v-if="isOpen" class="the-select__dropdown">
            <div
                v-if="isMultiLevel && navigationStack.length > (props.rootParent ? 1 : 0)"
                class="the-select__option the-select__option--back"
                @click="goBack"
            >
                <span class="the-select__chevron-left"></span>
                Back
            </div>
            <div
                v-if="currentParent"
                class="the-select__option the-select__option--current-parent"
                :class="{ 'the-select__option--selected': currentParent.value === model }"
                @click="select(currentParent)"
            >
                <span class="the-select__option__label">{{ currentParent.label }}</span>
            </div>
            <div
                v-for="option in currentOptions"
                :key="option.value ?? -1"
                class="the-select__option"
                :class="{
                    'the-select__option--selected': option.value === model,
                    'the-select__option--has-children': !!option.children?.length
                }"
                @click="handleOptionClick(option)"
            >
                <span class="the-select__option__label">{{ option.label }}</span>
                <span v-if="option.children?.length" class="the-select__chevron-right"></span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed, onMounted, onUnmounted } from 'vue'

    export interface SelectOption {
        value: string | number
        label: string
        children?: SelectOption[]
    }

    interface Props {
        options: SelectOption[]
        placeholder?: string
        disabled?: boolean
        rootParent?: SelectOption
    }

    const props = defineProps<Props>()
    const model = defineModel<string | number | null>()

    interface NavigationLevel {
        parent: SelectOption
        children: SelectOption[]
    }

    const isOpen = ref(false)
    const navigationStack = ref<NavigationLevel[]>([])

    const isMultiLevel = computed(() => props.options.some(o => o.children && o.children.length > 0))

    const currentParent = computed(() =>
        navigationStack.value[navigationStack.value.length - 1]?.parent ?? props.rootParent ?? null
    )

    const currentOptions = computed(() => {
        if (navigationStack.value.length === 0) return props.options
        return navigationStack.value[navigationStack.value.length - 1].children
    })

    const selectedLabel = computed(() => {
        if (model.value == null) return props.placeholder ?? 'Select...'
        if (props.rootParent && model.value === props.rootParent.value) return props.rootParent.label
        const label = findLabel(props.options, model.value)
        return label ?? (props.placeholder ?? 'Select...')
    })

    function findLabel(options: SelectOption[], value: string | number): string | null {
        for (const option of options) {
            if (option.value === value) return option.label
            if (option.children?.length) {
                const found = findLabel(option.children, value)
                if (found) return found
            }
        }
        return null
    }

    function toggle() {
        isOpen.value = !isOpen.value
        if (!isOpen.value) {
            navigationStack.value = []
        } else if (props.rootParent) {
            const found = findOptionInTree(props.options, props.rootParent.value)
            const children = found?.children ?? props.options
            navigationStack.value = [{ parent: props.rootParent, children }]
        }
    }

    function findOptionInTree(options: SelectOption[], value: string | number): SelectOption | null {
        for (const opt of options) {
            if (opt.value === value) return opt
            if (opt.children?.length) {
                const found = findOptionInTree(opt.children, value)
                if (found) return found
            }
        }
        return null
    }

    function select(option: SelectOption) {
        model.value = option.value
        isOpen.value = false
        navigationStack.value = []
    }

    function handleOptionClick(option: SelectOption) {
        if (option.children?.length) {
            navigationStack.value = [...navigationStack.value, { parent: option, children: option.children }]
        } else {
            select(option)
        }
    }

    function goBack() {
        navigationStack.value = navigationStack.value.slice(0, -1)
    }

    function onClickOutside(e: MouseEvent) {
        const inside = e.composedPath().some(el => el instanceof HTMLElement && el.classList.contains('the-select'))
        if (!inside) {
            isOpen.value = false
            navigationStack.value = []
        }
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

    .the-select__option__label {
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

    .the-select__chevron-right {
        flex-shrink: 0;
        width: 0;
        height: 0;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        border-left: 5px solid rgba(60, 60, 60, 0.75);
    }

    .the-select__chevron-left {
        flex-shrink: 0;
        width: 0;
        height: 0;
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        border-right: 5px solid rgba(60, 60, 60, 0.60);
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 5px;
        padding: 4px 6px;
        cursor: pointer;

        &:hover {
            background-color: rgba(60, 110, 190, 0.85);
            color: #fff;

            .the-select__chevron-right {
                border-left-color: #fff;
            }
        }

        &--selected {
            background-color: rgba(60, 110, 190, 0.15);
            font-weight: 500;

            &:hover {
                background-color: rgba(60, 110, 190, 0.85);
                color: #fff;
            }
        }

        &--current-parent {
            border-bottom: 1px solid #d3d3d3;
            font-style: italic;
        }

        &--back {
            justify-content: flex-start;
            gap: 6px;
            background-color: #f7f7f7;
            border-bottom: 1px solid #d3d3d3;
            color: rgba(0, 0, 0, 0.55);

            &:hover {
                background-color: rgba(60, 110, 190, 0.85);
                color: #fff;

                .the-select__chevron-left {
                    border-right-color: #fff;
                }
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
