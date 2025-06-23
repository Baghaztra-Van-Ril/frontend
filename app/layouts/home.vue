<template>
    <main class="min-h-screen">
        <div class="fixed top-0 left-0 w-full z-50">
            <HomeNavbar />
        </div>
        <UContainer class="pt-16">
            <slot />
        </UContainer>
    </main>
</template>