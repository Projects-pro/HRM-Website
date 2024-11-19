<template>
    <div class="flex justify-center items-center w-screen">
        <div>
            <Layout :issidebar="true" />
        </div>
        <div class="w-full flex-col h-screen overflow-y-auto">
            <div>
                <Layout :isheader="true" />
            </div>
            <div class="max-w-full m-5 sm:m-10 lg:m-14 2xl:m-14">
                <h1 class="text-3xl font-bold mb-6 text-center mt-[70px] text-gray-800">Attendance Report</h1>
                <div class="bg-gray-200 p-6 rounded-lg shadow-md mb-8">
                    <div class="mb-4">
                        <label for="start-date" class="block mb-2 font-medium">Start Date:</label>
                        <input type="date" id="start-date" v-model="startDate" class="border p-2 rounded w-full" />
                    </div>

                    <div class="mb-4">
                        <label for="end-date" class="block mb-2 font-medium">End Date:</label>
                        <input type="date" id="end-date" v-model="endDate" class="border p-2 rounded w-full" />
                    </div>

                    <!-- Employee Type (Daily, Monthly, Hourly) -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-600 mb-1">Employee Type</label>
                        <select v-model="employeeType" class="border border-gray-300 rounded-md p-2 w-full">
                            <option value="" disabled>Select Employee Type</option>
                            <option v-for="type in employeeTypes" :key="type" :value="type">
                                {{ type }}
                            </option>
                        </select>
                    </div>

                    <div class="flex justify-center">
                        <button class="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded" @click="searchAttendance">
                            Search
                        </button> &nbsp; &nbsp; &nbsp;
                        <button class="bg-black hover:bg-blue-800 text-white px-4 py-2 rounded" @click="reset">
                            Reset
                        </button>
                    </div>

                    <!-- Attendance Legend -->
                    <div class="mt-6 mb-4">
                        <p class="font-semibold text-lg mb-2">Attendance Icons:</p>
                        <div class="flex space-x-6">
                            <div class="flex items-center">
                                <fa icon="check-circle" class="text-green-500 mr-2" />
                                <span>Present</span>
                            </div>
                            <div class="flex items-center">
                                <fa icon="adjust" class="text-yellow-500 mr-2" />
                                <span>Half Day</span>
                            </div>
                            <div class="flex items-center">
                                <fa icon="times-circle" class="text-red-500 mr-2" />
                                <span>Absent</span>
                            </div>
                            <div class="flex items-center">
                                <fa icon="calendar-xmark" class="text-gray-500 mr-2" />
                                <span>Weekend</span>
                            </div>
                            <div class="flex items-center">
                                <fa icon="star" class="text-purple-500 mr-2" />
                                <span>Holidays</span>
                            </div>
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
            startDate: this.getCurrentMonthStart(),
            endDate: this.getCurrentMonthEnd(),
            employeeType: '', // Set initial employeeType to empty
            employeeTypes: [], // Holds employee types from local storage
        };
    },
    created() {
        this.loadEmployeeTypes();
    },
    methods: {
        loadEmployeeTypes() {
            const storedEmployeeTypes = localStorage.getItem('employeeTypes');
            if (storedEmployeeTypes) {
                this.employeeTypes = JSON.parse(storedEmployeeTypes);
            }
        },
        searchAttendance() {
            if (!this.startDate || !this.endDate) return;

            this.$router.push({
                name: 'Monthlytable',
                query: {
                    startDate: this.startDate,
                    endDate: this.endDate,
                    employeeType: this.employeeType,
                },
            });
        },
        printReport() {
            window.print();
        },
        getCurrentMonthStart() {
            const date = new Date();
            date.setDate(1);
            return date.toISOString().split('T')[0];
        },
        getCurrentMonthEnd() {
            const date = new Date();
            date.setMonth(date.getMonth() + 1);
            date.setDate(0);
            return date.toISOString().split('T')[0];
        },
        reset() {
            this.startDate = '';
            this.endDate = '';
            this.employeeType = ''; // Reset employeeType
        },
    }
};
</script>
