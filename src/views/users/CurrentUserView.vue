<template>
    <TheLayout>
        <div
            v-if="user == undefined"
            class="current-user-info-view__loader"
        >
            <TheSpinner size="lg" />
        </div>

        <template v-else>
            <TheTitle>Hello, {{ user.fullName }}!</TheTitle>

             <div>
                <SectionTitle>Information</SectionTitle>

                <div class="current-user-info-view__meta-row">
                    <span class="current-user-info-view__label">Username</span>
                    <span>{{ user.username }}</span>
                </div>
                <div class="current-user-info-view__meta-row">
                    <span class="current-user-info-view__label">Email</span>
                    <span>{{ user.email }}</span>
                </div>
                <div class="current-user-info-view__meta-row">
                    <span class="current-user-info-view__label">Phone Number</span>
                    <span>{{ user.phoneNumber }}</span>
                </div>
                <div
                    class="current-user-info-view__meta-row" 
                    style="text-transform: capitalize;"
                >
                    <span class="current-user-info-view__label">Roles</span>
                    <span>{{ user.roles.join(", ") }}</span>
                </div>
            </div>
        </template>
    </TheLayout>
</template>

<script setup lang="ts">
    import { useAuth } from '@/store/auth/auth';
    import { APICall } from '@/service/api/api';
    import { onMounted, ref, watch } from 'vue';
    import { User } from '@/components/users/users-models';

    import TheLayout from '@/components/layout/TheLayout.vue';
    import TheTitle from '@/components/layout/TheTitle.vue';
    import TheSpinner from '@/components/base/TheSpinner.vue';
    import SectionTitle from '@/components/base/SectionTitle.vue';

    const auth = useAuth();

    const user = ref<User | undefined>(undefined);

    async function fetchUser() {
        user.value = await (new APICall<User>(`users/${auth.user?.id}`)).execute();
    }

    onMounted(fetchUser);
</script>

<style lang="scss">
    .current-user-info-view__loader {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .current-user-info-view__meta-row {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .current-user-info-view__label {
        font-weight: bold;
        width: 100%;
        flex-shrink: 0;
        color: black;
    }
</style>