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
                <h1 class="text-3xl font-bold mb-6 text-center mt-[70px] text-gray-800">Overtime Management</h1>

                <!-- Overtime Tab Content -->
                <div class="flex justify-between mb-4">
                    <input type="text" placeholder="Search OT Type" v-model="searchOTType"
                    class="border border-gray-300 rounded-md py-2 px-4 w-1/4" />
                    <button @click="openAddOvertimeModal" class="bg-orange-500 text-white px-4 py-2 rounded">Add
                        OverTime</button>
                </div>
                <table class="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr class="bg-gray-100 text-gray-700">
                            <th class="py-2 px-4 text-left">S.No</th>
                            <th class="py-2 px-4 text-left">OT Type</th>
                            <th class="py-2 px-4 text-left">Hours</th>
                            <th class="py-2 px-4 text-left">Rate(Rs)</th>
                            <th class="py-2 px-4 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in filteredOvertimeItems" :key="item.otType"
                            :class="{ 'bg-white': index % 2 === 0, 'bg-fuchsia-100': index % 2 !== 0 }">
                            <td class="py-2 px-4">{{ index + 1 }}</td>
                            <td class="py-2 px-4">{{ item.otType }}</td>
                            <td class="py-2 px-4">{{ item.hours }}</td>
                            <td class="py-2 px-4">{{ item.rate }}</td>
                            <td class="py-2 px-4">
                                <div class="tooltip-container">
                                    <fa icon="pen-to-square" @click="openEditOvertimeModal(item)"
                                        class="text-blue-500 hover:text-blue-700" />
                                    <span class="tooltip">Edit</span>
                                </div>
                                <div class="tooltip-container">
                                    <fa icon="trash-can" @click="openDeleteOvertimeModal(item)"
                                        class="text-red-500 hover:text-red-700 ml-4" />
                                    <span class="tooltip">Delete</span>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filteredOvertimeItems.length === 0">
                            <td colspan="5" class="py-4 text-center text-gray-500">No items available</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Overtime Add Modal -->
            <div v-if="showAddModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div class="bg-white rounded-lg p-6 mt-[53px] w-5/12">
                    <h2 class="text-xl text-center font-semibold mb-4">Add Overtime Types</h2>
                    <form @submit.prevent="addOvertime1" class="block text-gray-700">

                        <!-- OT Type -->
                        <div class="mb-4 w-12/12  items-center justify-between">
                            <label class="block text-gray-700">OT Type:</label>
                            <div class="flex items-center space-x-3">
                                <select v-model="newOvertime.otType" class="w-full px-4 py-2 border rounded-lg mr-2"
                                    required>
                                    <option value="" disabled>Select the OT type</option>
                                    <option v-for="type in overtimeTypes" :key="type" :value="type">{{ type }}</option>
                                </select>
                                <fa icon="plus" @click.prevent="openAddOTTypeModal"
                                    class="bg-blue-500 text-white px-2 py-1 rounded" />
                            </div>
                        </div>

                        <!-- OT Hours -->
                        <div class="mb-4">
                            <label class="block text-gray-700">OT Hours:</label>
                            <input v-model="newOvertime.hours" type="number" class="w-full px-4 py-2 border rounded-lg"
                                placeholder="Enter Hours" required />
                        </div>

                        <!-- Rate Input -->
                        <div class="mb-4">
                            <label class="block text-gray-700">Rate</label>
                            <div class="flex items-center">
                                <input v-model="newOvertime.rate" type="number"
                                    class="w-full px-4 py-2 border rounded-lg" placeholder="Enter Rate" required />
                            </div>
                        </div>


                        <!-- Submit Button -->
                        <div class="mt-4 text-center">
                            <button @click="showAddModal = false"
                                class="bg-red-500 text-white px-4 py-2 rounded ml-2">Cancel</button>&nbsp;
                            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Add OT Type Modal -->
            <div v-if="showOTTypeModal"
                class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div class="bg-white rounded-lg p-6 mt-[53px] w-5/12">
                    <h2 class="text-xl text-center font-semibold mb-4">Add New OT Type</h2>
                    <form @submit.prevent="addOTType" class="block text-gray-700">
                        <div class="mb-4">
                            <label class="block text-gray-700">OT Type Name</label>
                            <input v-model="newOTType" type="text" class="w-full px-4 py-2 border rounded-lg"
                                placeholder="Enter new OT type" required />
                        </div>
                        <div class="mt-4 text-center">
                            <button @click="showOTTypeModal = false"
                                class="bg-red-500 text-white px-4 py-2 rounded ml-2">Cancel</button>&nbsp;
                            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Add</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Edit Overtime Modal -->
            <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div class="bg-white rounded-lg p-6 mt-[53px] w-5/12">
                    <h2 class="text-xl text-center font-semibold mb-4">Edit Overtime Type</h2>
                    <form @submit.prevent="updateOvertime" class="block text-gray-700">

                        <!-- OT Type -->
                        <div class="mb-4">
                            <label class="block text-gray-700">OT Type:</label>
                            <p class="px-4 py-2 border rounded-lg bg-gray-200">{{ selectedOvertime.otType }}</p>
                        </div>

                        <!-- OT Hours -->
                        <div class="mb-4">
                            <label class="block text-gray-700">Hours:</label>
                            <input v-model="selectedOvertime.hours" type="number"
                                class="w-full px-4 py-2 border rounded-lg" placeholder="Enter Hours" required />
                        </div>

                        <!-- Rate Input -->
                        <div class="mb-4">
                            <label class="block text-gray-700">Rate</label>
                            <div class="flex items-center">
                                <input v-model="selectedOvertime.rate" type="number"
                                    class="w-full px-4 py-2 border rounded-lg" placeholder="Enter Rate" required />
                            </div>
                        </div>


                        <!-- Submit Button -->
                        <div class="mt-4 text-center">
                            <button @click="showEditModal = false"
                                class="bg-red-500 text-white px-4 py-2 rounded ml-2">Cancel</button>&nbsp;
                            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Delete Confirmation Modal -->
            <div v-if="showDeleteConfirmationModal"
                class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div class="bg-white rounded-lg p-6 mt-[53px] w-5/12">
                    <h2 class="text-xl text-center font-semibold mb-4">Delete Overtime Entry</h2>
                    <p class="text-center">Are you sure you want to delete {{ selectedOvertime.otType }}?</p>
                    <div class="mt-4 text-center">
                        <button @click="showDeleteConfirmationModal = false"
                            class="bg-red-500 text-white px-4 py-2 rounded ml-2">Cancel</button>&nbsp;
                        <button @click="deleteOvertime"
                            class="bg-green-500 text-white px-4 py-2 rounded">Delete</button>
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
            searchOTType: '',
            overtimeItems: [],
            newOvertime: { otType: '', hours: '', rate: '' },
            showAddModal: false,
            showOTTypeModal: false,
            selectedOTType: '',
            newOTType: '',
            overtimeTypes: [],
            overtimeEntries: [],
            showEditModal: false,
            selectedOvertime: {},
            showDeleteConfirmationModal: false,
        };
    },
    computed: {
        filteredOvertimeItems() {
            return this.overtimeEntries.filter(item =>
                item.otType && item.otType.toLowerCase().includes(this.searchOTType.toLowerCase())
            );
        }
    },
    methods: {
        openAddOvertimeModal() {
            this.showAddModal = true;
        },
        openAddOTTypeModal() {
            this.showOTTypeModal = true;
        },
        addOvertime1() {
            if (this.newOvertime.otType && this.newOvertime.hours && this.newOvertime.rate) {
                const newEntry = {
                    otType: this.newOvertime.otType,
                    hours: this.newOvertime.hours,
                    rate: this.newOvertime.rate,
                };
                this.overtimeEntries.push(newEntry); // Add to overtimeEntries
                this.saveToLocalStorage(); // Save to localStorage
                this.newOvertime = { otType: '', hours: '', rate: '' };
                this.showAddModal = false;
            }
        },
        saveToLocalStorage() {
            const dataToStore = {
                overtimeTypes: this.overtimeTypes,
                overtimeEntries: this.overtimeEntries,
                overtimeDetails: this.overtimeDetails // Make sure to include this if needed
            };
            localStorage.setItem('overtimeData', JSON.stringify(dataToStore));
        },
        addOTType() {
            if (this.newOTType) {
                this.overtimeTypes.push(this.newOTType);
                this.saveToLocalStorage();
                this.newOTType = ''; // Clear input
                this.showOTTypeModal = false; // Close modal
            }
        },
        openEditOvertimeModal(item) {
            this.selectedOvertime = { ...item };  // Make a copy
            this.showEditModal = true;
        },
        updateOvertime() {
            const index = this.overtimeEntries.findIndex(entry => entry.otType === this.selectedOvertime.otType);
            if (index > -1) {
                this.overtimeEntries[index] = { ...this.selectedOvertime };
                this.saveToLocalStorage();
                this.showEditModal = false;  // Close modal
            }
        },
        openDeleteOvertimeModal(item) {
            this.selectedOvertime = { ...item };  // Create a copy of the selected item
            this.showDeleteConfirmationModal = true;
        },
        deleteOvertime() {
            const index = this.overtimeEntries.findIndex(entry => entry.otType === this.selectedOvertime.otType);
            if (index > -1) {
                // Remove from overtimeEntries
                this.overtimeEntries.splice(index, 1);

                // Remove from overtimeTypes if it exists
                const typeIndex = this.overtimeTypes.indexOf(this.selectedOvertime.otType);
                if (typeIndex > -1) {
                    this.overtimeTypes.splice(typeIndex, 1);
                }

                // Save to localStorage
                this.saveToLocalStorage();

                // Close the confirmation modal
                this.showDeleteConfirmationModal = false;
            }
        },
    },
    created() {
        const storedData = JSON.parse(localStorage.getItem('overtimeData')) || {
            overtimeEntries: [],
            overtimeDetails: [],
            overtimeTypes: [],
        };

        this.overtimeEntries = storedData.overtimeEntries || []; // Initialize correctly
        this.overtimeDetails = storedData.overtimeDetails || []; // Ensure it's initialized
        this.overtimeTypes = storedData.overtimeTypes || []; // Ensure this is also fetched
    },

};
</script>

<style scoped>
.tooltip-container {
    position: relative;
    display: inline-block;
}

.tooltip {
    visibility: hidden;
    width: 60px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -30px;
}

.tooltip-container:hover .tooltip {
    visibility: visible;
}
</style>
