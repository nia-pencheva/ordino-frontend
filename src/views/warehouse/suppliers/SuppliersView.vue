<template>
    <TheLayout>
        <TheTitle>Suppliers</TheTitle>

        <div class="suppliers-view__toolbar">
            <TheSearchbar
                v-model="search"
                :placeholder="`Search by ${criteriaLabel}...`"
            />

            <div class="suppliers-view__toolbar__buttons">
                <TheSelect
                    v-model="criteria"
                    :options="criteriaOptions"
                    class="suppliers-view__criteria-select"
                />

                <TheButton
                    @click="router.push({ name: 'add-supplier' })"
                    class="suppliers-view__add-button"
                >
                    Add
                </TheButton>
            </div>
        </div>

        <div class="suppliers-view__tabs">
            <div
                @click="active = true"
                :class="['suppliers-view__tab', { 'suppliers-view__tab--active': active }]"
            >
                Active
            </div>
            <div
                @click="active = false"
                :class="['suppliers-view__tab', { 'suppliers-view__tab--active': !active }]"
            >
                Deactivated
            </div>
        </div>

        <div class="suppliers-view__tab__wrapper">
            <div v-if="!loaded" class="suppliers-view__loader">
                <TheSpinner size="lg" />
            </div>

            <template v-else>
                <div
                    v-if="suppliersPage?.totalElements != 0"
                    class="suppliers-view__results"
                >
                    <SuppliersTable :suppliers="suppliersPage?.suppliers" />

                    <ThePager
                        v-if="(suppliersPage?.totalElements ?? 0) > pageSize"
                        :current-page="currentPage"
                        :total-pages="suppliersPage?.totalPages"
                        @previous="getPreviousPage"
                        @next="getNextPage"
                    />
                </div>

                <div v-else class="suppliers-view__no-results">
                    <p>No suppliers found</p>
                </div>
            </template>
        </div>
    </TheLayout>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref, watch } from 'vue'

    import { APICall } from '@/service/api/api'
    import { SuppliersPage } from '@/components/warehouse/suppliers/suppliers-models'

    import TheLayout from '@/components/layout/TheLayout.vue'
    import TheTitle from '@/components/layout/TheTitle.vue'
    import TheSearchbar from '@/components/base/TheSearchbar.vue'
    import TheSelect, { type SelectOption } from '@/components/base/TheSelect.vue'
    import TheSpinner from '@/components/base/TheSpinner.vue'
    import ThePager from '@/components/base/ThePager.vue'
    import SuppliersTable from '@/components/warehouse/suppliers/SuppliersTable.vue'
import TheButton from '@/components/base/TheButton.vue'
import router from '@/router'

    const pageSize = 10

    const suppliersPage = ref<SuppliersPage | undefined>(undefined)
    const search = ref<string>('')
    const criteria = ref<string | number | null>('name')
    const active = ref<boolean>(true)
    const currentPage = ref<number>(1)

    const criteriaOptions: SelectOption[] = [
        { value: 'name', label: 'Name' },
        { value: 'address', label: 'Address' },
        { value: 'email', label: 'Email' },
        { value: 'phoneNumber', label: 'Phone number' },
    ]

    const criteriaLabel = computed(() =>
        criteriaOptions.find(o => o.value === criteria.value)?.label.toLowerCase() ?? 'name'
    )

    const loaded = computed<boolean>(() => suppliersPage.value != undefined)

    let debounceTimer: ReturnType<typeof setTimeout>

    watch(search, () => {
        clearTimeout(debounceTimer)
        currentPage.value = 1
        suppliersPage.value = undefined
        debounceTimer = setTimeout(fetchSuppliers, 400)
    })

    watch(criteria, () => {
        currentPage.value = 1
        suppliersPage.value = undefined
        fetchSuppliers()
    })

    watch(active, () => {
        currentPage.value = 1
        suppliersPage.value = undefined
        fetchSuppliers()
    })

    async function fetchSuppliers() {
        let path = `suppliers?active=${active.value}&page=${currentPage.value}&pageSize=${pageSize}`

        if (search.value.trim()) {
            path += `&search=${encodeURIComponent(search.value.trim())}&criteria=${criteria.value}`
        }

        suppliersPage.value = await new APICall<SuppliersPage>(path).execute()
    }

    async function getNextPage() {
        currentPage.value++
        suppliersPage.value = undefined
        await fetchSuppliers()
    }

    async function getPreviousPage() {
        currentPage.value--
        suppliersPage.value = undefined
        await fetchSuppliers()
    }

    onMounted(async () => {
        await fetchSuppliers()
    })
</script>

<style lang="scss">
    .suppliers-view__toolbar {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        width: 100%;
        margin-bottom: 20px;
    }

    .suppliers-view__toolbar__buttons {
        display: flex; 
        flex-direction: row; 
        align-items: center;
        gap: 10px;
    }

    .suppliers-view__criteria-select {
        width: 150px;
        flex-shrink: 0;
    }

    .suppliers-view__add-button {
        width: 75px;
        padding: 4px;
        flex-shrink: 0;
    }

    .suppliers-view__tabs {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        width: 100%;
        border-bottom: 1px solid $lightGrayBorder;
        padding-top: 4px;
    }

    .suppliers-view__tab {
        padding: 5px 16px;
        cursor: pointer;
        border: 1px solid $lightGrayBorder;
        border-bottom: none;
        border-radius: 4px 4px 0 0;
        background: $darkGray;
        color: #888;
        font-size: 14px;
        user-select: none;
        margin-right: 2px;

        &:hover:not(.suppliers-view__tab--active) {
            background: darken($darkGray, 4%);
        }

        &--active {
            background: white;
            color: $fontColorMain;
            position: relative;
            z-index: 1;
            margin-bottom: -1px;
            border: 1px solid #9d9d9d;
            border-bottom: 1px solid white;
            clip-path: inset(-10px -10px 0px -10px);

            @include glass-gray-shadow();
        }
    }

    .suppliers-view__tab__wrapper {
        flex: 1;
        display: flex;
        padding: 15px 5px 5px;
        clip-path: inset(-10px 0px 1px 1px);

        @include glass-gray-shadow();
    }

    .suppliers-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .suppliers-view__results {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 20px;
    }

    .suppliers-view__no-results {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;

        p {
            font-weight: bold;
        }
    }
</style>
