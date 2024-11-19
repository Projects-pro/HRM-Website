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
        <h2 class="text-3xl font-bold mb-6 text-center mt-[70px] text-gray-800">Employee Salary</h2>
        
        <div class="max-w-full m-5 sm:m-10 lg:m-14 2xl:m-14">
          <div class="flex justify-between items-center mb-6">
            <div class="flex flex-1">
              <input type="text" v-model="filters.search" placeholder="Search by Name or ID"
                class="border border-gray-300 rounded-md py-2 px-4 w-full max-w-xs" />
            </div>

            <div class="flex justify-center flex-1 space-x-4">
              <select v-model="selectedMonth" @change="filterSalaries" class="border p-2 rounded-lg">
                <option v-for="(month, index) in months" :key="index" :value="index + 1">{{ month }}</option>
              </select>
              <select v-model="selectedYear" @change="filterSalaries" class="border p-2 rounded-lg">
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>

            <div class="flex justify-end flex-1">
              <button @click="search" class="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">
                Search
              </button>
            </div>
          </div>

          <table class="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr>
                <th class="border px-4 py-2">Employee</th>
                <th class="border px-4 py-2">Employee ID</th>
                <th class="border px-4 py-2">Join Date</th>
                <th class="border px-4 py-2">Salary</th>
                <th class="border px-4 py-2">Paid/Unpaid</th>
                <th class="border px-4 py-2">Payslip</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in filteredSalaries" :key="employee.employeeID">
                <td class="border px-4 py-2 flex items-center ">
                  <img :src="employee.photo || '/default.avatar.img'" alt="Employee Image"
                    class="w-8 h-8 rounded-full object-cover border-4 border-gray-300" />
                  <div>&nbsp;&nbsp;
                    <span>{{ employee.name }}</span><br />
                    <span class="text-sm text-blue-600 text-center">{{ employee.designation }}</span>
                  </div>
                </td>
                <td class="border px-4 py-2">{{ employee.employeeID }}</td>
                <td class="border px-4 py-2">{{ parseDate(employee.joiningDate) }}</td>
                <td class="border px-4 py-2">{{ employee.salary }}</td>
                <td class="border px-4 py-2">
                  <button
                    :class="{ 'bg-green-500': employee.paidStatus === 'Paid', 'bg-red-500': employee.paidStatus === 'Unpaid' }"
                    class="text-white px-4 py-2 rounded-lg font-bold" @click="toggleSalaryStatus(employee)">
                    {{ employee.paidStatus }}
                  </button>
                </td>
                <td class="border px-4 py-2">
                  <fa icon="download" class="text-green-500" @click="navigateto(employee)" />
                </td>
              </tr>
              <tr v-if="!filteredSalaries.length">
                <td colspan="6" class="border px-4 py-2 text-center">No employees found</td>
              </tr>
            </tbody>
          </table>
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
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      months: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      years: this.generateYearRange(5),
      employees: [],
      filteredSalaries: [],
      filters: {
        search: '',
      },
    };
  },
  methods: {
    loadEmployees() {
      const storedEmployees = JSON.parse(localStorage.getItem('employees')) || {};
      this.employees = Object.keys(storedEmployees)
        .filter(key => storedEmployees[key].isActive === "Active")
        .map(key => {
          const employee = {
            employeeID: key,
            paidStatus: 'Unpaid',
            ...storedEmployees[key],
          };
          const salaryInfo = this.getSalaryForCurrentMonth(employee.employeeID);
          employee.salary = salaryInfo ? salaryInfo.salary : 0;
          return employee;
        })
        .sort((a, b) => a.employeeID.localeCompare(b.employeeID));
    },

    getSalaryForCurrentMonth(empId) {
      const monthYearKey = `${this.months[this.selectedMonth - 1]}-${this.selectedYear}`;
      let salaryDetails = JSON.parse(localStorage.getItem('salaryDetails')) || {};
      return salaryDetails[empId] ? salaryDetails[empId].salaries[monthYearKey] : null;
    },

    filterSalaries() {
      this.filteredSalaries = this.employees.map(employee => {
        const salaryInfo = this.getSalaryForCurrentMonth(employee.employeeID);
        return {
          ...employee,
          salary: salaryInfo ? salaryInfo.salary : 0,
        };
      }).filter(employee => {
        const searchTerm = this.filters.search.toLowerCase();
        const matchesName = employee.name.toLowerCase().includes(searchTerm);
        const matchesID = employee.employeeID.toLowerCase().includes(searchTerm);
        return matchesName || matchesID;
      });
    },

    toggleSalaryStatus(employee) {
      employee.paidStatus = employee.paidStatus === 'Paid' ? 'Unpaid' : 'Paid';
      this.updateLocalStorageSalaryStatus(employee);
    },

    search() {
      this.filterSalaries();
    },

    navigateto(employee) {
      this.$router.push({
        name: 'Payslip',
        params: {
          employeeID: employee.employeeID,
          month: this.selectedMonth,
          year: this.selectedYear,
        },
      });
    },

    generateYearRange(yearsBack) {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: yearsBack + 1 }, (_, i) => currentYear - i);
    },

    parseDate(dateString) {
      if (!dateString) return "";
      const [day, month, year] = dateString.split('-');
      const date = new Date(year, month - 1, day);
      return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    },

    updateLocalStorageSalaryStatus(employee) {
      const salaryDetails = JSON.parse(localStorage.getItem('salaryDetails')) || {};
      const monthYearKey = `${this.months[this.selectedMonth - 1]}-${this.selectedYear}`;
      
      // Initialize employee's salary details if not present
      if (!salaryDetails[employee.employeeID]) {
        salaryDetails[employee.employeeID] = { salaries: {} };
      }

      // Update the paid status for the current month
      salaryDetails[employee.employeeID].salaries[monthYearKey] = {
        ...salaryDetails[employee.employeeID].salaries[monthYearKey],
        paidStatus: employee.paidStatus,
      };

      // Save back to local storage
      localStorage.setItem('salaryDetails', JSON.stringify(salaryDetails));
    },
  },
  mounted() {
    this.loadEmployees();
    this.filterSalaries(); // Initial filter on load
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: center;
  border: none;
}

th {
  background-color: #f4f4f4;
}

tbody tr:hover {
  background-color: #e0e0e0;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

tbody tr:nth-child(odd) {
  background-color: #ffffff;
}

td {
  border: none;
}
</style>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: center;
  border: none;
}

th {
  background-color: #f4f4f4;
}

tbody tr:hover {
  background-color: #e0e0e0;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

tbody tr:nth-child(odd) {
  background-color: #ffffff;
}

td {
  border: none;
}
</style>
