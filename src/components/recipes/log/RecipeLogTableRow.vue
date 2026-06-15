<template>
     <div
        :class="[ 'recipe-log-view__row', { 'recipe-log-view__row--clickable': routerLink(entry.eventType) !== false } ]"
        @click="routerLink(entry.eventType) !== false ? router.push({ name: routerLink(entry.eventType) as string, params: { id: entry.id } }) : () => {}"
    >
        <span :class="['recipe-log-view__tag', `recipe-log-view__tag--${eventTypeClass(entry.eventType)}`]">
            {{ eventTypeLabel(entry.eventType) }}
        </span>

        <div class="recipe-log-view__right">
            <span>{{ entry.userFullName }}</span>
            <span class="recipe-log-view__separator">|</span>
            <span class="recipe-log-view__time">{{ formatTime(entry.createdAt) }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import router from '@/router';
    import { RecipeLogPageEntry } from './recipe-log-models'

    interface Props {
        entry: RecipeLogPageEntry
    }

    const props = defineProps<Props>();

    function routerLink(eventType: string): string | boolean {
        const map: Record<string, string | boolean> = {
            EDITED: 'recipe-edit-log-info',
            SUBMITTED_FOR_APPROVAL: 'recipe-review-submitted-for-approval-log-info',
            APPROVED: 'recipe-approved-log-info',
            RETURNED_FOR_REVISION: 'recipe-review-returned-for-revision-log-info',
            DISCARDED: false,
            ARCHIVED: false,
            RETURNED_TO_APPROVED: false,
        }
        return map[eventType]
    }

    function eventTypeLabel(eventType: string): string {
        const map: Record<string, string> = {
            EDITED: 'Edited',
            SUBMITTED_FOR_APPROVAL: 'Submitted',
            APPROVED: 'Approved',
            RETURNED_FOR_REVISION: 'Returned',
            DISCARDED: 'Discarded',
            ARCHIVED: 'Archived',
            RETURNED_TO_APPROVED: 'Unarchived',
        }
        return map[eventType] ?? eventType
    }

    function eventTypeClass(eventType: string): string {
        return eventType.toLowerCase().replace(/_/g, '-')
    }

    function formatTime(createdAt: string): string {
        return new Date(createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    }
</script>

<style lang="scss">
    .recipe-log-view__row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 14px;
        height: $tableRowHeight;
        background-color: white;
        border: 1px solid $midGray;
        border-radius: 5px;
        user-select: none;

        box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1.00),
            inset 0 -1px 0 rgba(255, 255, 255, 0.40),
            inset 1px 0 0 rgba(255, 255, 255, 0.55),
            inset -1px 0 0 rgba(255, 255, 255, 0.55),
            0 1px 2px rgba(0, 0, 0, 0.20),
            0 1px 0 rgba(255, 255, 255, 0.60);
    }

    .recipe-log-view__row--clickable {
        cursor: pointer;
    }

    .recipe-log-view__tag {
        padding: 4px 10px;
        border-radius: 3px;
        font-size: 13px;

        &--edited                { background: #e8e8e8; color: #555;    border: 1px solid #aaa; }
        &--submitted-for-approval{ background: #fff3cd; color: #856404; border: 1px solid #856404; }
        &--approved              { background: #d4edda; color: #256236; border: 1px solid #256236; }
        &--returned-for-revision { background: #fde2cc; color: #7a4310; border: 1px solid #7a4310; }
        &--discarded             { background: #f5c6cb; color: #721c24; border: 1px solid #721c24; }
        &--archived              { background: #dde0e8; color: #3a3f55; border: 1px solid #3a3f55; }
        &--returned-to-approved  { background: #d0f0ec; color: #1a6b5e; border: 1px solid #1a6b5e; }
    }

    .recipe-log-view__right {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 5px;
    }

    .recipe-log-view__separator {
        font-size: 16px;
        color: #888;
    }
    
    .recipe-log-view__time {
        font-size: 13px;
        flex-shrink: 0;
    }
</style>