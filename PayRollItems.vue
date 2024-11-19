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
        <h1 class="text-3xl font-bold mb-6 text-center mt-[70px] text-gray-800">Payroll Items</h1>


        <!-- Tab Navigation -->
        <div class="flex border-b mb-6">
          <button v-for="tab in tabs" :key="tab" @click="currentTab = tab" :class="{
            'border-b-4 border-yellow-400 text-yellow-400': currentTab === tab,
            'text-gray-600 hover:text-gray-800': currentTab !== tab
          }" class="px-6 py-2 transition-all duration-200">
            {{ tab }}
          </button>
        </div>

        <!-- Add Item Button and Filters -->
        <div class="flex justify-between mb-4">
          <input type="text" v-model="searchQuery" placeholder="Search..."
            class="border border-gray-300 rounded-md py-2 px-4 w-1/4" />

          <div class="flex items-center">
            <select v-model="selectedMonth" class="border border-gray-300 rounded-md py-2 px-4 mr-2">
              <option value="">Select Month</option>
              <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
            </select>

            <select v-model="selectedYear" class="border border-gray-300 rounded-md py-2 px-4">
              <option value="">Select Year</option>
              <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>

          <button
            class="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 shadow-lg transition-all duration-200"
            @click="showAddModal = true">
            <fa icon="plus" />
            Add {{ currentTab }}
          </button>
        </div>


        <!--Table section-->
        <table class="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr class="bg-gray-100 text-gray-700">
              <th class="py-2 px-4 text-left">S.No</th>
              <th class="py-2 px-4 text-left">Employee ID</th>
              <th class="py-2 px-4 text-left">Employee Name</th>
              <th v-if="currentTab === 'Bonus'" class="py-2 px-4 text-left">Category</th>
              <th v-if="currentTab === 'Bonus'" class="py-2 px-4 text-left">Month</th>
              <th v-if="currentTab === 'Bonus'" class="py-2 px-4 text-left">Year</th>
              <th v-if="currentTab === 'Bonus'" class="py-2 px-4 text-left">Amount</th>
              <th v-if="currentTab === 'Deductions'" class="py-2 px-4 text-left">Category</th>
              <th v-if="currentTab === 'Deductions'" class="py-2 px-4 text-left">Month</th>
              <th v-if="currentTab === 'Deductions'" class="py-2 px-4 text-left">Year</th>
              <th v-if="currentTab === 'Deductions'" class="py-2 px-4 text-left">Amount</th>
              <th class="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredItems" :key="item.name"
              :class="{ 'bg-white': index % 2 === 0, 'bg-purple-50': index % 2 !== 0 }">
              <td class="py-2 px-4">{{ index + 1 }}</td>
              <td class="py-2 px-4">{{ item.employeeIds }}</td>
              <td class="py-2 px-4">{{ item.name }}</td>
              <td v-if="currentTab === 'Bonus'" class="py-2 px-4">{{ item.category }}</td>
              <td v-if="currentTab === 'Bonus'" class="py-2 px-4">{{ item.month }}</td>
              <td v-if="currentTab === 'Bonus'" class="py-2 px-4">{{ item.year }}</td>
              <td v-if="currentTab === 'Bonus'" class="py-2 px-4">{{ item.amount }}</td>
              <td v-if="currentTab === 'Deductions'" class="py-2 px-4">{{ item.category }}</td>
              <td v-if="currentTab === 'Deductions'" class="py-2 px-4">{{ item.month }}</td>
              <td v-if="currentTab === 'Deductions'" class="py-2 px-4">{{ item.year }}</td>
              <td v-if="currentTab === 'Deductions'" class="py-2 px-4">{{ item.amount }}</td>
              <td class="py-2 px-4">
                <div class="tooltip-container">
                  <fa icon="pen-to-square" @click="openEditModal(item)" class="text-blue-500 hover:text-blue-700" />
                  <span class="tooltip">Edit</span>
                </div>
                <div class="tooltip-container">
                  <fa icon="trash-can" @click="openDeleteModal(item)" class="text-red-500 hover:text-red-700 ml-4" />
                  <span class="tooltip">Delete</span>
                </div>
              </td>
            </tr>
            <tr v-if="items[currentTab].length === 0">
              <td colspan="10" class="py-4 text-center text-gray-500">No items available</td>
            </tr>
          </tbody>
        </table>

        <!-- Add Item Modal -->
        <div v-if="showAddModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center text-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 class="text-2xl font-semibold mb-4">Add {{ currentTab }}</h2>

            <!---Form--->
            <form @submit.prevent="submitItem">
              <!---Select Employee Name and ID--->
              <div class="mb-4">
                <label class="block text-gray-700 mb-2">
                  Employee Name & ID:
                  <fa icon="arrows-rotate" @click="resetLabel" class="cursor-pointer ml-2" />
                </label>
                <div class="relative">
                  <div class="flex items-center border border-gray-300 p-3 rounded-lg cursor-pointer"
                    @click="toggleDropdown">
                    <span>{{ selectedEmployeeNames.length > 0 ? selectedEmployeeNames.join(', ') : 'Select Employees'
                      }}</span>
                  </div>
                  <div v-if="dropdownOpen"
                    class="absolute bg-white border border-gray-300 rounded-lg mt-2 z-10 w-full shadow-lg">
                    <div class="p-3">
                      <input type="text" v-model="searchQuery" placeholder="Search Employee..."
                        class="border border-gray-300 p-2 rounded-lg w-full mb-2" />
                      <div class="flex items-center mb-2">
                        <input type="checkbox" id="select-all" @change="toggleSelectAll" v-model="selectAll" />
                        <label for="select-all" class="ml-2">Select All</label>
                      </div>
                    </div>
                    <div v-for="employee in filteredEmployees" :key="employee.employeeID"
                      class="p-3 border-t border-gray-200">
                      <input type="checkbox" :id="'employee' + employee.employeeID" :value="employee.employeeID"
                        v-model="selectedEmployeeIds" />
                      <label :for="'employee' + employee.employeeID" class="ml-2">{{ employee.employeeID }} - {{
                        employee.name }}</label>
                    </div>
                  </div>
                </div>
              </div>

              <!---Select Month and Year--->
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-gray-700 mb-2">Select Month</label>
                  <select v-model="modalMonth" class="w-full border border-gray-300 px-4 py-2 rounded-lg" required>
                    <option value="" disabled>Select Month</option>
                    <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-700 mb-2">Select Year</label>
                  <select v-model="modalYear" class="w-full border border-gray-300 px-4 py-2 rounded-lg" required>
                    <option value="" disabled>Select Year</option>
                    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                  </select>
                </div>
              </div>

              <!---Bonus Section--->
              <div v-if="currentTab === 'Bonus'" class="mb-4">
                <label class="block text-gray-700 mb-2">Category</label>
                <select v-model="newItem.category" class="w-full border border-gray-300 px-4 py-2 rounded-lg" required>
                  <option value="" disabled>Select Category</option>
                  <option v-for="category in bonusCategories" :key="category" :value="category">{{ category }}</option>
                </select>
                <div class="mt-4">
                  <label class="block text-gray-700 mb-2">Amount</label>
                  <input type="number" v-model="newItem.amount"
                    class="border border-gray-300 px-4 py-2 rounded-lg w-full" required />
                </div>
                <div class="mt-4">
                  <label class="block text-gray-700 mb-2">Description</label>
                  <textarea v-model="newItem.description" class="border border-gray-300 px-4 py-2 rounded-lg w-full"
                    rows="3" placeholder="Enter description"></textarea>
                </div>
              </div>

              <!---Deduction Section--->
              <div v-if="currentTab === 'Deductions'" class="mb-4">
                <label class="block text-gray-700 mb-2">Category</label>
                <select v-model="newItem.category" class="w-full border border-gray-300 px-4 py-2 rounded-lg" required>
                  <option value="" disabled>Select Category</option>
                  <option v-for="category in deductionCategories" :key="category" :value="category">{{ category }}
                  </option>
                </select>
                <div class="mt-4">
                  <label class="block text-gray-700 mb-2">Amount</label>
                  <input type="number" v-model="newItem.amount"
                    class="border border-gray-300 px-4 py-2 rounded-lg w-full" required />
                </div>
                <div class="mt-4">
                  <label class="block text-gray-700 mb-2">Description</label>
                  <textarea v-model="newItem.description" class="border border-gray-300 px-4 py-2 rounded-lg w-full"
                    rows="3" placeholder="Enter description"></textarea>
                </div>
              </div>

              <!---Buttons for Form Actions--->
              <div class="flex justify-end mt-6">
                <button type="button" @click="showAddModal = false"
                  class="bg-gray-300 px-4 py-2 rounded-lg mr-2">Cancel</button>
                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg">Add Item</button>
              </div>
            </form>
          </div>
        </div>


        <!-- Edit Item Modal -->
        <div v-if="showEditModal"   class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 class="text-2xl font-semibold mb-4">Edit {{ currentTab }}</h2>
            <form @submit.prevent="updateItem">
              <div class="mb-4">
                <label class="block text-gray-700">Employee Name</label>
                <input v-model="editItem.name" type="text" class="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter name" required />
              </div>
              <!---Edit For Bonus--->
              <div v-if="currentTab === 'Bonus'" class="mb-4">
                <label class="block text-gray-700">Category</label>
                <input v-model="editItem.category" type="text" class="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter category" required />
              </div>

              <div v-if="currentTab === 'Bonus'" class="mb-4">
                <label class="block text-gray-700">Amount</label>
                <input v-model="editItem.amount" type="number" class="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter amount" required />
              </div>

              <!---Edit For Deductions--->
              <div v-if="currentTab === 'Deductions'" class="mb-4">
                <label class="block text-gray-700">Category</label>
                <input v-model="editItem.category" type="text" class="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter category" required />
              </div>

              <div v-if="currentTab === 'Deductions'" class="mb-4">
                <label class="block text-gray-700">Amount</label>
                <input v-model="editItem.amount" type="number" class="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter amount" required />
              </div>

              <!---Edit Buttons--->
              <div class="flex justify-center">
                <button type="button" @click="showEditModal = false"
                  class="bg-red-500 text-white py-2 px-4 rounded-lg mr-2">Cancel</button>
                <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div class="bg-white rounded-lg p-6 w-96">
            <h2 class="text-xl font-semibold mb-4">Delete Item</h2>
            <p>Are you sure you want to delete {{ itemToDelete.name }}?</p>
            <div class="flex justify-end mt-4">
              <button type="button" @click="showDeleteModal = false"
                class="bg-red-500 text-white py-2 px-4 rounded-lg mr-2">Cancel</button>
              <button @click="deleteItemConfirmed" class="bg-blue-500 text-white py-2 px-4 rounded-lg">Delete</button>
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
      currentTab: 'Bonus',
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      selectedEmployees: [],
      bonusMonth: '',
      bonusYear: '',
      deductionMonth: '',
      deductionYear: '',
      selectedMonth: '',
      selectedYear: '',
      modalMonth: '',
      modalYear: '',
      newItem: { category: '', amount: '', description: '' },
      editItem: { id: '', name: '', month: '', year: '', category: '', amount: '', description: '' },
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      years: Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i),
      dropdownOpen: false,
      selectAll: false,
      searchQuery: '',
      tabs: ['Bonus', 'Deductions'],
      items: { Bonus: [], Deductions: [] },
      itemToDelete: null,
      newCategory: '',
      employees: [], // Initialize as empty
      selectedEmployeeIds: [],
      bonusCategories: [],
      deductionCategories: [],
    };
  },
  computed: {
    selectedEmployeeNames() {
      this.dropdownOpen = false;
      return this.employees
        .filter(emp => this.selectedEmployeeIds.includes(emp.employeeID))
        .map(emp => `${emp.employeeID} - ${emp.name}`);
    },
    filteredEmployees() {
      return this.employees.filter(employee =>
        employee.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    filteredItems() {
      const currentItems = this.items[this.currentTab] || [];
      return currentItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesMonth = this.selectedMonth ? item.month === this.selectedMonth : true;
        const matchesYear = this.selectedYear ? item.year === this.selectedYear : true;

        return matchesSearch && matchesMonth && matchesYear;
      });
    }
  },
  methods: {
    getActiveEmployees() {
      const storedEmployees = JSON.parse(localStorage.getItem('employees')) || {};
      const employeesArray = Array.isArray(storedEmployees) ? storedEmployees : Object.values(storedEmployees);

      // Filter for active employees and sort by employeeID
      return employeesArray
        .filter(employee => employee.isActive === "Active")
        .sort((a, b) => a.employeeID.localeCompare(b.employeeID));
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    toggleSelectAll() {
      this.selectedEmployeeIds = this.selectAll ? this.employees.map(emp => emp.employeeID) : [];
    },
    selectEmployee(employee) {
      const index = this.selectedEmployeeIds.indexOf(employee.employeeID);
      if (index === -1) {
        this.selectedEmployeeIds.push(employee.employeeID);
      } else {
        this.selectedEmployeeIds.splice(index, 1);
      }
    },
    resetLabel() {
      this.selectedEmployeeIds = [];
      this.dropdownOpen = false;
      this.selectAll = false;
    },
    saveCategoriesToLocalStorage() {
      const payrollData = {
        Bonuses: this.items.Bonus,
        Deductions: this.items.Deductions,
        BonusCategories: this.bonusCategories,
        DeductionCategories: this.deductionCategories,
      };
      localStorage.setItem('Payroll', JSON.stringify(payrollData));
    },
    submitItem() {
      if (this.selectedEmployeeIds.length === 0) return;
      this.selectedEmployeeIds.forEach(id => {
        const employee = this.employees.find(emp => emp.employeeID === id);
        if (employee) {
          const item = {
            name: employee.name,
            employeeIds: employee.employeeID,
            month: this.currentTab === 'Bonus' ? this.modalMonth : this.modalMonth,
            year: this.currentTab === 'Bonus' ? this.modalYear : this.modalYear,
            category: this.newItem.category,
            amount: this.newItem.amount || 0,
            description: this.newItem.description || '',
          };

          this.items[this.currentTab].push(item); // Add to current category
        }
      });
      this.saveCategoriesToLocalStorage();
      this.resetForm();
      this.showAddModal = false;
    },
    resetForm() {
      this.selectedEmployeeIds = [];
      this.modalMonth = '';
      this.modalYear = '';
      this.newItem = { category: '', amount: '', description: '' };
      this.dropdownOpen = false;
      this.selectAll = false;
    },
    openEditModal(item) {
      this.editItem = { ...item }; // Use the item directly
      this.showEditModal = true;
    },
    updateItem() {
      const index = this.items[this.currentTab].findIndex(i =>
        i.employeeIds === this.editItem.employeeIds && i.category === this.editItem.category
      );
      if (index !== -1) {
        this.items[this.currentTab][index] = {
          ...this.items[this.currentTab][index],
          amount: this.editItem.amount,
          description: this.editItem.description,
        };
        this.saveCategoriesToLocalStorage();
      }
      this.showEditModal = false;
    },
    openDeleteModal(item) {
      this.itemToDelete = item;
      this.showDeleteModal = true;
    },
    deleteItemConfirmed() {
      const index = this.items[this.currentTab].findIndex(item =>
        item.employeeIds === this.itemToDelete.employeeIds && item.category === this.itemToDelete.category
      );
      if (index !== -1) {
        this.items[this.currentTab].splice(index, 1);
        this.saveCategoriesToLocalStorage();
      }
      this.showDeleteModal = false;
    },
  },
  created() {
    this.employees = this.getActiveEmployees(); // Populate employees on component creation
    const storedData = JSON.parse(localStorage.getItem('Payroll')) || {
      Bonuses: [],
      Deductions: [],
      BonusCategories: [], // Updated to the correct key
      DeductionCategories: [] // Updated to the correct key
    };

    this.items.Bonus = storedData.Bonuses || [];
    this.items.Deductions = storedData.Deductions || [];
    this.bonusCategories = storedData.BonusCategories || []; // Updated to the correct key
    this.deductionCategories = storedData.DeductionCategories || []; // Updated to the correct key

    console.log('Bonus Categories:', this.bonusCategories);
    console.log('Deduction Categories:', this.deductionCategories);
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
  border-radius: 5px;
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
