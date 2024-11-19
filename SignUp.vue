<template>
  <div class="absolute top-16 left-64 h-screen right-0 bottom-0 bg-gray-50 z-0">
    <div class="bg-white p-8 rounded-lg shadow-lg ml-[240px] mt-20 w-6/12">
      <h2 class="mb-6 text-3xl font-semibold text-center">Sign Up</h2>
      <div v-if="notification" class="mb-4 p-3 bg-green-200 text-green-800 rounded">
        {{ notification }}
      </div>
      <form @submit.prevent="handleSignup">
        <div class="relative mb-4">
          <fa icon="user" class="absolute left-3 top-3 text-gray-400" />
          <input v-model="username" type="text" placeholder="Username"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required />
          <p v-if="usernameError" class="text-red-500 mb-2">{{ usernameError }}</p>
        </div>

        <div class="relative mb-4">
          <fa icon="envelope" class="absolute left-3 top-3 text-gray-400" />
          <input v-model="email" type="email" placeholder="Email"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required />
          <p v-if="emailError" class="text-red-500 mb-2">{{ emailError }}</p>
        </div>

        <div class="relative mb-4">
          <fa icon="lock" class="absolute left-3 top-3 text-gray-400" />
          <input v-model="password" :type="passwordVisible ? 'text' : 'password'" placeholder="Password"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required />
          <button type="button" @click="togglePassword" class="absolute right-2 top-2">
            <span v-if="passwordVisible">
              <fa icon="eye" class="text-lg" />
            </span>
            <span v-else>
              <fa icon="eye-slash" class="text-lg" />
            </span>
          </button>
        </div>

        <div class="relative mb-4">
          <fa icon="lock" class="absolute left-3 top-3 text-gray-400" />
          <input v-model="retypePassword" :type="retypePasswordVisible ? 'text' : 'password'"
            placeholder="Retype Password"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required />
          <button type="button" @click="toggleRetypePassword" class="absolute right-2 top-2">
            <span v-if="retypePasswordVisible">
              <fa icon="eye" class="text-lg" />
            </span>
            <span v-else>
              <fa icon="eye-slash" class="text-lg" />
            </span>
          </button>
        </div>

        <p v-if="passwordError" class="text-red-500 mb-4">{{ passwordError }}</p>

        <button type="submit"
          class="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-200">
          Sign Up
        </button>
      </form>
      <p class="mt-4 text-center">
        Already have an account? <router-link to="/signin" class="text-blue-600 font-semibold">Sign In</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      retypePassword: '',
      passwordVisible: false,
      retypePasswordVisible: false,
      passwordError: '',
      emailError: '',
      usernameError: '',
      notification: null,
    };
  },
  watch: {
    username(value) {
      this.usernameError = /^[A-Z]/.test(value) ? '' : 'Username must start with a capital letter.';
    },
    email(value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.emailError = emailPattern.test(value) ? '' : 'Please enter a valid email address.';
    },
  },
  methods: {
    togglePassword() {
      this.passwordVisible = !this.passwordVisible;
    },
    toggleRetypePassword() {
      this.retypePasswordVisible = !this.retypePasswordVisible;
    },
    handleSignup() {
      this.passwordError = '';

      // Validate passwords
      if (this.password !== this.retypePassword) {
        this.passwordError = 'Passwords do not match.';
      }

      // If there are errors, prevent signup
      if (this.passwordError || this.emailError || this.usernameError) {
        return;
      }

      // Create an object to hold user details
      const userDetails = {
        username: this.username,
        email: this.email,
        password: this.password,
      };

      // Store the object as a JSON string in local storage
      localStorage.setItem('userDetails', JSON.stringify(userDetails));
      this.notification = 'Signup successful! Redirecting to sign in...';

      // Redirect to the signin page after a delay
      setTimeout(() => {
        this.$router.push('/signin');
      }, 2000);
    },
  },
};
</script>
