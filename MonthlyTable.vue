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
        <h1 class="text-3xl font-bold mb-6 text-center mt-[70px] text-gray-800">Monthly Attendance Table</h1>
        <div v-if="Object.keys(monthlyAttendance).length">
          <div class="flex justify-between mb-4">
            <button class="bg-yellow-600 hover:bg-white-800 text-white px-4 py-2 rounded" @click="goback">
              Go Back To
            </button>
            <button class="bg-green-600 hover:bg-green-800 text-white px-4 py-2 rounded" @click="printReport">
              Print
            </button>
          </div>

          <!-- Display Total Weekends and Holidays -->
          <div class="mb-4">
            <p><strong>Total Weekends:</strong> {{ totalWeekends }}</p>
            <p><strong>Total Holidays:</strong> {{ totalHolidays }}</p>
          </div>

          <!--- MONTHLY ATTENDANCE TABLE --->
          <table class="w-9/12 mt-4">
            <thead>
              <tr>
                <th class="border px-4 py-2  bg-gray-100">Employee ID</th>
                <th class="border px-4 py-2  bg-gray-100">Name</th>
                <th v-for="day in daysInRange" :key="day" class="border px-4 py-2  bg-gray-100">{{ day }}</th>
                <th class="border px-4 py-2  bg-gray-100">Total Present</th>
                <th class="border px-4 py-2  bg-gray-100">Total Absent</th>
                <th class="border-gray-100 px-4 py-2  bg-gray-100">Salary</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="empId in sortedEmployeeIds" :key="empId">
                <td class="border px-4 py-2">{{ empId }}</td>
                <td class="border px-4 py-2">{{ monthlyAttendance[empId]?.name }}</td>
                <td v-for="day in daysInRange" :key="day" class="border px-4 py-2"
                  @click="canEdit(empId, day) ? openEditPopup(empId, day) : null">

                  <!---Attendance Icons--->
                  <fa icon="calendar-xmark" class="text-gray-500"
                    v-if="isWeekend(day) && !getAttendanceStatus(empId, day)" />
                  <fa icon="check-circle" class="text-green-500"
                    v-else-if="monthlyAttendance[empId]?.days[day] === 'Present'" />
                  <fa icon="times-circle" class="text-red-500"
                    v-else-if="monthlyAttendance[empId]?.days[day] === 'Absent'" />
                  <fa icon="adjust" class="text-yellow-500"
                    v-else-if="monthlyAttendance[empId]?.days[day] === 'HalfDay'" />
                  <fa icon="star" class="text-purple-500" v-else-if="isHoliday(day)" />
                  <span v-else>-</span>
                </td>
                <td class="border px-4 py-2">{{ totalPresentForEmployee(empId) }}</td>
                <td class="border px-4 py-2">{{ totalAbsentForEmployee(empId) }}</td>
                <td class="border px-4 py-2">{{ calculateSalary(empId) }}</td>
              </tr>
            </tbody>
          </table>
          <br>
        </div>

        <!-- Edit Attendance Popup -->
        <div v-if="isPopupVisible" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div class="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 class="text-lg font-semibold mb-4">Edit Attendance</h3>
            <p class="mb-2"><strong>Employee:</strong> {{ selectedEmpName }} ({{ selectedEmpId }})</p>
            <p class="mb-4"><strong>Date:</strong> {{ formatFullDate(selectedDay) }}</p>

            <label class="block mb-2">Select Attendance Status:</label>
            <div class="mb-4">
              <label class="block">
                <input type="radio" v-model="currentStatus" value="Present" class="mr-2"> Present
              </label>
              <label class="block">
                <input type="radio" v-model="currentStatus" value="Absent" class="mr-2"> Absent
              </label>
              <label class="block">
                <input type="radio" v-model="currentStatus" value="HalfDay" class="mr-2"> Half Day
              </label>
              <br>
            </div>

            <div class="flex justify-end mt-6">
              <button @click="closePopup"
                class="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded mr-2">Cancel</button>
              <button @click="saveAttendance"
                class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">Save</button>
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
      startDate: this.$route.query.startDate || '',
      endDate: this.$route.query.endDate || '',
      employeeType: this.$route.query.employeeType || 'monthly',
      monthlyAttendance: {},
      employees: JSON.parse(localStorage.getItem('employees')) || {},
      attendanceRecords: JSON.parse(localStorage.getItem('attendanceData')) || [],
      holidays: [],
      isPopupVisible: false,
      selectedEmpId: '',
      selectedEmpName: '',
      selectedDay: null,
      currentStatus: '',
    };
  },
  computed: {
    daysInRange() {
      // Calculate the range of days between start and end dates
      if (!this.startDate || !this.endDate) return [];
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const days = [];
      // Loop through each day between start and end dates
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d).getDate());
      }
      return days;
    },
    sortedEmployeeIds() {
      return Object.keys(this.monthlyAttendance).sort();
    },
    totalHolidays() {
      return this.daysInRange.filter(day => this.isHoliday(day)).length;
    },
    totalWeekends() {
      return this.daysInRange.filter(day => this.isWeekend(day)).length;
    },
  },
  methods: {
    getJoiningDate(empId) {
      const employee = this.employees.find(emp => emp.employeeID === empId);
      return employee ? employee.joiningDate : null; // Return the joining date or null if not found
    },
    getAttendanceInRange(start, end) {
      const records = this.attendanceRecords.filter(record => {
        const recordDate = new Date(record.date.split('-').reverse().join('-'));
        return recordDate >= start && recordDate <= end;
      });

      const monthlyData = {};
      this.employees.forEach(employee => {
        monthlyData[employee.employeeID] = { name: employee.name, days: {} }; // Change to employee.employeeID
      });

      records.forEach(record => {
        const empId = record.employeeID; // Ensure this matches employeeID
        const date = new Date(record.date.split('-').reverse().join('-'));
        const day = date.getDate();
        if (monthlyData[empId]) {
          monthlyData[empId].days[day] = record.status;
        }
      });

      this.monthlyAttendance = monthlyData;
    },
    // Get attendance status for an employee on a specific day
    getAttendanceStatus(empId, day) {
      return this.monthlyAttendance[empId]?.days[day] || '';
    },
    isWeekend(day) {
      const date = new Date(this.startDate);
      date.setDate(day);
      return date.getDay() === 0 || date.getDay() === 6; // 0 = Sunday, 6 = Saturday
    },
    isHoliday(day) {
      const date = new Date(this.startDate);
      date.setDate(day);
      const formattedDate = this.formatDate(date); // Should be in dd-mm-yyyy format
      return this.holidays.some(holiday => holiday.date === formattedDate); // Check against formatted holidays
    },
    loadHolidaysFromLocalStorage() {
      const storedHolidays = JSON.parse(localStorage.getItem('holidays')) || [];
      this.holidays = storedHolidays.map(holiday => ({
        date: holiday.date,
        name: holiday.name
      }));
    },
    printReport() {
      window.print();
    },
    goback() {
      this.$router.push('/monthlyattendance')
    },
    canEdit(empId, day) {
      const currentDate = new Date();
      const recordDate = new Date(this.startDate);
      recordDate.setDate(day);
      const joiningDate = this.getJoiningDate(empId); // Get the joining date of the employee

      // Check if the employee's joining date is after the record date
      if (joiningDate) {
        const [day, month, year] = joiningDate.split('-'); // Split the joining date
        const formattedJoiningDate = new Date(year, month - 1, day); // Create a Date object from joining date
        if (formattedJoiningDate > recordDate) return false; // Prevent editing if joining date is after the record date
      }

      return recordDate <= currentDate; // Allow editing if the record date is not in the future
    },
    openEditPopup(empId, day) {
      if (!this.canEdit(empId, day)) return; // Prevent editing future dates
      this.selectedEmpId = empId;// Set selected employee Id
      this.selectedEmpName = this.monthlyAttendance[empId]?.name;// Set selected employee name
      this.selectedDay = day;
      this.currentStatus = this.monthlyAttendance[empId]?.days[day] || '';// Get current status
      this.isPopupVisible = true;

    },
    closePopup() {
      this.isPopupVisible = false;
    },

    saveAttendance() {
      const formattedDate = new Date(this.startDate);
      formattedDate.setDate(this.selectedDay);
      const empId = this.selectedEmpId;
      const status = this.currentStatus;

      // Get the joining date of the employee
      const joiningDate = this.getJoiningDate(empId);
      if (joiningDate) {
        const [day, month, year] = joiningDate.split('-');
        const formattedJoiningDate = new Date(year, month - 1, day);

        // Prevent saving attendance if the selected day is before the joining date
        if (formattedDate < formattedJoiningDate) {
          alert("Cannot save attendance before the joining date.");
          return; // Exit the function to prevent saving
        }
      }

      // Proceed with saving attendance if the joining date condition is satisfied
      const empName = this.selectedEmpName;

      // Get the weekday name
      const options = { weekday: 'long' };
      const dayName = formattedDate.toLocaleDateString('en-US', options);

      // Update monthly attendance
      if (this.monthlyAttendance[empId]) {
        this.monthlyAttendance[empId].days[this.selectedDay] = status;
      }

      // Update attendanceRecords in local storage
      this.updateAttendanceRecords(empId, empName, this.selectedDay, status, dayName);
      this.closePopup();
    },
    updateAttendanceRecords(empId, empName, day, status, dayName) {
      const date = new Date(this.startDate);
      date.setDate(day);
      const formattedDate = this.formatDate(date);

      // Create the new record with the correct structure
      const newRecord = {
        employeeID: empId,
        name: empName,
        date: formattedDate,
        day: dayName,
        status,
        inTime: '', // Set as needed
        outTime: '' // Set as needed
      };

      const recordIndex = this.attendanceRecords.findIndex(record => record.employeeID === empId && record.date === formattedDate);

      if (recordIndex > -1) {
        // Update the existing record
        this.attendanceRecords[recordIndex] = { ...this.attendanceRecords[recordIndex], ...newRecord };
      } else {
        // Create a new record
        this.attendanceRecords.push(newRecord);
      }

      localStorage.setItem('attendanceData', JSON.stringify(this.attendanceRecords));
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
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
    totalPresentForEmployee(empId) {
      const presentDays = Object.entries(this.monthlyAttendance[empId]?.days || {})
        .filter(([day, status]) =>
          status === 'Present' && !this.isWeekend(day) && !this.isHoliday(day) // Exclude weekends and holidays
        ).length;
      const halfDays = Object.entries(this.monthlyAttendance[empId]?.days || {})
        .filter(([day, status]) =>
          status === 'HalfDay' && !this.isWeekend(day) && !this.isHoliday(day) // Exclude weekends and holidays
        ).length;
      return presentDays + (halfDays * 0.5); // Count half days as 0.5
    },
    totalAbsentForEmployee(empId) {
      const absentDays = Object.entries(this.monthlyAttendance[empId]?.days || {})
        .filter(([day, status]) =>
          status === 'Absent' && !this.isWeekend(day) && !this.isHoliday(day) // Exclude weekends and holidays
        ).length;
      const halfDays = Object.entries(this.monthlyAttendance[empId]?.days || {})
        .filter(([day, status]) =>
          status === 'HalfDay' && !this.isWeekend(day) && !this.isHoliday(day) // Exclude weekends and holidays
        ).length;
      return absentDays + (halfDays * 0.5); // Count half days as 0.5
    },
    calculateSalary(empId) {
      const totalDaysInMonth = this.getTotalDaysInMonth(new Date(this.startDate));

      // Find the employee by their employeeID
      const employee = this.employees.find(emp => emp.employeeID === empId);

      if (!employee) {
        console.error(`Employee with ID ${empId} not found`);
        return 0; // Return 0 or some default value if not found
      }

      const dailyRate = employee.salary ? employee.salary / totalDaysInMonth : 0;
      const totalWorkedDays = this.totalPresentForEmployee(empId);
      const totalDeductions = this.totalAbsentForEmployee(empId);

      const finalSalary = (totalDaysInMonth - totalDeductions) * dailyRate;

      // Update the local storage with attendance summary
      this.updateSalaryDetails(empId, employee.name, totalWorkedDays, totalDeductions, Math.round(finalSalary));
      this.saveAttendanceSummary(empId, employee.name, totalWorkedDays, totalDeductions, Math.round(finalSalary));

      return Math.round(finalSalary); // Return the calculated salary
    },
    updateSalaryDetails(empId, name, totalPresent, totalAbsent, currentSalary) {
      // Get the month name and year
      const date = new Date(this.startDate);
      const monthName = date.toLocaleString('default', { month: 'long' }); // Full month name
      const year = date.getFullYear();

      // Create a unique key for the month and year
      const monthYearKey = `${monthName}-${year}`;

      // Retrieve existing salary details from local storage
      let salaryDetails = JSON.parse(localStorage.getItem('salaryDetails')) || {};

      // Initialize employee record if it doesn't exist
      if (!salaryDetails[empId]) {
        salaryDetails[empId] = {
          id: empId,
          name: name,
          salaries: {} // Store salaries by month-year
        };

        // Initialize all months for the current year if no salary exists
        const months = [
          "January", "February", "March", "April", "May", "June", "July",
          "August", "September", "October", "November", "December"
        ];

        months.forEach(month => {
          const monthKey = `${month}-${year}`;
          salaryDetails[empId].salaries[monthKey] = {
            month: month,
            year: year,
            salary: 0 // Default to 0 if no attendance data
          };
        });
      }

      // Check attendance and set salary accordingly
      let salaryToStore = (totalPresent > 0 || totalAbsent > 0) ? currentSalary : 0;

      // Store or update the salary summary for the specific month
      salaryDetails[empId].salaries[monthYearKey] = {
        month: monthName,
        year: year,
        salary: salaryToStore
      };

      // Save back to local storage
      localStorage.setItem('salaryDetails', JSON.stringify(salaryDetails));
    },
    saveAttendanceSummary(empId, employeeName, totalPresent, totalAbsent, currentSalary) {
      const monthYear = `${new Date(this.startDate).toLocaleString('default', { month: 'long' })} ${new Date(this.startDate).getFullYear()}`; // Format: Month Year
      const dailyStatuses = {};

      // Populate daily statuses
      for (let day = 1; day <= this.getTotalDaysInMonth(new Date(this.startDate)); day++) {
        const status = this.getAttendanceStatus(empId, day);
        dailyStatuses[day] = status ? status : '';
      }

      const summary = {
        empId,
        employeeName,
        totalPresent,
        totalAbsent,
        currentSalary,
        month: monthYear,
        dailyStatuses, // Add daily statuses
      };

      // Retrieve existing data from localStorage, if any
      let monthlyAttendanceSummary = JSON.parse(localStorage.getItem('monthlyAttendance')) || {};

      // Update or create the entry for this employee
      monthlyAttendanceSummary[empId] = summary;

      // Save the updated summary back to localStorage
      localStorage.setItem('monthlyAttendance', JSON.stringify(monthlyAttendanceSummary));
    },


    getTotalDaysInMonth(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      return new Date(year, month + 1, 0).getDate(); // Get last date of the month
    },
    initializeNewEmployees() {
      this.employees.forEach(employee => {
        // Check if the employee's ID does not exist in monthlyAttendance
        if (!this.monthlyAttendance[employee.id]) {
          // Initialize their attendance record with their name and an empty days object
          this.monthlyAttendance[employee.id] = {
            name: employee.name,
            days: {},
          };
        }
      });
    },
    loadAttendanceData() {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      this.getAttendanceInRange(start, end);
    },

  },
  mounted() {
    const employeesFromLocalStorage = JSON.parse(localStorage.getItem('employees')) || [];

    // Convert the object to an array if it's not already an array
    const employeesArray = Array.isArray(employeesFromLocalStorage)
      ? employeesFromLocalStorage
      : Object.values(employeesFromLocalStorage);

    // Filter to get only active employees of the selected employeeType
    this.employees = employeesFromLocalStorage.filter(emp =>
      emp.isActive === "Active" && emp.employeeType === this.employeeType
    );

    this.getAttendanceInRange(new Date(this.startDate), new Date(this.endDate));
    this.loadHolidaysFromLocalStorage();
    this.initializeNewEmployees();
    this.loadAttendanceData();

    this.sortedEmployeeIds.forEach(empId => {
      const totalPresent = this.totalPresentForEmployee(empId);
      const totalAbsent = this.totalAbsentForEmployee(empId);
      const currentSalary = this.calculateSalary(empId);

      this.saveAttendanceSummary(empId, this.employees.find(emp => emp.employeeID === empId)?.name, totalPresent, totalAbsent, currentSalary);
    });
  }


};
</script>