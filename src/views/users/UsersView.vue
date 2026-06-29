<template>
    <TheLayout>
        <TheTitle>Users</TheTitle>

        <div class="users-view__toolbar">
            <TheSearchbar
                v-model="search"
                class="users-view__search"
            />

            <div class="users-view__toolbar__buttons">
                <TheSelect
                    v-model="roleId"
                    :options="roleOptions ?? []"
                    placeholder="All roles"
                    :disabled="roleOptions == undefined || usersPage == undefined"
                    class="users-view__role-select"
                />

                <TheButton
                    v-if="authStore.user?.hasRoles([ Role.ADMIN ])"
                    @click="router.push('/users/add')"
                    class="users-view__add-button"
                >
                    Add
                </TheButton>
            </div>
           
        </div>

        <div class="users-view__loader" v-if="usersPage == undefined">
            <TheSpinner size="lg"/>
        </div>

        <template v-else>
            <div
                v-if="usersPage?.totalElements != 0"
                class="users-view__results"
            >
                <UsersTable :users="usersPage?.users" />

                <ThePager 
                    v-if="(usersPage?.totalElements ?? 0) > pageSize"
                    :current-page="currentPage"
                    :total-pages="usersPage?.totalPages"
                    @previous="getPreviousPage"
                    @next="getNextPage"
                />
            </div>
            <div
                v-else
                class="users-view__not-results"
            >
                <p>No users found</p>
            </div>
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
    import { onMounted, ref, watch } from 'vue';
    import router from '@/router';
    import { Role, UserRole, UsersPage } from '@/components/users/users-models';
    import { APICall } from '@/service/api/api';
    import { useAuth } from '@/store/auth/auth';

    import TheSpinner from '@/components/base/TheSpinner.vue';
    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import UsersTable from '@/components/users/UsersTable.vue';
    import TheButton from '@/components/base/TheButton.vue';
    import TheSearchbar from '@/components/base/TheSearchbar.vue';
    import ThePager from '@/components/base/ThePager.vue';
    import TheSelect, { type SelectOption } from '@/components/base/TheSelect.vue';

    const authStore = useAuth();

    const pageSize = 10;

    const usersPage = ref<UsersPage | undefined>(undefined);
    const search = ref<string>('');
    const roleId = ref<string | number | null>(null);
    const currentPage = ref<number>(1);

    const roleOptions = ref<SelectOption[] | undefined>(undefined);

    let debounceTimer: ReturnType<typeof setTimeout>;

    watch(search, () => {
        clearTimeout(debounceTimer);
        currentPage.value = 1;
        usersPage.value = undefined;
        debounceTimer = setTimeout(fetchUsers, 400);
    })

    watch(roleId, () => {
        currentPage.value = 1;
        usersPage.value = undefined;
        fetchUsers();
    })

    async function fetchUsers() {
        let path = `users?page=${currentPage.value}&pageSize=${pageSize}`;

        if(search.value.trim()) {
            path += `&search=${encodeURIComponent(search.value.trim())}`;
        }

        if(roleId.value) {
            path += `&roleId=${roleId.value}`;
        }

        usersPage.value = await (new APICall<UsersPage>(path)).execute();
    }

    async function fetchRoles() {
        const roles = await (new APICall<UserRole[]>('users/roles')).execute();
        roleOptions.value = [
            { value: 0, label: 'All roles' },
            ...roles.map(r => ({ value: r.id, label: r.role }))
        ]
    }

    async function getNextPage() {
        currentPage.value++;
        usersPage.value = undefined;
        await fetchUsers();
    }

    async function getPreviousPage() {
        currentPage.value--;
        usersPage.value = undefined;
        await fetchUsers();
    }
    onMounted(async () => {
        await fetchUsers();
        await fetchRoles();
    });
</script>

<style lang="scss">
    .users-view__toolbar {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        width: 100%;
        margin-bottom: 20px;
    }

    .users-view__toolbar__buttons {
        display: flex; 
        flex-direction: row; 
        align-items: center;
        gap: 10px;
    }

    .users-view__search {
        min-width: 300px;
    }

    .users-view__role-select {
        width: 140px;
        flex-shrink: 0;
    }

    .users-view__add-button {
        width: 75px;
        padding: 4px;
        flex-shrink: 0;
    }

    .users-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .users-view__results {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 20px;
    }

    .users-view__not-results {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        
        p {
            font-weight: bold;
        }
    }
</style>
