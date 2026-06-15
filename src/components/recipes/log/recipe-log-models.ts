export interface RecipeLogPage {
    entries: RecipeLogPageEntry[]
    totalElements: number
    totalPages: number
}

export interface RecipeLogPageEntry {
    id: number
    userFullName: string
    eventType: string
    createdAt: string
}

export interface RecipeLogEntry {
    id: number
    recipeId: number
    recipeTitle: string
    userId: number
    userFullName: string
    createdAt: string
}

export interface RecipeReviewLogEntry extends RecipeLogEntry {}

export interface RecipeReviewSubmittedForApprovalLogEntry extends RecipeReviewLogEntry {
    snapshot: string
}

export interface RecipeReviewReturnedForRevisionLogEntry extends RecipeReviewLogEntry {
    notes: string
}

export interface RecipeReviewDiscardedLogEntry extends RecipeReviewLogEntry {}

export interface RecipeReviewApprovedLogEntry extends RecipeReviewLogEntry {
    snapshot: string
}

export interface RecipeEditLogEntry extends RecipeLogEntry {
    oldData: string
    newData: string
}

export interface RecipeArchiveLogEntry extends RecipeLogEntry {}

export interface RecipeArchiveArchivedLogEntry extends RecipeArchiveLogEntry {}

export interface RecipeArchiveReturnedToApprovedLogEntry extends RecipeArchiveLogEntry {}
