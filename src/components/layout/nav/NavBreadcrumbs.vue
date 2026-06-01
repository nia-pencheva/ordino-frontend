<template>
    <nav class="nav-breadcrumbs">
        <template v-for="(crumb, index) in breadcrumbs" :key="crumb.link">
            <router-link
                v-if="index < breadcrumbs.length - 1"
                :to="crumb.link"
                class="nav-breadcrumbs__link"
            >
                {{ crumb.label }}
            </router-link>
            <span v-else class="nav-breadcrumbs__current">{{ crumb.label }}</span>
            <span v-if="index < breadcrumbs.length - 1" class="nav-breadcrumbs__separator">/</span>
        </template>
    </nav>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';

    const route = useRoute();

    const breadcrumbs = computed(() => {
        const segments = route.path.split('/').filter(Boolean);
        const crumbs = [{ label: 'Home', link: '/' }];

        let path = '';
        for (const segment of segments) {
            path += `/${segment}`;
            const isParam = Object.values(route.params).includes(segment);
            const label = isParam
                ? 'Edit'
                : segment.charAt(0).toUpperCase() + segment.slice(1);
            crumbs.push({ label, link: path });
        }

        return crumbs;
    });
</script>

<style lang="scss">
    .nav-breadcrumbs {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
    }

    .nav-breadcrumbs__link {
        color: $fontColorMain;
        text-decoration: none;
        opacity: 0.55;

        &:hover {
            opacity: 1;
        }
    }

    .nav-breadcrumbs__separator {
        opacity: 0.35;
        font-size: 11px;
    }

    .nav-breadcrumbs__current {
        color: $fontColorMain;
        font-weight: 500;
    }
</style>
