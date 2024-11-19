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
        <h1 class="text-2xl font-bold mb-8 text-center">Delete Employee</h1>

        <!-- Search Bar -->
        <div class="flex justify-between mb-8">
          <div class=" w-full max-w-md ml-40">
            <input v-model="searchTerm" type="text" placeholder="Search Employee" class="border p-2 w-full" />
          </div>
          <div class="relative tooltip-container">
            <button @click="gotoaddEmp" class="bg-orange-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
              <fa icon="plus" /> Add Employee
            </button>
          </div>
        </div>


        <!-- Employee List for Deletion -->
        <table class="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-gray-700">
              <th class="py-2 px-4">Employee ID</th>
              <th class="py-2 px-4">Employee Name</th>
              <th class="py-2 px-4">Joining Date</th>
              <th class="py-2 px-4">Salary</th>
              <th class="py-2 px-4">Designation</th>
              <!-- <th class="py-2 px-4 border">Address</th> -->
              <th class="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in filteredEmployees" :key="employee.employeeID"
              class="border-b hover:bg-gray-100 text-center">
              <td class="py-2 px-4">{{ employee.employeeID }}</td>
              <td class="py-2 px-4">{{ employee.name }}</td>
              <td class="py-2 px-4">{{ (employee.joiningDate) }}</td>
              <td class="py-2 px-4">{{ employee.salary }}</td>
              <td class="py-2 px-4">{{ employee.designation }}</td>
              <!-- <td class="py-2 px-4 border">{{ employee.address }}, {{ employee.city }}, {{ employee.state }}, {{
                employee.country }}</td> -->
              <td class="py-2 px-4  text-center">
                <div class="tooltip-container">
                  <fa icon="pen-to-square" @click="openEditModal(employee)" class="text-blue-500 hover:text-blue-700" />
                  <span class="tooltip">Edit</span>
                </div>
                <div class="tooltip-container">
                  <fa icon="trash-can" @click="confirmDelete(employee)" class="text-red-500 hover:text-red-700 ml-4" />
                  <span class="tooltip">Delete</span>
                </div>&nbsp;
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Confirmation Modal -->
        <div v-if="showConfirmation" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div class="bg-white p-6 rounded shadow-md w-1/3">
            <h2 class="text-lg font-bold mb-4">Confirmation To Delete Employee:</h2>
            <p class="mb-4">Are you sure you want to delete <strong>{{ employeeToDelete?.name }}</strong>?</p>
            <p>Time remaining: {{ countdown }} seconds</p>
            <div class="flex justify-end">
              <button @click="deleteEmployee"
                :class="{ 'bg-red-600': countdown <= 0, 'bg-red-300 cursor-not-allowed': countdown > 0 }"
                :disabled="countdown > 0" class="text-white px-4 py-2 rounded">
                <span v-if="countdown > 0">Yes ({{ countdown }} sec)</span>
                <span v-else class="font-bold">Yes</span>
              </button>&nbsp;
              <button @click="cancelDelete" class="bg-gray-300 text-black px-4 py-2 rounded">No</button>
            </div>
          </div>
        </div>

        <!-- Edit Modal -->
        <div v-if="showEditModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div class="bg-white p-6 rounded shadow-md w-1/3 max-h-[60vh] overflow-auto">
            <h2 class="text-xl font-bold mb-4">Edit Employee</h2>
            <div class="mb-4">
              <label for="name" class="block mb-2">Name:</label>
              <input v-model="editEmployeeData.name" id="name" class="border p-2 w-full" type="text" />
            </div>
            <div class="mb-4">
              <label for="id" class="block mb-2">Employee ID:</label>
              <input v-model="editEmployeeData.employeeID" id="id" class="border p-2 w-full" type="text" disabled />
            </div>
            <div class="mb-4">
              <label for="joiningDate" class="block mb-2">Joining Date:</label>
              <input v-model="editEmployeeData.joiningDate" id="joiningDate" class="border p-2 w-full" type="date" />
            </div>
            <div class="mb-4">
              <label for="salary" class="block mb-2">Salary:</label>
              <input v-model="editEmployeeData.salary" id="salary" class="border p-2 w-full" type="number" />
            </div>
            <div class="mb-4">
              <label for="designation" class="block mb-2">Designation:</label>
              <input v-model="editEmployeeData.designation" id="designation" class="border p-2 w-full" type="text" />
            </div>
            <div class="flex justify-end">
              <button @click="saveEdit" class="bg-blue-600 text-white px-4 py-2 rounded mr-2">Save</button>
              <button @click="closeEditModal" class="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
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
    const storedEmployees = localStorage.getItem('employees');
    const employeesObject = storedEmployees ? JSON.parse(storedEmployees) : {};
    const employeesArray = Array.isArray(employeesObject) ? employeesObject : Object.values(employeesObject); // Convert object to array

    return {
      employees: employeesArray,
      searchTerm: '',
      showConfirmation: false,
      employeeToDelete: null,
      countdown: 10,
      countdownInterval: null,
      showEditModal: false,
      editEmployeeData: {
        employeeID: '',
        name: '',
        lastName: '',
        joiningDate: '',
        salary: '',
        designation: '',
        address: '',
        city: '',
        state: '',
        country: '',
      },
    };
  },
  computed: {

    filteredEmployees() {
      return this.employees.filter(employee =>
        employee.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.employeeID.toLowerCase().includes(this.searchTerm.toLowerCase())
      ).sort((a, b) => {
        // Convert to numbers for proper sorting
        const idA = parseInt(a.employeeID, 10);
        const idB = parseInt(b.employeeID, 10);
        return idA - idB; // Sort in ascending order
      });
    },

  },
  methods: {
    // formatDate(dateString) {
    //   if (!dateString) return ''; // Handle empty cases
    //   const parts = dateString.split('-'); // Assuming date is in 'yyyy-mm-dd' format
    //   return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to 'dd-mm-yyyy'
    // },
    confirmDelete(employee) {
      this.employeeToDelete = employee;
      this.showConfirmation = true;
      this.countdown = 10;

      // Start countdown
      this.countdownInterval = setInterval(() => {
        this.countdown -= 1;
        if (this.countdown <= 0) {
          clearInterval(this.countdownInterval); // Stop the countdown when it reaches 0
        }
      }, 1000);
    },
    deleteEmployee() {
      // Filter out the employee to delete
      this.employees = this.employees.filter(emp => emp.employeeID !== this.employeeToDelete.employeeID);

      // Save the updated array to localStorage
      localStorage.setItem('employees', JSON.stringify(this.employees));

      // Remove related records from other storage if needed
      const otRecords = JSON.parse(localStorage.getItem('otRecords')) || {};
      delete otRecords[this.employeeToDelete.employeeID];
      localStorage.setItem('otRecords', JSON.stringify(otRecords));

      // Remove attendance, salary, and other related records
      this.removeAttendanceRecords(this.employeeToDelete.employeeID);
      this.removeMonthlyAttendance(this.employeeToDelete.employeeID);
      this.removeSalaryDetails(this.employeeToDelete.employeeID);

      // Close the confirmation modal
      this.showConfirmation = false;
      this.employeeToDelete = null;

      // Clear countdown interval
      clearInterval(this.countdownInterval);
    },
    removeAttendanceRecords(employeeID) {
      let attendanceRecords = JSON.parse(localStorage.getItem('attendanceData')) || [];
      attendanceRecords = attendanceRecords.filter(record => record.id !== employeeID);
      localStorage.setItem('attendanceData', JSON.stringify(attendanceRecords));
    },
    removeMonthlyAttendance(employeeID) {
      let monthlyAttendanceSummary = JSON.parse(localStorage.getItem('monthlyAttendance')) || {};
      delete monthlyAttendanceSummary[employeeID];
      localStorage.setItem('monthlyAttendance', JSON.stringify(monthlyAttendanceSummary));
    },
    removeSalaryDetails(employeeID) {
      let salaryDetails = JSON.parse(localStorage.getItem('salaryDetails')) || {};
      delete salaryDetails[employeeID];
      localStorage.setItem('salaryDetails', JSON.stringify(salaryDetails));
    },
    cancelDelete() {
      this.showConfirmation = false;
      this.employeeToDelete = null;
      clearInterval(this.countdownInterval); // Clear the countdown interval
    },
    openEditModal(employee) {
      this.editEmployeeData = { ...employee };
      this.showEditModal = true;
    },
    saveEdit() {
      const index = this.employees.findIndex(emp => emp.employeeID === this.editEmployeeData.employeeID);
      if (index !== -1) {
        this.employees.splice(index, 1, this.editEmployeeData);
        localStorage.setItem('employees', JSON.stringify(this.employees));
      }
      this.showEditModal = false;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    gotoaddEmp() {
      this.$router.push('/addemployee')
    }
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
  background-color: black;
  color: white;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  width: 120px;
}

.tooltip-container:hover .tooltip {
  visibility: visible;
}
</style>