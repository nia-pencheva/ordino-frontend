<template>
    <div>
        <button @click="handleLogout">Logout</button>
    </div>
</template>

<script setup lang="ts">
    import router from '@/router';
    import { useAuth } from '@/store/auth';

    const auth = useAuth();

    function handleLogout() {
        auth.logout();
        router.replace("/login")
    }
</script>
