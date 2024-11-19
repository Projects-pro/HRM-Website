<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content mt-60 mb-48">
            <h2 class="text-2xl font-bold text-center  mb-4">Edit Company</h2>

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
                        <p class="text-xs text-gray-500 mt-60 mb-2">
                            Accepts .jpg, .png, .gif up to 1MB. Recommended dimensions: 200px X 200px
                        </p>
                    </div>
                </div>

                <!-- Company Details Form -->
                <div class="flex-grow">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Company Name<span
                                    class="text-red-500">*</span></label>
                            <input v-model="formData.companyName" type="text" class="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Contact Person<span
                                    class="text-red-500">*</span></label>
                            <input v-model="formData.contactPerson" type="text" class="w-full p-2 border rounded-md" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div class="col-span-2">
                            <label class="block text-sm font-medium mb-1">Address</label>
                            <input v-model="formData.address" type="text" class="w-full p-2 border rounded-md" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Country<span
                                    class="text-red-500">*</span></label>
                            <input v-model="formData.country" type="text" class="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">City</label>
                            <input v-model="formData.city" type="text" class="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">State</label>
                            <input v-model="formData.state" type="text" class="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Postal Code<span
                                    class="text-red-500">*</span></label>
                            <input v-model="formData.postalCode" type="text" class="w-full p-2 border rounded-md" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Email<span
                                    class="text-red-500">*</span></label>
                            <input v-model="formData.email" type="email" class="w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Phone Number<span
                                    class="text-red-500">*</span></label>
                            <input v-model="formData.phoneNumber" type="text" class="w-full p-2 border rounded-md" />
                        </div>
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium mb-1">Website URL</label>
                        <input v-model="formData.website" type="text" class="w-full p-2 border rounded-md" />
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4">
                <button @click="closeModal"
                    class="bg-white border border-gray-500 text-gray-500 rounded-lg px-4 py-2">Cancel</button>
                <button @click="saveChanges" class="bg-blue-500 text-white rounded-lg px-4 py-2">Save</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isOpen: Boolean,
        companyData: Object,
    },
    data() {
        return {
            formData: {
                companyName: this.companyData.companyName,
                contactPerson: this.companyData.contactPerson,
                phoneNumber: this.companyData.phoneNumber,
                email: this.companyData.email,
                website: this.companyData.website,
                address: this.companyData.address,
                country: this.companyData.country,
                city: this.companyData.city,
                state: this.companyData.state,
                postalCode: this.companyData.postalCode,
                logo: this.companyData.logo,
            },
        };
    },
    computed: {
        companyLogo() {
            return this.formData.logo || '';
        },
    },
    methods: {
        onImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.formData.logo = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        triggerFileUpload() {
            this.$refs.fileInput.click();
        },
        closeModal() {
            this.$emit('close');
        },
        saveChanges() {
            this.$emit('save', { ...this.formData });
            this.closeModal();
        },
    },
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 700px;
}
</style>