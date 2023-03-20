<script setup>
import { useCurrentTime } from '../composables/useCurrentTime';

const { currentTime } = useCurrentTime();
</script>

<template>
    <div>
        <i class="pi pi-clock text-red-500"></i><span class="ml-2 text-xl text-blue-500 font-medium">{{ currentTime.toLocaleTimeString() }}</span>
    </div>
</template>

<style lang="scss" scoped></style>
