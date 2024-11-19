<template>
    <div class="absolute top-16 left-64 h-screen right-0 bottom-0 bg-white z-0">
        <div class="bg-gray-100 p-6 rounded shadow-md ml-[240px] mt-20 w-6/12">
            <h2 class="mb-4 text-2xl">Login</h2>
            <div v-if="notification" class="mb-4 p-2 bg-green-200 text-green-800 rounded">
                {{ notification }}
            </div>
            <form @submit.prevent="handleLogin">
                <div class="relative mb-4">
                    <fa icon="envelope" class="absolute left-3 top-3 text-gray-400"></fa>
                    <input v-model="email" type="email" placeholder="Email"
                        class="block w-full pl-10 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300" 
                        required />
                </div>
                <div class="relative mb-4">
                    <fa icon="lock" class="absolute left-3 top-3 text-gray-400"></fa>
                    <input v-model="password" type="password" placeholder="Password"
                        class="block w-full pl-10 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300" 
                        required />
                </div>
                <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                    Login
                </button>
            </form>
            <p class="mt-4">
                Don't have an account? <router-link to="/signup" class="text-blue-500">Sign Up</router-link>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            password: '',
            notification: null, // Add notification state
        };
    },
    methods: {
        handleLogin() {
            const userDetails = JSON.parse(localStorage.getItem('userDetails'));

            if (userDetails && this.email === userDetails.email && this.password === userDetails.password) {
                this.notification = 'Login successful!'; // Set success notification

                // Clear the form inputs
                this.email = '';
                this.password = '';
            } else {
                this.notification = 'Invalid email or password.'; // Set error notification
            }

            // Clear the notification after a delay
            setTimeout(() => {
                this.notification = null;
            }, 3000);
        },
    },
};
</script>

<style scoped>
input {
    transition: border-color 0.2s ease;
}
input:focus {
    border-color: #3b82f6; /* Change border color on focus */
}
</style>
