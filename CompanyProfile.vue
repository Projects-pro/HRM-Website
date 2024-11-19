<template>
    <!-- Main content -->
    <div class="flex justify-center items-center w-screen">
        <div>
            <Layout :issidebar="true" />
        </div>
        <div class="w-full flex-col h-screen overflow-y-auto">
            <div>
                <Layout :isheader="true" />
            </div>

            <!---Page data-->
            <div class="max-w-full m-5 sm:m-10 lg:m-14 2xl:m-14">
                <div class="bg-gray-100 mt-[120px] p-6 rounded-lg shadow-lg w-full">
                    <h2 class="text-lg text-center font-semibold mb-4">Add Company Profile</h2>

                    <div class="flex items-start space-x-6 mb-4">
                        <!-- Company Logo Upload Section -->
                        <div class="relative">
                            <div
                                class="w-32 h-32 border rounded-full flex items-center justify-center bg-gray-100 shadow-md relative">
                                <input type="file" ref="fileInput" class="absolute inset-0 opacity-0 cursor-pointer"
                                    @change="onImageUpload" accept=".jpg, .png, .gif" />
                                <img v-if="companyLogo" :src="companyLogo" alt="Company Logo"
                                    class="w-full h-full object-cover rounded-full" />
                                <span @click="triggerFileUpload"
                                    class="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg cursor-pointer"
                                    style="transform: translate(-1%, -95%);">+</span>
                                <p class="text-xs text-gray-500 mt-60 mb-2">Accepts .jpg, .png, .gif up to 1MB.
                                    Recommended dimensions: 200px X 200px</p>
                            </div>
                        </div>

                        <!-- Company Details Form -->
                        <div class="flex-grow">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium mb-1">Company Name<span
                                            class="text-red-500">*</span></label>
                                    <input v-model="companyName" type="text" class="w-full p-2 border rounded-md" />
                                    <p v-if="errors.companyName" class="text-red-500 text-xs">{{ errors.companyName }}
                                    </p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">Contact Person<span
                                            class="text-red-500">*</span></label>
                                    <input v-model="contactPerson" type="text" class="w-full p-2 border rounded-md" />
                                    <p v-if="errors.contactPerson" class="text-red-500 text-xs">{{ errors.contactPerson
                                        }}</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div class="col-span-2">
                                    <label class="block text-sm font-medium mb-1">Address</label>
                                    <input v-model="address" type="text" class="w-full p-2 border rounded-md" />
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium mb-1">Country<span
                                            class="text-red-500">*</span></label>
                                    <select v-model="country" class="w-full p-2 border rounded-md" required>
                                        <option value="" disabled>Select Country</option>
                                        <option v-for="country in countries" :key="country" :value="country">{{ country
                                            }}</option>
                                    </select>
                                    <p v-if="errors.country" class="text-red-500 text-xs">{{ errors.country }}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">City</label>
                                    <input v-model="city" type="text" class="w-full p-2 border rounded-md" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">State/Province</label>
                                    <input v-model="state" type="text" class="w-full p-2 border rounded-md" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">Postal Code<span
                                            class="text-red-500">*</span></label>
                                    <input v-model="postalCode" type="text" class="w-full p-2 border rounded-md"
                                        maxlength="10" />
                                    <p v-if="errors.postalCode" class="text-red-500 text-xs">{{ errors.postalCode }}</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium mb-1">Email<span
                                            class="text-red-500">*</span></label>
                                    <input v-model="email" type="email" class="w-full p-2 border rounded-md" />
                                    <p v-if="errors.email" class="text-red-500 text-xs">{{ errors.email }}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium mb-1">Confirm Email<span
                                            class="text-red-500">*</span></label>
                                    <input v-model="confirmEmail" type="email" class="w-full p-2 border rounded-md" />
                                    <p v-if="errors.confirmEmail" class="text-red-500 text-xs">{{ errors.confirmEmail }}
                                    </p>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium mb-1">Phone Number<span
                                            class="text-red-500">*</span></label>
                                    <input v-model="phoneNumber" type="tel" class="w-full p-2 border rounded-md"
                                        maxlength="10" />
                                    <p v-if="errors.phoneNumber" class="text-red-500 text-xs">{{ errors.phoneNumber }}
                                    </p>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="block text-sm font-medium mb-1">Website URL</label>
                                <input v-model="website" type="url" class="w-full p-2 border rounded-md" />
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-end space-x-4">
                        <button @click="cancel"
                            class="bg-white border border-green-500 text-green-500 rounded-lg px-4 py-2">Cancel</button>
                        <button @click="saveItem" class="bg-green-500 text-white rounded-lg px-4 py-2">Save</button>
                    </div>

                    <!-- Success Notification -->
                    <transition name="fade">
                        <div v-if="successMessage" class="mt-4 bg-green-100 text-green-800 p-2 rounded-md">
                            Successfully saved
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Layout from './Layout.vue';
export default {
    components: {
        Layout
    },
    data() {
        return {
            companyName: '',
            contactPerson: '',
            companyLogo: null,
            address: '',
            country: '',
            city: '',
            state: '',
            postalCode: '',
            email: '',
            confirmEmail: '',
            phoneNumber: '',
            website: '',
            successMessage: false,
            errors: {},
            countries: ['USA', 'Canada', 'UK', 'Australia', 'India'], // Add your countries here
        };
    },
    watch: {
        companyName(newValue) {
            if (!newValue) {
                this.errors.companyName = 'Company Name is required.';
            } else {
                delete this.errors.companyName;
            }
        },
        contactPerson(newValue) {
            if (!newValue || !/^[a-zA-Z\s]+$/.test(newValue)) {
                this.errors.contactPerson = 'Contact Person is required and must be a valid name.';
            } else {
                delete this.errors.contactPerson;
            }
        },
        country(newValue) {
            if (!newValue) {
                this.errors.country = 'Country is required.';
            } else {
                delete this.errors.country;
            }
        },
        postalCode(newValue) {
            if (!/^\d*$/.test(newValue)) {
                this.errors.postalCode = 'Postal Code must contain only digits.';
            } else {
                delete this.errors.postalCode;
            }
        },
        email(newValue) {
            if (!newValue) {
                this.errors.email = 'Email is required.';
            } else if (!newValue.endsWith('@gmail.com')) {
                this.errors.email = 'Email must end with @gmail.com.';
            } else {
                delete this.errors.email;
            }
        },
        confirmEmail(newValue) {
            if (newValue !== this.email) {
                this.errors.confirmEmail = 'Email confirmation does not match.';
            } else {
                delete this.errors.confirmEmail;
            }
        },
        phoneNumber(newValue) {
            if (!/^\d{0,10}$/.test(newValue)) {
                this.errors.phoneNumber = 'Phone Number must be exactly 10 digits.';
            } else {
                delete this.errors.phoneNumber;
            }
        },
    },
    methods: {
        onImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.companyLogo = URL.createObjectURL(file);
            }
        },
        triggerFileUpload() {
            this.$refs.fileInput.click();
        },
        saveItem() {
            this.errors = {}; // Clear previous errors
            if (this.validateForm()) {
                const companyProfile = {
                    companyName: this.companyName,
                    contactPerson: this.contactPerson,
                    address: this.address,
                    country: this.country,
                    city: this.city,
                    state: this.state,
                    postalCode: this.postalCode,
                    email: this.email,
                    phoneNumber: this.phoneNumber,
                    website: this.website,
                };
                localStorage.setItem('companyProfile', JSON.stringify(companyProfile));
                this.successMessage = true;
                setTimeout(() => {
                    this.successMessage = false; // Hide the message after 3 seconds
                }, 3000);
                this.resetForm();
                this.$router.push('/company'); // Redirect after saving
            } else {
                // If validation fails, ensure success message is cleared
                this.successMessage = false;
            }
        },
        validateForm() {
            let isValid = true;
            this.errors = {}; // Clear previous errors

            // Example validation checks
            if (!this.companyName) {
                this.errors.companyName = 'Company Name is required.';
                isValid = false;
            }
            if (!this.contactPerson || !/^[a-zA-Z\s]+$/.test(this.contactPerson)) {
                this.errors.contactPerson = 'Contact Person is required and must be a valid name.';
                isValid = false;
            }
            if (!this.country) {
                this.errors.country = 'Country is required.';
                isValid = false;
            }
            if (!/^\d*$/.test(this.postalCode)) {
                this.errors.postalCode = 'Postal Code must contain only digits.';
                isValid = false;
            }
            if (!this.email) {
                this.errors.email = 'Email is required.';
                isValid = false;
            }
            if (this.email !== this.confirmEmail) {
                this.errors.confirmEmail = 'Email confirmation does not match.';
                isValid = false;
            }
            if (!/^\d{10}$/.test(this.phoneNumber)) {
                this.errors.phoneNumber = 'Phone Number must be exactly 10 digits.';
                isValid = false;
            }

            return isValid;
        },
        cancel() {
            this.resetForm();
        },
        resetForm() {
            this.companyName = '';
            this.contactPerson = '';
            this.companyLogo = null;
            this.address = '';
            this.country = '';
            this.city = '';
            this.state = '';
            this.postalCode = '';
            this.email = '';
            this.confirmEmail = '';
            this.phoneNumber = '';
            this.website = '';
            this.errors = {};
        },
    },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
