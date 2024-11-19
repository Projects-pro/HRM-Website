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
        <h1 class="text-3xl font-bold mb-6 text-center mt-[70px] text-gray-800">Employee Details</h1>

        <div class="flex justify-between items-center mb-8">
          <div class="w-full max-w-md">
            <input v-model="searchQuery" type="text" placeholder="Search employee by name or ID..."
              class="border border-gray-300 rounded-md py-2 px-4 w-80" />
          </div>

          <div class="flex items-center gap-6">
            <button @click="toggleView" class="bg-gray-200 p-4 rounded-full cursor-pointer">
              <fa :icon="isGrid ? 'list' : 'th'" class="text-gray-700 text-xl" />
            </button>

            <button @click="gotoaddEmp" class="bg-orange-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
              <fa icon="plus" /> Add Employee
            </button>
          </div>
        </div>

        <div :class="[isGrid ? 'grid-layout' : 'list-layout']">
          <div v-for="employee in filteredEmployees" :key="employee.employeeID" class="card">
            <div class="employee-header">
              <div class="toggle-container">
                <input type="checkbox" :id="'toggle-' + employee.employeeID" :checked="employee.isActive === 'Active'"
                  @change="toggleActive(employee)" class="toggle-switch" />
                <label :for="'toggle-' + employee.employeeID" class="toggle-label"
                  :class="{ 'active': employee.isActive === 'Active' }"></label>
              </div>
            </div>

            <div class="employee-details">
              <h2 class="text-xl font-semibold">{{ employee.firstName }} {{ employee.middleName }} {{ employee.lastName
                }}
              </h2>
              <p>ID: {{ employee.employeeID }}</p>
              <p>Joining Date: {{ employee.joiningDate || 'N/A' }}</p>
            </div>

            <div class="flex justify-center mt-4">
              <button v-if="employee.isActive === 'Active'" @click.stop.prevent="viewEmployeeDetails(employee)"
                class="btn">
                View Profile
              </button>
              <button v-else class="btn bg-gray-300" disabled :class="{ blur: employee.isActive !== 'Active' }">
                View Profile
              </button>
              <button @click.stop.prevent="confirmDelete(employee)" class="btn bg-red-500 ml-2"
                :class="{ blur: employee.isActive !== 'Active' }" :disabled="employee.isActive !== 'Active'">
                Delete
              </button>
            </div>
          </div>
        </div>
        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteConfirmation" class="modal-overlay">
          <div class="modal">
            <p>Are you sure you want to delete {{ employeeToDelete.firstName }} {{ employeeToDelete.lastName }}?</p>
            <div class="flex justify-end mt-4 gap-2">
              <button @click="showDeleteConfirmation = false" class="btn bg-gray-500">Cancel</button>
              <button @click="deleteEmployee" class="btn bg-red-500">Confirm Delete</button>
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
      employees: this.getEmployeesFromLocalStorage(),
      searchQuery: '',
      isGrid: true,
      showDeleteConfirmation: false,
    };
  },
  computed: {
    filteredEmployees() {
      const query = this.searchQuery.toLowerCase();
      return this.employees
        .filter((employee) => {
          if (!employee) return false;
          const name = `${employee.firstName || ''} ${employee.middleName || ''} ${employee.lastName || ''}`.toLowerCase();
          const id = String(employee.employeeID);
          return name.includes(query) || id.includes(query);
        })
        .sort((a, b) => a.employeeID - b.employeeID); // Sort by employeeID
    }
  },
  methods: {
    viewEmployeeDetails(employee) {
      if (employee.isActive !== "Active") return; // Prevent viewing details if inactive
      localStorage.setItem('selectedEmployee', JSON.stringify(employee));
      this.$router.push({ name: 'EmployeeHistory' });
    },
    gotoaddEmp() {
      this.$router.push('/addemployee');
    },
    toggleView() {
      this.isGrid = !this.isGrid;
    },
    toggleActive(employee) {
      console.log('Before toggle:', employee.isActive);

      // Determine the new value for isActive
      const newIsActive = employee.isActive === "Active" ? "Inactive" : "Active";

      // Create a new employee object with the updated isActive status
      const updatedEmployee = { ...employee, isActive: newIsActive };

      // Find the index of the employee and update the employees array
      const index = this.employees.findIndex(emp => emp.employeeID === employee.employeeID);
      if (index !== -1) {
        this.employees.splice(index, 1, updatedEmployee);
      }

      console.log('After toggle:', updatedEmployee.isActive);
      console.log('Employees before updating local storage:', this.employees);

      // Update local storage
      this.updateLocalStorage();
    },
    confirmDelete(employee) {
      this.employeeToDelete = employee;
      this.showDeleteConfirmation = true;
    },
    deleteEmployee() {
      const index = this.employees.findIndex(emp => emp.employeeID === this.employeeToDelete.employeeID);
      if (index !== -1) {
        this.employees.splice(index, 1);
      }

      this.updateLocalStorage();
      this.showDeleteConfirmation = false;
      this.employeeToDelete = null;
    },
    getEmployeesFromLocalStorage() {
      const storedData = JSON.parse(localStorage.getItem('employees'));
      console.log('Stored employees data:', storedData);

      // If storedData is an object (not an array), convert it to an array
      if (storedData && typeof storedData === 'object' && !Array.isArray(storedData)) {
        // Convert object to array (values of the object)
        return Object.values(storedData).map(employee => ({
          ...employee,
          isActive: employee.isActive === "Active" ? "Active" : "Inactive", // Ensure proper status
        }));
      } else if (Array.isArray(storedData)) {
        // If it's already an array, return it directly
        return storedData.map(employee => ({
          ...employee,
          isActive: employee.isActive === "Active" ? "Active" : "Inactive", // Ensure proper status
        }));
      } else {
        console.error("Stored employees data is not in a valid format:", storedData);
        return []; // Return an empty array if the data format is invalid
      }
    },
    updateLocalStorage() {
      console.log('Updating local storage with:', JSON.stringify(this.employees));

      // Save employees as an array, as per your requirement
      localStorage.setItem('employees', JSON.stringify(this.employees));
    }
  },
  mounted() {
    this.employees = this.getEmployeesFromLocalStorage();
  }
};
</script>

