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
        <!-- Back Arrow and Heading -->
        <div class="flex items-center justify-between mb-4">
          <!-- Back Arrow on the Left -->
          <fa icon="arrow-left" @click="goBack" class="text-blue-500 cursor-pointer" />
          <!-- Heading centered -->
          <h2 class="text-2xl font-bold mx-auto">Employee Status</h2>
        </div>

        <div class="container">
          <div class="employee-details-container">
            <div class="employee-left">
              <img :src="employee.employeeImage || '/default.avatar.img'" alt="Employee Image"
                class="w-28 h-28 rounded-full object-cover border-4 border-gray-300" />
              <h2 class="text-2xl font-bold">{{ fullName }}</h2>
              <p><b>Employee ID: {{ employee.employeeID || 'N/A' }}</b></p>
              <p><b> {{ employee.designation || 'N/A' }}</b></p>
            </div>
            <div class="employee-right">
              <p><b>Joining Date:</b> {{ formatDate(employee.joiningDate) || 'N/A' }}</p>
              <p><b>Email:</b> {{ employee.email || 'N/A' }}</p>
              <p><b>Phone Number:</b> {{ employee.phoneNumber || 'N/A' }}</p>
              <p><b>Current Salary:</b> {{ currentSalary || 'N/A' }}</p>
              <p><b>Previous Month Salary:</b> {{ previousMonthSalary || 'N/A' }}</p>
              <p><b>Total Paid Salary:</b> {{ totalPaidSalary || 'N/A' }}</p>
            </div>
          </div>

          <div class="row">
            <div class="card personal-info">
              <div class="flex justify-end">
                <fa icon="pen" @click="openEditPopup('personalInfo')" class="cursor-pointer mb-2" />
              </div>
              <h3>Personal Information</h3>
              <p><span>Gender:</span> {{ employee.gender || 'N/A' }}</p>
              <p><span>DOB:</span>{{ employee.dob }}</p>
              <p><span>Marital Status:</span> {{ employee.maritalStatus || 'N/A' }}</p>
              <p><span>Nationality:</span> {{ employee.nationality || 'N/A' }}</p>
            </div>


            <div class="card emergency-contact">
              <div class="flex justify-end">
                <fa icon="pen" @click="openEditPopup('emergencyContact')" class="cursor-pointer mb-2" />
              </div>
              <h3>Emergency Contact</h3>
              <p><span>Emergency Contact Name:</span> {{ employee.emergencyContactName || 'N/A' }}</p>
              <p><span>Emergency Contact Number:</span> {{ employee.emergencyContactNumber || 'N/A' }}</p>
              <p><span>Relationship:</span>{{ employee.relationship }}</p>
            </div>

            <div class="card bank-info">
              <div class="flex justify-end">
                <fa icon="pen" @click="openEditPopup('bankInfo')" class="cursor-pointer mb-2" />
              </div>
              <h3>Bank Information</h3>
              <p><span>Bank Name:</span> {{ employee.bankName || 'N/A' }}</p>
              <p><span>Account Number:</span> {{ employee.accountNumber || 'N/A' }}</p>
              <p><span>IFSC Code:</span> {{ employee.ifscCode || 'N/A' }}</p>
            </div>

            <div class="card education-info">
              <div class="flex justify-end">
                <fa icon="pen" @click="openEditPopup('educationInfo')" class="cursor-pointer mb-2" />
              </div>
              <h3>Education Information</h3>
              <p><span>Institution:</span> {{ employee.institution || 'N/A' }}</p>
              <p><span>Degree:</span> {{ employee.degree || 'N/A' }}</p>
              <p><span>University:</span> {{ employee.university || 'N/A' }}</p>
              <p><span>Year of Passing:</span> {{ employee.yearOfPassing || 'N/A' }}</p>
            </div>

            <div class="card experience-info">
              <div class="flex justify-end">
                <fa icon="pen" @click="openEditPopup('experienceInfo')" class="cursor-pointer mb-2" />
              </div>
              <h3>Experience</h3>
              <p><span>Job Title:</span> {{ employee.jobTitle || 'N/A' }}</p>
              <p><span>Years of Experience:</span> {{ employee.yearsOfExperience || 'N/A' }}</p>
              <p><span>Company Name:</span> {{ employee.companyName || 'N/A' }}</p>
            </div>

            <div class="card address-info">
              <div class="flex justify-end">
                <fa icon="pen" @click="openEditPopup('addressInfo')" class="cursor-pointer mb-2" />
              </div>
              <h3>Address</h3>
              <p><span>Address:</span> {{ employee.address || 'N/A' }}</p>
              <p><span>Street:</span> {{ employee.street || 'N/A' }}</p>
              <p><span>City:</span> {{ employee.city || 'N/A' }}</p>
              <p><span>State:</span> {{ employee.state || 'N/A' }}</p>
              <p><span>postalCode:</span> {{ employee.postalCode || 'N/A' }}</p>
              <p><span>Country:</span> {{ employee.country || 'N/A' }}</p>

            </div>
          </div>

          <div>
            <EditInfo v-if="isModalOpen" :isOpen="isModalOpen" :section="currentSection" :data="currentData"
              @close="isModalOpen = false" @save="updateEmployeeDetails" />
          </div>

          <!-- Attendance Calendar Section -->
          <div class="calendar-container">
            <h2 class="text-2xl mt-4 text-center font-bold mb-4">Attendance Calendar</h2>
            <div class="text-center mt-[20px] mb-4">
              <label for="yearSelect" class="mr-2">Select Year:
                <select id="yearSelect" v-model="selectedYear" class="border rounded">
                  <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                </select>
              </label>
              <label for="monthSelect" class="mr-2">Select Month:
                <select id="monthSelect" v-model="selectedMonth" class="border rounded">
                  <option v-for="month in months" :key="month.value" :value="month.value">{{ month.text }}</option>
                </select>
              </label>
            </div>
            <div class="calendar grid grid-cols-7 gap-2">
              <div v-for="dayLabel in dayLabels" :key="dayLabel" class="p-2 text-center font-bold">{{ dayLabel }}</div>
              <div v-for="day in calendarDays" :key="day.date" :class="['p-2 text-center', day.date ? 'bg-gray-100' : '',
                (day.date && (day.date.getDay() === 0 || day.date.getDay() === 6)) ? 'text-red-600 font-bold' : '',
                (day.date && day.status === 'Holiday') ? 'text-red-600 font-bold' : '']"
                @click="showAttendanceDetails(day)"
                :title="day.date && (day.status === 'Holiday' ? 'Holiday' : (day.date.getDay() === 0 ? 'Sunday' : day.date.getDay() === 6 ? 'Saturday' : ''))">
                <span v-if="day.date">{{ day.date.getDate() }}</span>
                <span v-if="day.status === 'Holiday'" class="holiday">H</span>
                <fa v-if="day.date && day.status === 'Present'" icon="circle-check" class="text-green-500" />
                <fa v-if="day.date && day.status === 'Absent'" icon="circle-xmark" class="text-red-500" />
                <fa v-if="day.date && day.status === 'HalfDay'" icon="circle-half-stroke" class="text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        <!-- Attendance Details Popup -->
        <div v-if="showPopup"
          class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center text-center justify-center z-50">
          <div class="popup">
            <h3 class="text-lg font-bold">Attendance Details</h3>
            <p><strong>Date:</strong> {{ selectedDate }}</p>
            <p><strong>Employee Name:</strong> {{ employee.name }}</p>
            <p><strong>Employee ID:</strong> {{ employee.employeeID }}</p>

            <!-- In Time Selection -->
            <div class="mb-4">
              <label class="block text-gray-700">In Time</label>
              <div class="flex space-x-2">
                <select v-model="inHours" :disabled="selectedDate > today"
                  class="border rounded px-2 py-1 w-1/3 bg-gray-100 focus:bg-white focus:outline-none">
                  <option disabled value="">Hours</option>
                  <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
                </select>
                <select v-model="inMinutes" :disabled="selectedDate > today"
                  class="border rounded px-2 py-1 w-1/3 bg-gray-100 focus:bg-white focus:outline-none">
                  <option disabled value="">Minutes</option>
                  <option v-for="minute in minutes" :key="minute" :value="minute">{{ minute }}</option>
                </select>
                <select v-model="inPeriod" :disabled="selectedDate > today"
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
                <select v-model="outHours" :disabled="selectedDate > today"
                  class="border rounded px-2 py-1 w-1/3 bg-gray-100 focus:bg-white focus:outline-none">
                  <option disabled value="">Hours</option>
                  <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
                </select>
                <select v-model="outMinutes" :disabled="selectedDate > today"
                  class="border rounded px-2 py-1 w-1/3 bg-gray-100 focus:bg-white focus:outline-none">
                  <option disabled value="">Minutes</option>
                  <option v-for="minute in minutes" :key="minute" :value="minute">{{ minute }}</option>
                </select>
                <select v-model="outPeriod" :disabled="selectedDate > today"
                  class="border rounded px-2 py-1 w-1/3 bg-gray-100 focus:bg-white focus:outline-none">
                  <option disabled value="">Period</option>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
            <button @click="closePopup" class="bg-red-500 text-white py-2 px-4 rounded">Close</button> &nbsp;
            <button @click="saveAttendance" class="bg-blue-500 text-white py-2 px-4 rounded">Save</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Layout from './Layout.vue';
