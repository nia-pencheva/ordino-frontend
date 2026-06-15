<template>
    <nav class="nav-breadcrumbs">
        <template v-for="(crumb, index) in visibleCrumbs" :key="crumb.link ?? crumb.label">
            <router-link
                v-if="crumb.link && index < visibleCrumbs.length - 1"
                :to="crumb.link"
                class="nav-breadcrumbs__link"
            >
                {{ crumb.label }}
            </router-link>
            <span v-else-if="!crumb.link" class="nav-breadcrumbs__collapsed">{{ crumb.label }}</span>
            <span v-else class="nav-breadcrumbs__current">{{ crumb.label }}</span>
            <span v-if="index < visibleCrumbs.length - 1" class="nav-breadcrumbs__separator">/</span>
        </template>
    </nav>
</template>

<script setup lang="ts">
    import { computed } from 'vue';
    import { useRoute } from 'vue-router';

    interface Crumb {
        label: string
        link: string | null
    }

    const route = useRoute();

    const breadcrumbs = computed<Crumb[]>(() => {
        const segments = route.path.split('/').filter(Boolean);
        const crumbs: Crumb[] = [{ label: 'Home', link: '/' }];

        let path = '';
        for (const segment of segments) {
            path += `/${segment}`;
            const isParam = Object.values(route.params).includes(segment);
            const label = isParam
                ? 'Edit'
                : segment.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            crumbs.push({ label, link: path });
        }

        return crumbs;
    });

    const visibleCrumbs = computed<Crumb[]>(() => {
        if (breadcrumbs.value.length <= 3) return breadcrumbs.value;
        return [
            breadcrumbs.value[0],
            { label: '...', link: null },
            breadcrumbs.value[breadcrumbs.value.length - 1],
        ];
    });
</script>

<style lang="scss">
    .nav-breadcrumbs {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        overflow: hidden;
        min-width: 0;
        flex: 1;
    }

    .nav-breadcrumbs__link {
        color: $fontColorMain;
        text-decoration: none;
        opacity: 0.55;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;

        &:hover {
            opacity: 1;
        }
    }

    .nav-breadcrumbs__separator {
        opacity: 0.35;
        font-size: 11px;
        flex-shrink: 0;
    }

    .nav-breadcrumbs__current {
        color: $fontColorMain;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 0;
    }

    .nav-breadcrumbs__collapsed {
        opacity: 0.45;
        flex-shrink: 0;
    }
</style>
