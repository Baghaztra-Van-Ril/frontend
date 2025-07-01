<template>
    <div class="bg-gray-300 dark:bg-gray-800 shadow-md">
        <div class="flex items-center justify-between py-4 px-5">
            <div>
                <ULink to="/home" active-class="text-primary" class="hover:text-primary text-gray-700">TOKUS</ULink>
            </div>
            <ULogo class="text-xl font-bold" />
            <div class="flex items-center space-x-4">
                <ColorModeButton />
                <UButton color="primary" to="/login">Login</UButton>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>
