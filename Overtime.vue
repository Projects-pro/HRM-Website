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
            <!-- Overtime Details Tab Content -->
            <div class="flex justify-between mb-4">
                <input type="text" placeholder="Search Employee Name" v-model="searchEmployee"
                class="border border-gray-300 rounded-md py-2 px-4 w-1/4" />
                <button @click="openMarkOvertimeModal" class="bg-orange-500 text-white px-4 py-2 rounded">Mark
                    OverTime</button>
            </div>
            <table class="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                    <tr class="bg-gray-100 text-gray-700">
                        <th class="py-2 px-4 text-left">S.No</th>
                        <th class="py-2 px-4 text-left">Emp ID</th>
                        <th class="py-2 px-4 text-left">Emp Name</th>
                        <th class="py-2 px-4 text-left">Date</th>
                        <th class="py-2 px-4 text-left">OT Type</th>
                        <th class="py-2 px-4 text-left">Hours</th>
                        <th class="py-2 px-4 text-left">OT Salary</th>
                        <th class="py-2 px-4 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in filteredOvertimeDetails" :key="item.employeeID"
                        :class="{ 'bg-white': index % 2 === 0, 'bg-fuchsia-100': index % 2 !== 0 }">
                        <td class="py-2 px-4">{{ index + 1 }}</td>
                        <td class="py-2 px-4">{{ item.employeeID }}</td>
                        <td class="py-2 px-4">{{ item.name }}</td>
                        <td class="py-2 px-4">{{ item.date }}</td>
                        <td class="py-2 px-4">{{ item.otType }}</td>
                        <td class="py-2 px-4">{{ item.hours }}</td>
                        <td class="py-2 px-4">{{ item.otSalary }}</td>
                        <td class="py-2 px-4">
                            <div class="tooltip-container">
                                <fa icon="pen-to-square" @click="openEditOvertimeDetailsModal(item)"
                                    class="text-blue-500 hover:text-blue-700" />
                                <span class="tooltip">Edit</span>
                            </div>
                            <div class="tooltip-container">
                                <fa icon="trash-can" @click="openDeleteOvertimeDetailsModal(item)"
                                    class="text-red-500 hover:text-red-700 ml-4" />
                                <span class="tooltip">Delete</span>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="filteredOvertimeDetails.length === 0">
                        <td colspan="7" class="py-4 text-center text-gray-500">No items available</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Mark Overtime Modal -->
        <div v-if="showMarkOvertimeModal"
            class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div class="bg-white rounded-lg p-6 mt-[53px] w-5/12">
                <h2 class="text-xl text-center font-semibold mb-4">Mark Overtime Attendance</h2>
                <form @submit.prevent="markOvertime" class="block text-gray-700">

                    <!-- Employee ID and Name -->
                    <div class="mb-4">
                        <label class="block text-gray-700">Employee Name & ID : &nbsp;
                            <fa icon="arrows-rotate" @click="resetLabel" />
                        </label>
                        <div class="relative">
                            <div class="flex items-center border bg-white p-2 rounded w-full cursor-pointer"
                                @click="toggleDropdown">
                                <span>{{ selectedEmployeeNames.length > 0 ? selectedEmployeeNames.join(', ')
                                    : 'Select Employees' }}</span>
                            </div>
                            <div v-if="dropdownOpen" class="absolute bg-white border rounded mt-1 z-10 w-full">
                                <div class="p-2">
                                    <input type="text" v-model="searchQuery" placeholder="Search Employee..."
                                        class="border p-1 rounded w-full mb-2" />
                                    <div class="flex items-center">
                                        <input type="checkbox" id="select-all" @change="toggleSelectAll"
                                            v-model="selectAll" />
                                        <label for="select-all" class="ml-2">Select All</label>
                                    </div>
                                </div>
                                <div v-for="employee in filteredEmployees" :key="employee.employeeID" class="p-2">
                                    <input type="checkbox" :id="'employee' + employee.employeeID"
                                        :value="employee.employeeID" v-model="selectedEmployeeIds" />
                                    <label :for="'employee' + employee.employeeID" class="ml-2">{{
                                        employee.employeeID }} - {{ employee.name }}</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Date -->
                    <div class="mb-4">
                        <label class="block text-gray-700">Date:</label>
                        <input v-model="markOvertimeData.date" type="date" class="w-full px-4 py-2 border rounded-lg"
                            required />
                    </div>

                    <!-- OT Type and Hours Type -->
                    <div class="flex mb-4 space-x-4">
                        <div class="flex-1">
                            <label class="block text-gray-700">OT Type:</label>
                            <select v-model="markOvertimeData.otType" class="w-full px-4 py-2 border rounded-lg"
                                required>
                                <option value="" disabled>Select OT Type</option>
                                <option v-for="type in overtimeTypes" :key="type" :value="type">{{ type }}</option>
                            </select>
                        </div>
                    </div>

                    <!-- OT Salary and Hours -->
                    <div class="flex mb-4 space-x-4">
                        <div class="flex-1">
                            <label class="block text-gray-700">Hours:</label>
                            <input v-model="markOvertimeData.hours" type="number"
                                class="w-full px-4 py-2 border rounded-lg" placeholder="Enter Hours" required />
                        </div>
                        <!-- OT Salary -->
                        <div class="flex-1">
                            <label class="block text-gray-700">OT Salary:</label>
                            <input v-model="calculatedOTSalary" type="number" class="w-full px-4 py-2 border rounded-lg"
                                readonly />
                        </div>

                    </div>

                    <!-- Submit Button -->
                    <div class="mt-4 text-center">
                        <button @click="showMarkOvertimeModal = false"
                            class="bg-red-500 text-white px-4 py-2 rounded ml-2">Cancel</button>&nbsp;
                        <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Edit Overtime Modal -->
        <div v-if="showEditOvertimeModal"
            class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div class="bg-white rounded-lg p-6 mt-[53px] w-5/12">
                <h2 class="text-xl text-center font-semibold mb-4">Edit Overtime Details</h2>
                <form @submit.prevent="updateOvertimeDetails" class="block text-gray-700">
                    <!-- Fields for Employee Data -->
                    <div class="mb-4">
                        <label class="block text-gray-700">Emp ID:</label>
                        <input v-model="editData.empId" type="text" class="w-full px-4 py-2 border rounded-lg"
                            readonly />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Emp Name:</label>
                        <input v-model="editData.empName" type="text" class="w-full px-4 py-2 border rounded-lg"
                            readonly />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Date:</label>
                        <input v-model="editData.date" type="text" class="w-full px-4 py-2 border rounded-lg"
                            required />
                    </div>
                    <div class="flex mb-4 space-x-4">
                        <div class="flex-1">
                            <label class="block text-gray-700">OT Type:</label>
                            <select v-model="editData.otType" class="w-full px-4 py-2 border rounded-lg" required>
                                <option value="" disabled>Select OT Type</option>
                                <option v-for="type in overtimeTypes" :key="type" :value="type">{{ type }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex mb-4 space-x-4">
                        <div class="flex-1">
                            <label class="block text-gray-700">Hours:</label>
                            <input v-model="editData.hours" type="number" class="w-full px-4 py-2 border rounded-lg"
                                required />
                        </div>
                        <!-- OT Salary -->
                        <div class="flex-1">
                            <label class="block text-gray-700">OT Salary:</label>
                            <input v-model="calculatedOTSalary" type="number" class="w-full px-4 py-2 border rounded-lg"
                                readonly />
                        </div>

                    </div>
                    <div class="mt-4 text-center">
                        <button @click="showEditOvertimeModal = false"
                            class="bg-red-500 text-white px-4 py-2 rounded ml-2">Cancel</button>&nbsp;
                        <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteConfirmation"
            class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div class="bg-white rounded-lg p-6 mt-[53px] w-5/12">
                <h2 class="text-xl text-center font-semibold mb-4">Confirm Deletion</h2>
                <p class="text-center">Are you sure you want to delete this entry?</p>
                <div class="mt-4 text-center">
                    <button @click="confirmDelete" class="bg-red-500 text-white px-4 py-2 rounded ml-2">Yes</button>
                    <button @click="showDeleteConfirmation = false"
                        class="bg-gray-300 text-black px-4 py-2 rounded">No</button>
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
            showDeleteConfirmation: false,
            itemToDelete: null,
            searchEmployee: '',
            overtimeDetails: [], // Initialize as an empty array
            showMarkOvertimeModal: false,
            markOvertimeData: { empId: '', empName: '', date: '', otType: '', hours: '', otSalary: '' },
            employees: Array.isArray(JSON.parse(localStorage.getItem('employees')))
                ? JSON.parse(localStorage.getItem('employees'))
                : Object.values(JSON.parse(localStorage.getItem('employees')) || {}),
            searchQuery: '',
            dropdownOpen: false,
            selectedEmployees: [],
            selectAll: false,
            showEditOvertimeModal: false,
            editData: { empId: '', empName: '', date: '', otType: '', hours: '', otSalary: '' },
            overtimeTypes: [],
            selectedEmployeeIds: [],
        };
    },
    computed: {
        selectedEmployeeNames() {
            this.dropdownOpen = false;
            return this.employees
                .filter(emp => this.selectedEmployeeIds.includes(emp.employeeID)) // Use employeeID instead of id
                .map(emp => emp.name);
        },
        filteredEmployees() {
            return this.employees.filter(employee =>
                employee.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        filteredOvertimeDetails() {
            return this.overtimeDetails.filter(detail =>
                detail.name && detail.name.toLowerCase().includes(this.searchEmployee.toLowerCase())
            );
        },
        calculatedOTSalary() {
            const selectedType = this.markOvertimeData.otType;
            const hours = this.markOvertimeData.hours;
            const entry = this.overtimeEntries.find(entry => entry.otType === selectedType);
            if (entry && hours) {
                return entry.rate * hours; // Calculate the salary
            }
            return 0; // Default if no type or hours entered
        },


    },
    methods: {
        resetLabel() {
            this.selectedEmployeeIds = [];
            this.dropdownOpen = false;
            this.selectAll = false;
        },
        formatDateToInput(dateString) {
            const parts = dateString.split('-');
            return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert dd-MM-yyyy to yyyy-MM-dd
        },

        toggleDropdown() {
            this.dropdownOpen = !this.dropdownOpen;
        },
        selectEmployee(employee) {
            if (!this.selectedEmployees.some(emp => emp.id === employee.id)) {
                this.selectedEmployees.push(employee);
                this.markOvertimeData.empId = employee.id;
            }
            this.dropdownOpen = false;
        },
        toggleSelectAll() {
            if (this.selectAll) {
                this.selectedEmployeeIds = this.employees.map(employee => employee.employeeID);
            } else {
                this.selectedEmployeeIds = [];
            }
        },
        openMarkOvertimeModal() {
            this.showMarkOvertimeModal = true;
        },
        markOvertime() {
            const formattedDate = this.formatDate(this.markOvertimeData.date);
            const overtimeData = {
                employeeID: this.selectedEmployeeIds.join(', '),
                name: this.selectedEmployeeNames.join(', '),
                date: formattedDate,
                otType: this.markOvertimeData.otType,
                hours: this.markOvertimeData.hours,
                otSalary: this.calculatedOTSalary,
            };
            this.overtimeDetails.push(overtimeData);
            this.saveToLocalStorage(); // Save to localStorage
            this.showMarkOvertimeModal = false;
            this.resetMarkOvertimeData();
        },
        resetMarkOvertimeData() {
            this.markOvertimeData = { empId: '', empName: '', date: '', otType: '', hours: '', otSalary: '' };
            this.selectedEmployeeIds = [];
        },
        formatDate(dateString) {
            const parts = dateString.split('-');
            return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert yyyy-MM-dd to dd-MM-yyyy
        },
        saveToLocalStorage() {
            const dataToStore = {
                overtimeTypes: this.overtimeTypes,
                overtimeEntries: this.overtimeEntries,
                overtimeDetails: this.overtimeDetails, // Ensure this is the updated array
            };
            localStorage.setItem('overtimeData', JSON.stringify(dataToStore));
        },

        openEditOvertimeDetailsModal(item) {
            this.editData = { ...item };
            this.showEditOvertimeModal = true;
        },
        updateOvertimeDetails() {
            const formattedDate = this.formatDate(this.editData.date); // Format date as needed
            const index = this.overtimeDetails.findIndex(o => o.empId === this.editData.empId && o.date === formattedDate);

            if (index !== -1) {
                // Update the existing entry
                this.overtimeDetails[index] = {
                    ...this.editData,
                    date: formattedDate // Ensure date is formatted
                };

                // Save the updated details to local storage
                this.saveToLocalStorage();
            }

            this.showEditOvertimeModal = false;
            this.fetchOvertimeDetails(); // Refresh the table data
        },

        fetchOvertimeDetails() {
            const storedData = JSON.parse(localStorage.getItem('overtimeData')) || {
                overtimeDetails: [],
                overtimeTypes: [],
            };
            this.overtimeDetails = storedData.overtimeDetails; // Assign to overtimeDetails
        },
        confirmDelete() {
            this.overtimeDetails = this.overtimeDetails.filter(
                item => item.empId !== this.itemToDelete.empId || item.date !== this.itemToDelete.date
            );
            this.saveToLocalStorage();
            this.showDeleteConfirmation = false;
            this.itemToDelete = null; // Clear the item to delete
        },
        openDeleteOvertimeDetailsModal(item) {
            this.itemToDelete = item;
            this.showDeleteConfirmation = true;
        },
        fetchEmployees() {
            const storedEmployees = JSON.parse(localStorage.getItem("employees")) || {};
            this.employees = Object.values(storedEmployees)
                .filter(employee => employee.isActive === "Active") // Filter for active employees
                .sort((a, b) => a.employeeID.localeCompare(b.employeeID)); // Sort by employeeID
        },
    },
    created() {
        this.fetchEmployees();
        const storedData = JSON.parse(localStorage.getItem('overtimeData')) || {
            overtimeEntries: [],
            overtimeDetails: [],
            overtimeTypes: [],
        };

        this.overtimeEntries = storedData.overtimeEntries || [];
        this.overtimeDetails = storedData.overtimeDetails || [];
        this.overtimeTypes = storedData.overtimeTypes || [];
    },

    mounted() {
        this.fetchOvertimeDetails();
    }

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
    /* Adjust according to your needs */
    left: 50%;
    margin-left: -30px;
}

.tooltip-container:hover .tooltip {
    visibility: visible;
}
</style>