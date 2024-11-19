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

      <!-- Page data -->
      <div class="max-w-full m-5 sm:m-10 lg:m-14 2xl:m-14">
        <h1 v-if="attendanceFilter === 'today'" class="text-3xl font-bold mb-6 text-center mt-[70px] text-gray-800">
          Attendance Today Records </h1>
        <h1 v-if="attendanceFilter === 'weekly'" class="text-3xl font-bold mb-6 text-center mt-[70px] text-gray-800">
          Attendance Weekly Records</h1>

        <!-- Search Bar and Dropdown for Today's Attendance -->
        <div v-if="attendanceFilter === 'today'" class="flex justify-between mb-4">
          <input type="text" v-model="searchTerm" placeholder="Search by Employee Name"
            class="border rounded px-3 py-2 w-1/3" />
          <select v-model="attendanceFilter" class="border rounded px-3 py-2">
            <option value="today">Today's Attendance</option>
            <option value="weekly">Weekly Attendance</option>
          </select>
        </div>

        <!-- Search Bar and Dropdown for weekly Attendance -->
        <div v-if="attendanceFilter === 'weekly'" class="flex justify-between mb-4">
          <input type="text" v-model="searchTerm" placeholder="Search by Employee Name"
            class="border rounded px-3 py-2 w-1/3" />
          <select v-model="attendanceFilter" class="border rounded px-3 py-2">
            <option value="today">Today's Attendance</option>
            <option value="weekly">Weekly Attendance</option>
          </select>
        </div>

        <!-- Dropdowns for Weekly Attendance -->
        <div v-if="attendanceFilter === 'weekly'" class="flex justify-between mb-4">
          <select v-model="selectedEmployee" class="border rounded px-3 py-2">
            <option disabled value="">Select Employee</option>
            <option v-for="employee in employees" :key="employee.employeeID" :value="employee.employeeID">
              {{ employee.employeeID }} - {{ employee.name }}
            </option>
          </select>
          <select v-model="selectedYear" class="border rounded px-3 py-2">
            <option disabled value="">Select Year</option>
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
          <select v-model="selectedMonth" @change="updateWeeks" class="border rounded px-3 py-2">
            <option disabled value="">Select Month</option>
            <option v-for="month in months" :key="month.value" :value="month.value">{{ month.name }}</option>
          </select>
          <select v-model="selectedWeek" class="border rounded px-3 py-2" v-if="weeks.length">
            <option disabled value="">Select Week</option>
            <option v-for="(week, index) in weeks" :key="index" :value="week">{{ week }}</option>
          </select>


          <button @click="searchAttendance" class="bg-blue-500 text-white px-4 py-2 rounded-md">Search</button>
        </div>

        <!-- Attendance Table -->
        <div v-if="attendanceFilter === 'today'">
          <table class="min-w-full bg-white shadow-md rounded-lg text-center">
            <thead>
              <tr class="bg-gray-100 text-gray-700">
                <th class="py-3 px-4 text-left">S.No</th>
                <th class="py-3 px-4 text-left">Employee ID</th>
                <th class="py-2 px-4 text-left">Name</th>
                <th class="py-2 px-4 text-left">Date</th>
                <th class="py-2 px-4 text-left">Day</th>
                <th class="py-2 px-4 text-left">In Time</th>
                <th class="py-2 px-4 text-left">Out Time</th>
                <th class="py-2 px-4 text-left">Status</th>
                <th class="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(record, index) in filteredAttendanceRecords" :key="record.id"
                class="hover:bg-gray-200 text-center">
                <td class="py-2 px-4 text-left">{{ index + 1 }}</td>
                <td class="py-2 px-4 text-left">{{ record.employeeID }}</td>
                <td class="py-2 px-4 text-left">{{ record.name }}</td>
                <td class="py-2 px-4 text-left">{{ record.date }}</td>
                <td class="py-2 px-4 text-left">{{ record.day }}</td>
                <td class="py-2 px-4 text-left">{{ record.inTime }}</td>
                <td class="py-2 px-4 text-left">{{ record.outTime }}</td>
                <td class="py-2 px-4 text-left">
                  <span :class="['border p-1 rounded', statusClass(record.status)]">{{ record.status }}</span>
                </td>
                <td class="px-4 py-2 border-b">
                  <fa icon="pen-to-square"
                    class="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors focus:outline-none"
                    @click="openEditModal(record)" />
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="!filteredAttendanceRecords.length" class="text-center text-gray-500 mt-4">
            No attendance records available.
          </div>
        </div>

        <!-- Attendance Table for Weekly View -->
        <div v-if="attendanceFilter === 'weekly'">
          <table class="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr class="bg-gray-100 text-gray-700">
                <th class="py-3 px-4 text-left">Employee ID</th>
                <th class="py-3 px-4 text-left">Name</th>
                <th v-for="day in daysInRange" :key="day" class=" px-4 py-3">{{ day }}</th>
                <!-- <th class="py-3 px-4 text-left">Action</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-if="hasSearched && computedWeeklyRecords.length" class="hover:bg-gray-200">
                <td class="py-2 px-4 text-left">{{ selectedEmployee }}</td>
                <td class="py-2 px-4 text-left">{{ getEmployeeName(selectedEmployee) }}</td>
                <td v-for="day in daysInRange" :key="day" class="py-2 px-4 text-left">
                  <span :class="['border p-1 rounded', statusClass(getRecordStatus(day))]">
                    {{ getRecordStatus(day) }}
                  </span>
                </td>


                <!-- <td class="px-4 py-2 border-b">
                  <fa icon="pen-to-square"
                    class="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors focus:outline-none"
                    @click="openEditModal(filteredWeeklyRecords[0])" />
                </td> -->
              </tr>
              <tr v-else>
                <td colspan="100%" class="text-center text-gray-500 mt-4" v-if="hasSearched">No attendance records
                  available for this week.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Edit Modal -->
        <div v-if="isModalVisible"
          class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 class="text-2xl font-semibold mb-4">Edit Attendance</h2>
            <form @submit.prevent="saveChanges">
              <div class="mb-4">
                <label class="block text-gray-700">Employee Name</label>
                <input type="text" v-model="editRecord.name" class="mt-1 block w-full border p-2 rounded" disabled />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">Date</label>
                <input type="text" v-model="editRecord.date" class="mt-1 block w-full border p-2 rounded" disabled />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">Day</label>
                <input type="text" v-model="editRecord.day" class="mt-1 block w-full border p-2 rounded" disabled />
              </div>
              <div class="mb-4">
                <label class="block text-gray-700">Status</label>
                <select v-model="editRecord.status" class="mt-1 block w-full border p-2 rounded">
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="HalfDay">Half Day</option>
                </select>
              </div>
              <!-- In Time Selection -->
              <div class="mb-4">
                <label class="block text-gray-700">In Time</label>
                <div class="flex space-x-2">
                  <select v-model="inHours"
                    class="border rounded px-2 py-1 w-1/3 bg-gray-100 focus:bg-white focus:outline-none">
                    <option disabled value="">Hours</option>
                    <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
                  </select>
                  <select v-model="inMinutes"
                    class="border rounded px-2 py-1 w-1/3 bg-gray-100 focus:bg-white focus:outline-none">
                    <option disabled value="">Minutes</option>
                    <option v-for="minute in minutes" :key="minute" :value="minute">{{ minute }}</option>
                  </select>
                  <select v-model="inPeriod"
                    class="border rounded px-2 py-1 w-1/3 bg-gray-100 focus:bg-white focus:outline-none">
                    <option disabled value="">Period</option>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <!-- Out Time Selection -->
              <div class="mb-4">
                <label class="block text-gray-700">Out Time</label>
                <div class="flex space-x-2">
                  <select v-model="outHours"
                    class="border rounded px-2 py-1 w-1/3 bg-gray-100 focus:bg-white focus:outline-none">
                    <option disabled value="">Hours</option>
                    <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
                  </select>
                  <select v-model="outMinutes"
                    class="border rounded px-2 py-1 w-1/3 bg-gray-100 focus:bg-white focus:outline-none">
                    <option disabled value="">Minutes</option>
                    <option v-for="minute in minutes" :key="minute" :value="minute">{{ minute }}</option>
                  </select>
                  <select v-model="outPeriod"
                    class="border rounded px-2 py-1 w-1/3 bg-gray-100 focus:bg-white focus:outline-none">
                    <option disabled value="">Period</option>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div class="flex justify-end">
                <button type="button" class="bg-gray-300 px-4 py-2 rounded mr-2" @click="closeModal">Cancel</button>
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
              </div>
            </form>
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
      attendanceRecords: JSON.parse(localStorage.getItem('attendanceData')) || [],
      employees: JSON.parse(localStorage.getItem('employees')) || [],
      isModalVisible: false,
      editRecord: { id: '', name: '', date: '', day: '', inTime: '', outTime: '', status: '' },
      searchTerm: '',
      attendanceFilter: 'today',
      hours: Array.from({ length: 12 }, (_, i) => i + 1), // 1 to 12
      minutes: Array.from({ length: 60 }, (_, i) => i), // 0 to 59
      inHours: '',
      inMinutes: '',
      inPeriod: '',
      outHours: '',
      outMinutes: '',
      outPeriod: '',
      employees: [], // List of employees
      selectedEmployee: '',
      selectedYear: '',
      selectedMonth: '',
      selectedWeek: '',
      years: Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i), // Last 5 years
      months: [{ name: 'January', value: 0 }, { name: 'February', value: 1 }, { name: 'March', value: 2 }, { name: 'April', value: 3 },
      { name: 'May', value: 4 }, { name: 'June', value: 5 }, { name: 'July', value: 6 }, { name: 'August', value: 7 },
      { name: 'September', value: 8 }, { name: 'October', value: 9 }, { name: 'November', value: 10 }, { name: 'December', value: 11 }],
      weeks: [],
      message: '',
      hasSearched: false,
      filteredWeeklyRecords: [],
      holidays: [],
    };
  },
  computed: {
    daysInRange() {
      if (this.selectedYear && this.selectedMonth && this.selectedWeek) {
        const weekIndex = parseInt(this.selectedWeek.split(' ')[1]) - 1; // Get the week index (0-based)
        const firstDayOfMonth = new Date(this.selectedYear, this.selectedMonth, 1);
        const firstDayOfWeek = firstDayOfMonth.getDay();

        // Calculate the starting day of the selected week
        const weekStartDay = weekIndex * 7 - firstDayOfWeek + 1; // Adjust based on the first day of the week
        const days = [];

        for (let i = 0; i < 7; i++) {
          const currentDate = weekStartDay + i;
          if (currentDate > 0 && currentDate <= new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate()) {
            days.push(currentDate);
          }
        }
        return days;
      }
      return [];
    },
    computedWeeklyRecords() {
      if (this.selectedYear && this.selectedMonth && this.selectedEmployee) {
        const weekIndex = parseInt(this.selectedWeek.split(' ')[1]) - 1; // Get the week index
        const weekStart = new Date(this.selectedYear, this.selectedMonth, weekIndex * 7 + 1);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6); // End of the week

        const weekRecords = this.attendanceRecords.filter(record => {
          const recordDate = new Date(record.date.split('-').reverse().join('-')); // Ensure this matches your date format
          return recordDate >= weekStart && recordDate <= weekEnd && record.id === this.selectedEmployee;
        });

        console.log("Filtered weekly records for employee", this.selectedEmployee, ":", weekRecords); // Debug: Log filtered records

        const recordsByDate = {};
        weekRecords.forEach(record => {
          recordsByDate[record.date] = record.status; // Store statuses by date
        });

        const weekStatuses = [];
        this.daysInRange.forEach(day => {
          const dateToCheck = this.formatDate(new Date(this.selectedYear, this.selectedMonth, day));
          weekStatuses.push(recordsByDate[dateToCheck] || null); // Push status or null if no record
        });

        return weekStatuses;
      }
      return [];
    },
    filteredAttendanceRecords() {
      const today = new Date();
      const formattedToday = this.formatDate(today);

      if (this.attendanceFilter === 'today') {
        const filteredRecords = this.attendanceRecords.filter(record => {
          return record.date === formattedToday;
        });
        return filteredRecords;
      }
    }
  },
  methods: {
    isWeekend(date) {
      const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      return day === 0 || day === 6; // Return true if it's Sunday or Saturday
    },
    getRecordStatus(day) {
      const dateToCheck = new Date(this.selectedYear, this.selectedMonth, day);
      const formattedDate = this.formatDate(dateToCheck); // Format to "DD-MM-YYYY"


      // Check if it's a weekend
      if (this.isWeekend(dateToCheck)) {
        return 'Weekend'; // Return 'Weekend' if it's Saturday or Sunday
      }

      // Check if the date is a holiday
      if (this.holidays.includes(formattedDate)) {
        return 'Holiday'; // Return 'Holiday' if the date is in holidays
      }

      const record = this.attendanceRecords.find(record => record.date === formattedDate && record.employeeID === this.selectedEmployee);
      return record ? record.status : '-'; // Return status or '-' if no record found
    },
    getEmployeeName(employeeID) {
      console.log("Getting employee name for ID:", employeeID);

      // Check if employees object exists
      if (this.employees && this.employees[employeeID]) {
        const employee = this.employees[employeeID]; // Access by ID directly
        console.log("Employee found:", employee); // Debug: Log the found employee object
        return employee.name;
      }

      console.log("Employee data is not available or ID is missing.");
      return 'Unknown Employee'; // Default if employee not found
    },
    getWeeklyRecord(day) {
      const formattedDate = this.formatDate(new Date(this.selectedYear, this.selectedMonth, day));
      return this.computedWeeklyRecords.find(record => record.date === formattedDate);
    },
    searchAttendance() {
      this.message = '';  // Reset message
      if (this.selectedYear && this.selectedMonth !== null && this.selectedWeek && this.selectedEmployee) {
        this.hasSearched = true; // Set to true if all fields are selected

        const weekIndex = parseInt(this.selectedWeek.split(' ')[1]) - 1; // Get the week index (0-based)
        const weekStart = new Date(this.selectedYear, this.selectedMonth, weekIndex * 7 + 1);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6); // End of the week

        // Debug: Log attendance records to see if we have data for the employee
        console.log("Filtering attendance records for employee", this.selectedEmployee);
        console.log("Attendance records:", this.attendanceRecords);

        // Filter records based on the selected criteria
        this.filteredWeeklyRecords = this.attendanceRecords.filter(record => {
          const recordDate = new Date(record.date); // Convert record date to Date object
          return recordDate >= weekStart && recordDate <= weekEnd && record.employeeID === this.selectedEmployee;
        });

        // Debug: Check the filtered records for this employee
        console.log("Filtered records:", this.filteredWeeklyRecords);

        if (!this.filteredWeeklyRecords.length) {
          this.message = 'No records found for the selected criteria.';
        }
      } else {
        this.hasSearched = false; // Reset if any field is missing
        this.message = 'Please select all fields before searching.';
      }
    },
    openEditModal(record) {
      this.editRecord = { ...record };
      this.isModalVisible = true;

      const [inHour, inMinute, inPeriod] = this.parseTime(record.inTime);
      this.inHours = inHour;
      this.inMinutes = inMinute;
      this.inPeriod = inPeriod;

      const [outHour, outMinute, outPeriod] = this.parseTime(record.outTime);
      this.outHours = outHour;
      this.outMinutes = outMinute;
      this.outPeriod = outPeriod;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    saveChanges() {
      this.editRecord.inTime = `${this.inHours}:${this.inMinutes} ${this.inPeriod}`;
      this.editRecord.outTime = `${this.outHours}:${this.outMinutes} ${this.outPeriod}`;

      const index = this.attendanceRecords.findIndex(
        record => record.id === this.editRecord.id && record.date === this.editRecord.date
      );
      if (index !== -1) {
        this.attendanceRecords[index] = { ...this.editRecord };
        localStorage.setItem('attendanceData', JSON.stringify(this.attendanceRecords));
      }
      this.closeModal();
    },
    loadAttendanceRecords() {
      this.attendanceRecords = JSON.parse(localStorage.getItem('attendanceData')) || [];
    },
    statusClass(status) {
      switch (status) {
        case 'Weekend':
          return 'text-blue-600 border-blue-300'; // Blue for weekends
        case 'Holiday':
          return 'text-orange-600 border-orange-300'; // Orange for holidays
        case 'Present':
          return 'text-green-600 border-green-300'; // Green for present
        case 'Absent':
          return 'text-red-600 border-red-300'; // Red for absent
        case 'HalfDay':
          return 'text-yellow-600 border-yellow-300'; // Yellow for half day
        default:
          return 'text-gray-500 border-gray-300'; // Default class for no record
      }
    },
    formatFullDate(day) {
      const date = new Date(this.startDate);
      date.setDate(day);
      const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' });
      const formattedDate = this.formatDate(date);
      return `${dayOfWeek}, ${formattedDate}`;
    },
    formatDate(date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = date.getFullYear();
      return `${day}-${month}-${year}`; // Ensure this matches your local storage format
    },
    parseTime(time) {
      const [timePart, period] = time.split(' ');
      let [hour, minute] = timePart.split(':').map(Number);
      return [hour, minute, period];
    },
    updateWeeks() {
      if (this.selectedYear && this.selectedMonth !== null) {
        const totalWeeks = 5; // Maximum number of weeks to display
        this.weeks = Array.from({ length: totalWeeks }, (_, i) => `Week ${i + 1}`);
      } else {
        this.weeks = [];
      }
    }
  },
  mounted() {
    this.loadAttendanceRecords();
    this.employees = JSON.parse(localStorage.getItem('employees')) || [];
    console.log("Loaded Employees:", this.employees); // Log the employee data to ensure it's loaded properly

    const storedHolidays = JSON.parse(localStorage.getItem('holidays')) || [];
    this.holidays = storedHolidays.map(holiday => holiday.date); // Extract just the dates
  }

};

</script>