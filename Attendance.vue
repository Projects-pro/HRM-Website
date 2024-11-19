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
                <h1 class="text-3xl font-bold mb-6 text-center mt-[70px] text-gray-800">Employee Attendance</h1>

                <!-- Employee Form -->
                <div class="bg-gray-200 p-6 rounded-lg shadow-md mb-8">
                    <form @submit.prevent="submitForm">
                        <div>
                            <!-- Employee name & ID Selection -->
                            <label class="block mb-2 font-semibold text-black">Employee Name & ID:
                                <fa icon='rotate-right' @click="resetsearch"
                                    class="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer" />
                            </label>

                            <div class="w-full">
                                <div class="mt-2 block w-full bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer"
                                    @click="toggleDropdown">
                                    {{ selectedEmployeeNames.length > 0 ? selectedEmployeeNames.join(', ') : 'Select Employees'
                                    }}
                                </div>
                                <div v-if="dropdownOpen"
                                    class="bg-white border border-gray-300 rounded-md w-full shadow-lg">
                                    <div class="p-2">
                                        <!-- Search bar -->
                                        <input type="text" placeholder="Search Employee..." v-model="search"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                        <!-- Select all -->
                                        <input type="checkbox" id="select-all" @change="toggleSelectAll"
                                            v-model="selectAll" />
                                        <label for="select-all" class="ml-2 text-gray-700">Select All</label>
                                    </div>
                                    <div v-for="employee in filteredEmployees" :key="employee.employeeID" class="p-2">
                                        <input type="checkbox" :id="'employee' + employee.employeeID"
                                            :value="employee.employeeID" v-model="selectedEmployeeIds" />
                                        <label :for="'employee' + employee.employeeID" class="ml-2 text-gray-700">
                                            {{ employee.employeeID }} - {{ employee.name || 'Unnamed' }}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br>

                        <!-- Date selection -->
                        <div class="mb-4">
                            <label for="newDate" class="block text-lg font-semibold text-gray-700">Date</label>
                            <input v-model="selectedDate" id="newDate" type="date"
                                class="mt-2 block w-full bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer"
                                @change="updateDay" required /> <br>
                            <span class="font-medium">Day:</span> <span>{{ selectedDay }}</span>
                            <p v-if="isFutureDate" class="text-red-600">Future dates are not allowed.</p>
                            <div v-if="isBeforeJoiningDate" class="text-red-600">{{ errorMessage }}</div>
                        </div>

                        <!-- Status Selection -->
                        <div class="mt-4 space-y-4">
                            <span class="block text-lg font-semibold text-gray-700">Status
                                <fa icon='rotate-right' @click="resetStatus"
                                    class="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer" />
                            </span>
                            <div class="flex flex-wrap gap-4">
                                <label class="inline-flex items-center text-gray-700">
                                    <input type="radio" v-model="selectedStatus" value="Present" required
                                        class="form-radio text-blue-600"
                                        :disabled="isFutureDate || isBeforeJoiningDate" />
                                    <span class="ml-2"> Present</span>
                                </label>
                                <label class="inline-flex items-center text-gray-700">
                                    <input type="radio" v-model="selectedStatus" value="Absent"
                                        class="form-radio text-red-600"
                                        :disabled="isFutureDate || isBeforeJoiningDate" />
                                    <span class="ml-2">Absent</span>
                                </label>
                                <label class="inline-flex items-center text-gray-700">
                                    <input type="radio" v-model="selectedStatus" value="HalfDay"
                                        class="form-radio text-yellow-500"
                                        :disabled="isFutureDate || isBeforeJoiningDate" />
                                    <span class="ml-2">Half Day</span>
                                </label>
                            </div>
                        </div>
                        <br>
                        <!-- In Time & Out Time Section (Side by Side) -->
                        <div class="flex space-x-4">
                            <!-- In Time Section -->
                            <div class="flex-1 border p-4 bg-white rounded-md shadow-lg">
                                <span class="block text-lg font-semibold text-gray-700">In Time
                                    <fa icon='rotate-right' @click="resetIn"
                                        class="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer" />
                                </span><br>
                                <div class="flex space-x-2">
                                    <!-- Hours Dropdown -->
                                    <select v-model="inHours" @click="setCurrentTime('in')"
                                        :disabled="!selectedDate || isFutureDate"
                                        class="border rounded px-2 py-1 mb-4 w-1/4 rounded-md bg-gray-100 focus:bg-white focus:outline-none">
                                        <option disabled value="">Hours</option>
                                        <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
                                    </select>
                                    <!-- Minutes Dropdown -->
                                    <select v-model="inMinutes" @click="setCurrentTime('in')"
                                        :disabled="!selectedDate || isFutureDate"
                                        class="border rounded px-2 py-1 mb-4 w-1/4 rounded-md bg-gray-100 focus:bg-white focus:outline-none">
                                        <option disabled value="">Minutes</option>
                                        <option v-for="minute in minutes" :key="minute" :value="minute">{{ minute }}
                                        </option>
                                    </select>
                                    <!-- AM/PM Dropdown -->
                                    <select v-model="inPeriod" @click="setCurrentTime('in')"
                                        :disabled="!selectedDate || isFutureDate"
                                        class="border rounded px-2 py-1 mb-4 w-1/4 rounded-md bg-gray-100 focus:bg-white focus:outline-none">
                                        <option disabled value="">Period</option>
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Out Time Section -->
                            <div class="flex-1 border p-4 bg-white rounded-md shadow-lg">
                                <span class="block text-lg font-semibold text-gray-700">Out Time
                                    <fa icon='rotate-right' @click="resetOut"
                                        class="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer" />
                                </span><br>
                                <div class="flex space-x-2">
                                    <select v-model="outHours" :disabled="!selectedDate || isFutureDate"
                                        class="border rounded px-2 py-1 mb-4 w-1/4 rounded-md bg-gray-100 focus:bg-white focus:outline-none">
                                        <option disabled value="">Hours</option>
                                        <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
                                    </select>
                                    <select v-model="outMinutes" :disabled="!selectedDate || isFutureDate"
                                        class="border rounded px-2 py-1 mb-4 w-1/4 rounded-md bg-gray-100 focus:bg-white focus:outline-none">
                                        <option disabled value="">Minutes</option>
                                        <option v-for="minute in minutes" :key="minute" :value="minute">{{ minute }}
                                        </option>
                                    </select>
                                    <select v-model="outPeriod" :disabled="!selectedDate || isFutureDate"
                                        class="border rounded px-2 py-1 mb-4 w-1/4 rounded-md bg-gray-100 focus:bg-white focus:outline-none">
                                        <option disabled value="">Period</option>
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <br>

                        <!-- Buttons -->
                        <div class="flex gap-4 justify-center">
                            <button type="submit"
                                class="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                :class="{ 'hidden': selectedEmployeeIds.length === 0 || isFutureDate }">
                                Submit
                            </button>
                            <button class="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded"
                                @click="markAll('Present')"
                                :class="{ 'hidden': selectedEmployeeIds.length < 2 || isFutureDate }">
                                Mark All Present
                            </button>
                            <button class="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded"
                                @click="markAll('Absent')"
                                :class="{ 'hidden': selectedEmployeeIds.length < 2 || isFutureDate }">
                                Mark All Absent
                            </button>
                            <button class="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded" @click="resetForm">
                                Reset
                            </button>
                        </div>
                    </form>
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
            selectedEmployeeId: '',
            selectedStatus: '',
            selectedEmployeeIds: [],
            dropdownOpen: false,
            selectAll: false,
            search: '',
            currentDate: this.getCurrentDate(),
            monthlyAttendance: {},
            selectedDate: null,
            selectedDay: '',
            employees: [],
            inHours: '', // In Time fields
            inMinutes: '',
            inPeriod: '',
            outHours: '', // Out Time fields
            outMinutes: '',
            outPeriod: '',
            allowPastTimes: true,
            currentTime: new Date(),
            hours: Array.from({ length: 12 }, (_, i) => (i + 1).toString()), // 1 to 12
            minutes: Array.from({ length: 60 }, (_, i) => (i < 10 ? '0' + i : i.toString())), // 00 to 59
            errorMessage: '',
        };
    },
    computed: {
        selectedEmployeeNames() {
            this.dropdownOpen = false;
            return this.employees
                .filter(emp => this.selectedEmployeeIds.includes(emp.employeeID))
                .map(emp => emp.name);
        },
        filteredEmployees() {
            return this.employees.filter(employee =>
                employee.name?.toLowerCase().includes(this.search.toLowerCase()) ||
                employee.employeeID?.toLowerCase().includes(this.search.toLowerCase())
            );
        },
        weekDays() {
            const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const todayIndex = new Date().getDay();
            const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            return week.map(day => ({
                day,
                isDisabled: day !== todayDay
            }));
        },
        isBeforeJoiningDate() {
            if (this.selectedDate) {
                const selectedDateObj = new Date(this.selectedDate);

                // Fetch employees from local storage
                const employees = JSON.parse(localStorage.getItem('employees')) || {};

                return this.selectedEmployeeIds.some(empId => {
                    const employee = employees[empId]; // Access employee directly using empId as key
                    if (employee && employee.joiningDate) { // Check if employee and joiningDate are defined
                        // Convert the employee's joining date from dd-mm-yyyy to a Date object
                        const [day, month, year] = employee.joiningDate.split('-');
                        const joiningDateObj = new Date(`${year}-${month}-${day}`);

                        // Console log to confirm joining date and selected date
                        console.log(`Employee: ${employee.name}, Employee ID: ${employee.employeeID}`);
                        console.log(`Joining Date: ${joiningDateObj}`);
                        console.log(`Selected Date: ${selectedDateObj}`);

                        return selectedDateObj < joiningDateObj;
                    }
                    return false; // Return false if the employee or joiningDate is not defined
                });
            }
            return false;
        },
        isFutureDate() {
            if (this.selectedDate) {
                const selectedDateObj = new Date(this.selectedDate);
                const today = new Date();
                return selectedDateObj > today;
            }
            return false;
        }
    },
    watch: {
        selectedDate() {
            this.updateDay();
        },
        isBeforeJoiningDate(newVal) {
            this.errorMessage = newVal ? "Selected date is before the employee's joining date." : '';
        },
        isFutureDate(newVal) {
            if (newVal) {
                this.errorMessage = "Future dates are not allowed.";
            } else if (this.isBeforeJoiningDate) {
                this.errorMessage = "Selected date is before the employee's joining date.";
            } else {
                this.errorMessage = '';
            }
        }
    },
    methods: {
        toggleDropdown() {
            this.dropdownOpen = !this.dropdownOpen;
        },
        toggleSelectAll(event) {
            if (event.target.checked) {
                this.selectedEmployeeIds = this.employees.map(emp => emp.employeeID);
            } else {
                this.selectedEmployeeIds = [];
            }
            this.dropdownOpen = false;
        },
        resetsearch() {
            this.selectAll = false;
            this.selectedEmployeeIds = [];
            this.dropdownOpen = false;
        },
        resetStatus() {
            this.selectedStatus = '';
        },
        resetIn() {
            this.inHours = '';
            this.inMinutes = '';
            this.inPeriod = '';
        },
        resetOut() {
            this.outHours = '';
            this.outMinutes = '';
            this.outPeriod = '';
        },
        getCurrentDate() {
            const today = new Date();
            const weekmap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayIndex = today.getDay();
            return `${weekmap[dayIndex]}, ${today.toLocaleDateString()}`;
        },
        setCurrentTime(type) {
            if (!this.selectedDate || this.isFutureDate) {
                return; // Only allow setting time if date is selected and not a future date
            }

            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            if (type === 'in') {
                // For In Time, set current time only when the user hasn't selected a time
                if (!this.inHours && !this.inMinutes && !this.inPeriod) {
                    this.inHours = hours > 12 ? hours - 12 : hours; // Convert to 12-hour format
                    this.inMinutes = minutes < 10 ? '0' + minutes : minutes; // Format minutes
                    this.inPeriod = hours >= 12 ? 'PM' : 'AM';
                }
            } else if (type === 'out') {
                // For Out Time, set current time only when the user hasn't selected a time
                if (!this.outHours && !this.outMinutes && !this.outPeriod) {
                    this.outHours = hours > 12 ? hours - 12 : hours;
                    this.outMinutes = minutes < 10 ? '0' + minutes : minutes;
                    this.outPeriod = hours >= 12 ? 'PM' : 'AM';
                }
            }
        },
        initializeAttendance() {
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            const attendance = {};
            days.forEach(day => {
                attendance[day] = { status: '' };
            });
            return attendance;
        },
        formatDate(date) {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0'); // Pad with zero
            const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const year = d.getFullYear();
            return `${day}-${month}-${year}`; // Format as dd/mm/yyyy
        },
        submitForm() {
            if (this.selectedEmployeeIds.length === 0 || !this.selectedStatus) {
                console.warn("No employees selected or status is empty.");
                return;
            }

            if (this.isBeforeJoiningDate) {
                this.errorMessage = "Selected date is before the employee's joining date.";
                return;
            } else {
                this.errorMessage = '';
            }

            const formattedDate = this.formatDate(this.selectedDate);
            const attendanceData = this.selectedEmployeeIds.map(empId => {
                const employee = this.employees.find(emp => emp.employeeID === empId);
                return employee ? {
                    employeeID: employee.employeeID,
                    name: employee.name,
                    date: formattedDate,
                    day: this.selectedDay,
                    status: this.selectedStatus,
                    inTime: `${this.inHours}:${this.inMinutes} ${this.inPeriod}.trim()`,
                    outTime: `${this.outHours}:${this.outMinutes} ${this.outPeriod}.trim()`,
                } : null;
            }).filter(record => record);

            let existingAttendance = JSON.parse(localStorage.getItem('attendanceData')) || [];
            attendanceData.forEach(record => {
                const index = existingAttendance.findIndex(item => item.employeeID === record.employeeID && item.date === record.date);
                if (index !== -1) {
                    existingAttendance[index] = record;
                } else {
                    existingAttendance.push(record);
                }
            });

            localStorage.setItem('attendanceData', JSON.stringify(existingAttendance));
            this.resetForm();
            this.resetIn();
            this.resetOut();
        },
        markAll(status) {
            if (!this.selectedEmployeeIds.length) return;

            const formattedDate = this.formatDate(this.selectedDate);

            const attendanceData = this.selectedEmployeeIds.map(empId => {
                const employee = this.employees.find(emp => emp.employeeID === empId);
                return employee ? {
                    employeeID: employee.employeeID, // Use employeeID here
                    name: employee.name,
                    date: formattedDate,
                    day: this.selectedDay,
                    status,
                    inTime: `${this.inHours}:${this.inMinutes} ${this.inPeriod}`,
                    outTime: `${this.outHours}:${this.outMinutes} ${this.outPeriod}`,
                } : null;
            }).filter(record => record);

            // Fetch existing attendance data from localStorage
            let existingAttendance = JSON.parse(localStorage.getItem('attendanceData')) || [];

            // Update or add each employee's attendance entry
            attendanceData.forEach(record => {
                const index = existingAttendance.findIndex(item => item.employeeID === record.employeeID && item.date === record.date);
                if (index !== -1) {
                    existingAttendance[index] = record; // Update existing record
                } else {
                    existingAttendance.push(record); // Add new record
                }
            });

            // Save updated attendance data back to localStorage
            localStorage.setItem('attendanceData', JSON.stringify(existingAttendance));

            // Reset the form fields after marking
            this.resetForm();
            this.resetIn();
            this.resetOut();
        },
        updateDay() {
            if (this.selectedDate) {
                const selectedDateObj = new Date(this.selectedDate);
                const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                this.selectedDay = weekDays[selectedDateObj.getDay()];
                this.resetOut();
                this.allowPastTimes = !this.isFutureDate && !this.isBeforeJoiningDate;

                // Update error message for either future date or before joining date
                if (this.isFutureDate) {
                    this.errorMessage = "Future dates are not allowed.";
                } else if (this.isBeforeJoiningDate) {
                    this.errorMessage = "Selected date is before the employee's joining date.";
                } else {
                    this.errorMessage = '';
                }
            }
        },
        resetForm() {
            this.selectedEmployeeIds = [];
            this.selectedDate = null;
            this.selectedDay = '';
            this.selectedStatus = '';
            this.inHours = '';
            this.inMinutes = '';
            this.inPeriod = '';
            this.outHours = '';
            this.outMinutes = '';
            this.outPeriod = ''
            this.search = '';
            this.dropdownOpen = false;
            this.selectAll = false;
            this.errorMessage = '';
        },
        resetStatus() {
            this.selectedStatus = ''; // Reset to default status
        },
        fetchEmployees() {
            const employeesFromStorage = localStorage.getItem('employees');
            const parsedData = JSON.parse(employeesFromStorage) || {};

            if (typeof parsedData !== 'object' || parsedData === null) {
                console.error("Employees data is not in the expected format.");
                this.employees = []; // Set to empty array if data format is incorrect
                return;
            }

            // Filter active employees and sort by employeeID
            this.employees = Object.values(parsedData)
                .filter(emp => emp.isActive === "Active") // Filter for active employees
                .sort((a, b) => Number(a.employeeID) - Number(b.employeeID)) // Sort by employeeID
                .map(emp => ({
                    employeeID: emp.employeeID,
                    name: emp.name || 'Unnamed',  // Set default if name is missing
                    attendance: this.initializeAttendance(),
                    editing: false
                }));

            // Log the fetched and sorted active employees
            console.log("Active employees fetched and sorted:", this.employees);
        },
        fetchExistingAttendance() {
            if (!this.selectedDate || !this.selectedEmployeeIds.length) return;

            const formattedDate = this.formatDate(this.selectedDate);
            const existingAttendance = JSON.parse(localStorage.getItem('attendanceData')) || [];

            this.selectedEmployeeIds.forEach(employeeId => {
                const record = existingAttendance.find(item => item.id === employeeId && item.date === formattedDate);

                if (record) {
                    this.selectedStatus = record.status;

                    // Split inTime into hours, minutes, and period
                    const [time, period] = record.inTime.split(' '); // Split into time and AM/PM
                    const [hours, minutes] = time.split(':'); // Split time into hours and minutes

                    this.inHours = hours; // Set hours
                    this.inMinutes = minutes; // Set minutes
                    this.inPeriod = period; // Set period (AM/PM)

                    // Reset Out Time for new entry
                    this.outHours = '';
                    this.outMinutes = '';
                    this.outPeriod = '';
                }
            });
        },
    },
    mounted() {
        this.fetchEmployees(); // Fetch employees on component mount

    },
};
</script>