<style scoped>
.container {
  margin-left: 16rem;
  margin-right: 18rem;
  padding: 2rem 1.5rem;
}

.heading {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  margin-top: 1rem;
  text-align: left;
}

.employee-header {
  display: flex;
  justify-content: space-between;
  /* Pushes toggle switch to the right */
  align-items: center;
}

.toggle-container {
  margin-left: auto;
  /* Ensures toggle stays on the right */
  display: flex;
  align-items: center;
}

.input-text {
  width: 100%;
  padding: 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.input-text:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}

.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.list-layout {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card {
  background-color: #e0f2fe;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.card:hover {
  background-color: #bae6fd;
}

.btn {
  background-color: #34d399;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
}

.btn:hover {
  background-color: #10b981;
}

button {
  border: none;
  cursor: pointer;
}

.blur {
  filter: blur(2px);
  opacity: 0.6;
  pointer-events: none;
}

.toggle-container {
  display: flex;
  align-items: center;
  margin-right: 1rem;
}

.toggle-switch {
  display: none;
}

.toggle-label {
  width: 50px;
  height: 25px;
  background-color: #ccc;
  border-radius: 25px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-label::after {
  content: "";
  position: absolute;
  width: 21px;
  height: 21px;
  background-color: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.3s ease;
}

.toggle-label.active {
  background-color: #34d399;
}

.toggle-switch:checked+.toggle-label {
  background-color: #34d399;
}

.toggle-switch:checked+.toggle-label::after {
  transform: translateX(25px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}
</style>
