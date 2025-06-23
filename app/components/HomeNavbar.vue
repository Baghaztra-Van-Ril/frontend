<template>
    <div class="bg-white dark:bg-gray-800 shadow-md">
        <div class="flex items-center justify-between py-4 px-5">
            <ULogo class="text-xl font-bold" />
            <ul class="flex space-x-6">
                <li>
                    <ULink to="/home" active-class="text-primary" class="hover:text-primary">Home</ULink>
                </li>
                <li>
                    <ULink to="/products" active-class="text-primary" class="hover:text-primary">Products</ULink>
                </li>
            </ul>
            <div class="flex items-center space-x-4">
                <ColorModeButton />
                <UButton color="primary" to="/login">Login</UButton>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>