import EditInfo from './EditInfo.vue';
export default {
  components: {
    Layout,
    EditInfo
  },
  props: {
    isOpen: Boolean,
    section: String,
    data: Object,
  },
  data() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = today.getFullYear();

    return {
      today: `${day}-${month}-${year}`,
      months: [
        { value: 1, text: 'January' },
        { value: 2, text: 'February' },
        { value: 3, text: 'March' },
        { value: 4, text: 'April' },
        { value: 5, text: 'May' },
        { value: 6, text: 'June' },
        { value: 7, text: 'July' },
        { value: 8, text: 'August' },
        { value: 9, text: 'September' },
        { value: 10, text: 'October' },
        { value: 11, text: 'November' },
        { value: 12, text: 'December' },
      ],
      isModalOpen: false,
      years: Array.from({ length: 10 }, (v, i) => new Date().getFullYear() - i),
      selectedMonth: today.getMonth() + 1,
      selectedYear: today.getFullYear(),
      employee: {},
      currentSalary: 'N/A',
      previousMonthSalary: null,
      totalPaidSalary: null,
      calendarDays: [],
      dayLabels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      attendanceData: JSON.parse(localStorage.getItem('attendanceData')) || [],
      holidays: JSON.parse(localStorage.getItem('holidays')) || [],
      showPopup: false,
      selectedDate: '',
      selectedInTime: '',
      selectedOutTime: '',
      hours: Array.from({ length: 12 }, (v, i) => i + 1), // 1-12
      minutes: Array.from({ length: 60 }, (v, i) => i), // 0-59
      inHours: '',
      inMinutes: '',
      inPeriod: '',
      outHours: '',
      outMinutes: '',
      outPeriod: '',
      firstName: '',
      middleName: '',
      lastName: '',
      employeeID: '',
      email: '',
      joiningDate: '',
      salary: '',
      phoneNumber: '',
      gender: '',
      maritalStatus: '',
      nationality: '',
      emergencyContactName: '',
      emergencyContactNumber: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      institution: '',
      degree: '',
      university: '',
      yearOfPassing: '',
      jobTitle: '',
      yearsOfExperience: '',
      companyName: '',
      address: '',
      employeeImage: null,
    }

  },
  watch: {
    selectedMonth: 'generateCalendar',
    selectedYear: 'generateCalendar',
  },
  computed: {
    fullName() {
      return `${this.employee.firstName || ''} ${this.employee.middleName || ''} ${this.employee.lastName || ''}`.trim();
    },
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'EmployeeDetails' });
    },
    formatDate(date) {
      if (!date) return '';
      if (typeof date === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(date)) {
        return date;
      }
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    },
    generateCalendar() {
      const year = this.selectedYear;
      const month = this.selectedMonth - 1;
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      this.calendarDays = [];
      const firstDay = new Date(year, month, 1).getDay();

      for (let i = 0; i < firstDay; i++) {
        this.calendarDays.push({ date: null });
      }

      for (let i = 1; i <= daysInMonth; i++) {
        const dayDate = new Date(year, month, i);
        const formattedDate = `${i.toString().padStart(2, '0')}-${(month + 1).toString().padStart(2, '0')}-${year}`;

        //  Check the employee ID and formatted date
        // console.log('Checking attendance for:', this.employee.employeeID, 'on', formattedDate);

        const attendanceRecord = this.attendanceData.find(record =>
          record.employeeID === this.employee.employeeID && record.date === formattedDate
        );

        const isHoliday = this.holidays.some(holiday =>
          holiday.date === formattedDate
        );

        this.calendarDays.push({
          date: dayDate,
          status: isHoliday ? 'Holiday' : (attendanceRecord ? attendanceRecord.status : ''),
          inTime: attendanceRecord ? attendanceRecord.inTime : '',
          outTime: attendanceRecord ? attendanceRecord.outTime : ''
        });

        // // Debugging: Log the attendance record found
        // if (attendanceRecord) {
        //   // console.log('Attendance record found:', attendanceRecord);
        // } else {
        //   // console.log('No attendance record found for this date.');
        // }
      }
    },
    fetchCurrentSalary() {
      const salaryDetails = JSON.parse(localStorage.getItem('salaryDetails'));

      if (!salaryDetails) {
        console.error("No salary details found in localStorage.");
        this.currentSalary = 'N/A';
        this.previousMonthSalary = 'N/A';
        this.totalPaidSalary = 'N/A';
        return;
      }

      const employeeID = this.employee.employeeID;
      const employeeData = salaryDetails[employeeID];

      if (!employeeData || !employeeData.salaries) {
        console.error(`No salary details found for employee ID: ${employeeID}`);
        this.currentSalary = 'N/A';
        this.previousMonthSalary = 'N/A';
        this.totalPaidSalary = 'N/A';
        return;
      }

      // Get the current month and year
      const date = new Date();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const monthKey = `${month}-${year}`;

      const currentMonthSalary = employeeData.salaries[monthKey];
      this.currentSalary = currentMonthSalary ? currentMonthSalary.salary : 'N/A';

      // Get the previous month and calculate total paid salary
      const previousDate = new Date(date.getFullYear(), date.getMonth() - 1);
      const previousMonth = previousDate.toLocaleString('default', { month: 'long' });
      const previousYear = previousDate.getFullYear();
      const previousMonthKey = `${previousMonth}-${previousYear}`;

      const previousMonthSalaryData = employeeData.salaries[previousMonthKey];
      this.previousMonthSalary = previousMonthSalaryData ? previousMonthSalaryData.salary : 'N/A';

      // Calculate total paid salary for all months
      const allSalaries = Object.values(employeeData.salaries);
      this.totalPaidSalary = allSalaries.reduce((total, salary) => total + (salary.salary || 0), 0);
    },
    showAttendanceDetails(day) {
      if (day.date) {
        const dayFormatted = String(day.date.getDate()).padStart(2, '0');
        const monthFormatted = String(day.date.getMonth() + 1).padStart(2, '0');
        const yearFormatted = day.date.getFullYear();

        this.selectedDate = `${dayFormatted}-${monthFormatted}-${yearFormatted}`;
        this.selectedInTime = day.inTime || 'Not Marked';
        this.selectedOutTime = day.outTime || 'Not Marked';

        if (this.selectedInTime !== 'Not Marked') {
          const [inHour, inMinute, inPeriod] = this.selectedInTime.split(/[: ]/);
          this.inHours = inHour;
          this.inMinutes = inMinute;
          this.inPeriod = inPeriod;
        }

        if (this.selectedOutTime !== 'Not Marked') {
          const [outHour, outMinute, outPeriod] = this.selectedOutTime.split(/[: ]/);
          this.outHours = outHour;
          this.outMinutes = outMinute;
          this.outPeriod = outPeriod;
        }

        this.showPopup = true;
      }
    },
    closePopup() {
      this.showPopup = false;
      this.resetAttendanceForm();
    },
    saveAttendance() {
      const inTime = `${this.inHours}:${this.inMinutes} ${this.inPeriod}`;
      const outTime = `${this.outHours}:${this.outMinutes} ${this.outPeriod}`;
      const formattedDate = this.selectedDate;
      const attendanceRecord = this.attendanceData.find(record => record.employeeID === this.employee.employeeID && record.date === formattedDate);

      if (attendanceRecord) {
        attendanceRecord.inTime = inTime;
        attendanceRecord.outTime = outTime;
        attendanceRecord.status = 'Present';
      } else {
        this.attendanceData.push({
          employeeID: this.employee.employeeID,
          date: formattedDate,
          inTime: inTime,
          outTime: outTime,
          status: 'Present'
        });
      }

      localStorage.setItem('attendanceData', JSON.stringify(this.attendanceData));
      this.closePopup();
    },
    loadEmployeeDetails() {
      const selectedEmployee = JSON.parse(localStorage.getItem('selectedEmployee'));
      if (selectedEmployee) {
        this.employee = selectedEmployee;
        this.currentSalary = this.employee.salary || 'N/A';
      }
    },
    resetAttendanceForm() {
      this.inHours = '';
      this.inMinutes = '';
      this.inPeriod = '';
      this.outHours = '';
      this.outMinutes = '';
      this.outPeriod = '';
    },
    openEditPopup(section) {
      this.currentSection = section;
      switch (section) {
        case 'personalInfo':
          this.currentData = {
            gender: this.employee.gender,
            dob: this.employee.dob,
            maritalStatus: this.employee.maritalStatus,
            nationality: this.employee.nationality,
          };
          break;
        case 'emergencyContact':
          this.currentData = {
            emergencyContactName: this.employee.emergencyContactName,
            emergencyContactNumber: this.employee.emergencyContactNumber,
            relationship: this.employee.relationship,
          };
          break;
        case 'bankInfo':
          this.currentData = {
            bankName: this.employee.bankName,
            accountNumber: this.employee.accountNumber,
            ifscCode: this.employee.ifscCode,
          };
          break;
        case 'educationInfo':
          this.currentData = {
            institution: this.employee.institution,
            degree: this.employee.degree,
            university: this.employee.university,
            yearOfPassing: this.employee.yearOfPassing,
          };
          break;
        case 'experienceInfo':
          this.currentData = {
            jobTitle: this.employee.jobTitle,
            yearsOfExperience: this.employee.yearsOfExperience,
            companyName: this.employee.companyName,
          };
          break;
        case 'addressInfo':
          this.currentData = {
            address: this.employee.address,
            street: this.employee.street,
            city: this.employee.city,
            state: this.employee.state,
            postalCode: this.employee.postalCode,
            country: this.employee.country,
          };
          break;
      }
      this.isModalOpen = true;
    },
    updateEmployeeDetails(updatedData) {
      // Retrieve existing employees from localStorage
      let employees = JSON.parse(localStorage.getItem('employees')) || [];
      console.log('Retrieved employees:', employees); // Debugging line

      // Find the employee in the array using the employeeID
      const employeeID = this.employee.employeeID;
      const employeeIndex = employees.findIndex(emp => emp.employeeID === employeeID);

      if (employeeIndex !== -1) {
        // Update the employee details
        Object.assign(employees[employeeIndex], updatedData);

        // Ensure DOB is formatted as dd-mm-yyyy before saving
        if (updatedData.dob) {
          const formattedDob = this.formatDate(updatedData.dob);
          if (formattedDob) {
            employees[employeeIndex].dob = formattedDob;
          } else {
            console.error('Invalid date format for:', updatedData.dob);
          }
        }

        // Save the updated employees array back to localStorage
        localStorage.setItem('employees', JSON.stringify(employees));

        // Update the local state to reflect the change
        this.employee = { ...employees[employeeIndex] }; // Update current employee
      } else {
        console.error('Employee not found in localStorage');
      }
    }
  },
  mounted() {
    this.loadEmployeeDetails();
    this.fetchCurrentSalary();
    this.generateCalendar(); // Ensure calendar is generated after loading employee details
  }
}
</script>


<style scoped>
.container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
}

.employee-details-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}

.employee-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-right: 20px;
  border-right: 2px dotted #ccc;
}

.employee-right {
  flex: 1;
  padding-left: 20px;
}

.employee-right p {
  margin-bottom: 10px;
}

.calendar-container {
  margin-top: 40px;
  text-align: center;
}

.calendar {
  margin-top: 10px;
}

.calendar div {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar div:hover {
  background-color: #f0f0f0;
}

.holiday {
  border: 2px solid red;
  border-radius: 50%;
  width: 25px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
  font-weight: bold;
  margin: 0;
}

.popup {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.popup button {
  display: inline-block;
  margin-top: 20px;
}

.fixed {
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  padding: 20px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 48%;
}

h3 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 600;
}

p {
  margin: 5px 0;
}

span {
  font-weight: 500;
  color: #333;
}

.family-member,
.education-item,
.job-item {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .card {
    width: 100%;
  }
}
</style>