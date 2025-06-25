<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 overflow-auto">
        <AdminNavbar />
        <div class="p-6"> 
            <slot />
        </div>
    </div>
  </div>
</template>
