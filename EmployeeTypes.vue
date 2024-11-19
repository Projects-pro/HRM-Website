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
            <div class="max-w-full m-5 sm:m-10 lg:m-14 2xl:m-14">
                <h1 class="text-3xl font-bold mb-6 text-center mt-[70px] text-gray-800">Add Employee Type</h1>

                <!-- Success Message after Add/Edit -->
                <div v-if="showSuccessMessage" class="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 px-6 py-3 bg-green-500 text-white rounded-md shadow-md">
                    <p class="font-semibold text-center">
                        Employee type has been successfully {{ isEditing ? 'updated' : 'added' }}!
                    </p>
                </div>

                <!-- Employee Types Table (always visible) -->
                <div class="mt-8 w-full max-w-4xl overflow-x-auto">
                    <div class="flex justify-between mb-4">
                        <!-- Search Bar -->
                        <input type="text" v-model="searchQuery" placeholder="Search Employee Types"
                            class="w-1/3 px-4 py-2 border border-gray-300 rounded-md" />
                        <!-- Add Button (Plus Icon) -->
                        <button @click="openModalForAdd"
                            class="text-white bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 flex items-center">
                            <fa icon="plus">Add</fa>
                        </button>
                    </div>

                    <table class="min-w-full table-auto border-collapse border border-gray-200 text-center">
                        <thead>
                            <tr class="bg-gray-200">
                                <th class="px-4 py-2 border border-gray-300 text-center">S.No.</th>
                                <th class="px-4 py-2 border border-gray-300 text-center">Employee Type</th>
                                <th class="px-4 py-2 border border-gray-300 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- If no employee types are added yet, show a message -->
                            <tr v-if="employeeTypes.length === 0">
                                <td colspan="3" class="px-4 py-2 text-center text-gray-500">No employee types added yet.
                                    Please click "Add" to create one.</td>
                            </tr>
                            <!-- Filtered Employee Types based on Search Query -->
                            <tr v-for="(type, index) in filteredEmployeeTypes" :key="index">
                                <td class="px-4 py-2 border border-gray-300">{{ index + 1 }}</td>
                                <td class="px-4 py-2 border border-gray-300">{{ type }}</td>
                                <td class="px-4 py-2 border border-gray-300">
                                    <button @click="openModalForEdit(index)"
                                        class="text-blue-500 hover:text-blue-600 mr-2">
                                        <fa icon="edit">Edit</fa>
                                    </button>
                                    <button @click="openConfirmDeleteModal(index)"
                                        class="text-red-500 hover:text-red-600">
                                        <fa icon="trash-can">Delete</fa>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Modal to add or edit employee type -->
                <div v-if="isModalOpen"
                    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div class="bg-white p-6 rounded-md w-96">
                        <h3 class="text-lg font-semibold mb-4">{{ isEditing ? 'Edit Employee Type' : 'Enter Employee Type' }}</h3>
                        <!-- Input to enter a custom employee type -->
                        <input v-model="selectedType" type="text" placeholder="Enter employee type"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md" />

                        <div class="mt-4 flex justify-center">
                            <!-- Button Text Conditionally Rendered -->
                            <button @click="isEditing ? saveEmployeeType() : addEmployeeType()"
                                class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                                {{ isEditing ? 'Save' : 'Add' }} 
                            </button>
                            <button @click="closeModal"
                                class="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 ml-2">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Delete Confirmation Modal -->
                <div v-if="isConfirmDeleteOpen"
                    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div class="bg-white p-6 rounded-md w-96">
                        <h3 class="text-lg font-semibold mb-4">Are you sure you want to delete this employee type?</h3>
                        <div class="mt-4 flex justify-center">
                            <button @click="deleteEmployeeType(deleteConfirmIndex)"
                                class="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700">
                                Yes, Delete
                            </button>
                            <button @click="closeConfirmDeleteModal"
                                class="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 ml-2">
                                Cancel
                            </button>
                        </div>
                    </div>
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
            isModalOpen: false,
            selectedType: '',
            employeeTypes: [],
            searchQuery: '',
            editingIndex: null,
            isEditing: false, 
            showSuccessMessage: false, 
            successMessageTimeout: null, 
            isConfirmDeleteOpen: false, 
            deleteConfirmIndex: null, 
        };
    },
    mounted() {
        const storedTypes = JSON.parse(localStorage.getItem('employeeTypes')) || [];
        this.employeeTypes = storedTypes;
    },
    computed: {
        filteredEmployeeTypes() {
            return this.employeeTypes.filter(type => type.toLowerCase().includes(this.searchQuery.toLowerCase()));
        }
    },
    methods: {

        openModalForAdd() {
            this.isModalOpen = true;
            this.selectedType = ''; // Reset the input field for adding
            this.isEditing = false;  // Set to add mode
        },

        openModalForEdit(index) {
            this.isModalOpen = true;
            this.selectedType = this.employeeTypes[index]; // Prefill the input with the selected type
            this.editingIndex = index;
            this.isEditing = true; // Set to edit mode
        },

        closeModal() {
            this.isModalOpen = false;
            this.selectedType = ''; // Reset the input field
            this.isEditing = false;  // Reset edit mode
            if (this.successMessageTimeout) {
                clearTimeout(this.successMessageTimeout);
            }
            this.showSuccessMessage = false; // Hide success message
        },

        addEmployeeType() {
            if (this.selectedType.trim()) {
                // Add the employee type to the list and update localStorage
                this.employeeTypes.push(this.selectedType.trim());
                localStorage.setItem('employeeTypes', JSON.stringify(this.employeeTypes));

                // Show success message and set a timeout to hide it
                this.showSuccessMessage = true;
                this.successMessageTimeout = setTimeout(() => {
                    this.showSuccessMessage = false;
                }, 3000); // Hide after 3 seconds

                // Close the modal and reset the input field
                this.closeModal();
            } else {
                alert('Please enter a valid employee type.');
            }
        },

        saveEmployeeType() {
            if (this.selectedType.trim()) {
                // Save the edited employee type
                this.employeeTypes[this.editingIndex] = this.selectedType.trim();
                localStorage.setItem('employeeTypes', JSON.stringify(this.employeeTypes));

                // Show success message and set a timeout to hide it
                this.showSuccessMessage = true;
                this.successMessageTimeout = setTimeout(() => {
                    this.showSuccessMessage = false;
                }, 3000); // Hide after 3 seconds

                // Close the modal and reset the input field
                this.closeModal();
            } else {
                alert('Please enter a valid employee type.');
            }
        },

        openConfirmDeleteModal(index) {
            this.deleteConfirmIndex = index;
            this.isConfirmDeleteOpen = true;
        },

        closeConfirmDeleteModal() {
            this.isConfirmDeleteOpen = false;
            this.deleteConfirmIndex = null;
        },

        deleteEmployeeType(index) {
            this.employeeTypes.splice(index, 1); // Remove the employee type from the list
            localStorage.setItem('employeeTypes', JSON.stringify(this.employeeTypes));

            // Close the confirmation modal
            this.closeConfirmDeleteModal();
        }
    }
};
</script>
