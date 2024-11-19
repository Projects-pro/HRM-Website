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

        <h1 class="text-3xl font-bold mb-6 text-center mt-[70px] text-gray-800">Management</h1>

        <!-- Tab Navigation -->
        <div class="flex border-b mb-6">
          <button v-for="tab in tabs" :key="tab" @click="currentTab = tab" :class="{
            'border-b-4 border-yellow-400 text-yellow-400': currentTab === tab,
            'text-gray-600 hover:text-gray-800': currentTab !== tab
          }" class="px-6 py-2 transition-all duration-200">
            {{ tab }}
          </button>
        </div>

        <!-- Conditional Rendering Based on Tab -->
        <div v-if="currentTab === 'Department'">
          <!-- Department Table -->
          <div class="flex justify-between items-center mb-4">
            <div class="w-1/2">
              <input v-model="departmentSearch" type="text" placeholder="Search Department..."
                class="border rounded p-2 w-full" />
            </div>
            <button @click="openDepartmentModal"
              class="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 shadow-lg transition-all duration-200">
              <fa icon="plus" /> Add Department
            </button>
          </div>


          <!--Table section-->
          <table class="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr class="bg-gray-100 text-gray-700">
                <th class="py-2 px-4 text-left">S.No</th>
                <th class="py-2 px-4 text-left">Department Name</th>
                <th class="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(dept, index) in filteredPaginatedDepartments" :key="index"
                :class="{ 'bg-white': index % 2 === 0, 'bg-gray-100': index % 2 !== 0 }">
                <td class="py-2 px-4 text-left">{{ index + 1 }}</td>
                <td class="py-2 px-4 text-left">{{ dept.name }}</td>
                <td class="py-2 px-4 text-left">
                  <div class="tooltip-container">
                    <fa icon="pen-to-square" @click="editDepartment(index)" class="text-blue-500 hover:text-blue-700" />
                    <span class="tooltip">Edit</span>
                  </div>
                  <div class="tooltip-container">
                    <fa icon="trash-can" @click="removeDepartment(index)"
                      class="text-red-500 hover:text-red-700 ml-4" />
                    <span class="tooltip">Delete</span>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredPaginatedDepartments.length === 0">
                <td colspan="5" class="py-4 text-center text-gray-500">No items available</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else-if="currentTab === 'Designation'">
          <!-- Designation -->
          <div class="flex justify-between items-center mb-4">
            <div class="w-1/2">
              <input v-model="departmentSearch" type="text" placeholder="Search Designation..."
                class="border rounded p-2 w-full" />
            </div>
            <button @click="openDesignationModal"
              class="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 shadow-lg transition-all duration-200">
              <fa icon="plus" /> Add Designation
            </button>
          </div>

          <!--Table section-->
          <table class="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr class="bg-gray-100 text-gray-700">
                <th class="py-2 px-4 text-left">S.No</th>
                <th class="py-2 px-4 text-left">Department Name</th>
                <th class="py-2 px-4 text-left">Designation</th>
                <th class="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredPaginatedDesignations" :key="index"
                :class="{ 'bg-white': index % 2 === 0, 'bg-gray-100': index % 2 !== 0 }">
                <td class="py-2 px-4 text-left">{{ index + 1 }}</td>
                <td class="py-2 px-4 text-left">{{ item.department }}</td>
                <td class="py-2 px-4 text-left">{{ item.designation }}</td>
                <td class="py-2 px-4 text-left">
                  <div class="tooltip-container">
                    <fa icon="pen-to-square" @click="editDesignation(index)"
                      class="text-blue-500 hover:text-blue-700" />
                    <span class="tooltip">Edit</span>
                  </div>
                  <div class="tooltip-container">
                    <fa icon="trash-can" @click="removeDesignation(index)"
                      class="text-red-500 hover:text-red-700 ml-4" />
                    <span class="tooltip">Delete</span>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredPaginatedDesignations.length === 0">
                <td colspan="5" class="py-4 text-center text-gray-500">No items available</td>
              </tr>


            </tbody>
          </table>
        </div>

        <!-- Modal for Adding/Editing Departments -->
        <div v-if="isDepartmentModalOpen" class="fixed inset-0 flex justify-center items-center">
          <div class="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
            <h2 class="text-xl font-bold mb-4">{{ editDepartmentIndex !== null ? 'Edit Department' : 'Add Department' }}
            </h2>
            <form @submit.prevent="submitDepartment">
              <div class="mb-4">
                <label class="block mb-2">Department Name</label>
                <input v-model="newDepartmentName" type="text" placeholder="Enter Department Name"
                  class="border rounded p-2 w-full" />
              </div>
              <button type="submit" class="bg-blue-500 text-white rounded p-2 w-full">
                <fa icon="save" /> {{ editDepartmentIndex !== null ? 'Save Changes' : 'Add Department' }}
              </button>
              <button type="button" @click="closeDepartmentModal"
                class="bg-gray-300 text-black rounded p-2 w-full mt-2">
                Cancel
              </button>
            </form>
          </div>
        </div>


        <!-- Modal for Adding/Editing Designations -->
        <div v-if="isModalOpen" class="fixed inset-0 flex justify-center items-center">
          <div class="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
            <h2 class="text-xl font-bold mb-4">{{ editIndex !== null ? 'Edit Designation' : 'Add Designation' }}
            </h2>
            <form @submit.prevent="submitDesignation">
              <div class="mb-4">
                <label class="block mb-2">Select Department</label>
                <select v-model="selectedDepartment" class="border rounded p-2 w-full">
                  <option value="" disabled>Select Department</option>
                  <option v-for="dept in filteredDepartments" :key="dept.id" :value="dept.name">
                    {{ dept.name }}
                  </option>
                </select>
              </div>
              <div class="mb-4">
                <label class="block mb-2">New Designation</label>
                <input v-model="newDesignation" type="text" placeholder="Enter Designation"
                  class="border rounded p-2 w-full" />
              </div>
              <button type="submit" class="bg-blue-500 text-white rounded p-2 w-full">
                <fa icon="save" /> {{ editIndex !== null ? 'Save Changes' : 'Add Designation' }}
              </button>
              <button type="button" @click="closeDesignationModal"
                class="bg-gray-300 text-black rounded p-2 w-full mt-2">
                Cancel
              </button>
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
      tabs: ['Department', 'Designation'],
      currentTab: 'Department', 
      departments: [],
      designations: [],
      departmentSearch: '',
      designationSearch: '',
      currentPage: 1,
      entriesPerPage: 10,
      newDesignation: '',
      newDepartmentName: '',
      isDepartmentModalOpen: false,
      editDepartmentIndex: null,
      selectedDepartment: '',
      newDesignation: '',
      isModalOpen: false,
      editIndex: null,
    };
  },
  computed: {
    filteredDepartments() {
      return this.departments.filter(dept =>
        dept && dept.name && dept.name.toLowerCase().includes(this.departmentSearch.toLowerCase())
      );
    },

    filteredPaginatedDepartments() {
      let filtered = this.filteredDepartments; // Use the existing filteredDepartments
      return filtered.slice((this.currentPage - 1) * this.entriesPerPage, this.currentPage * this.entriesPerPage);
    },
    filteredPaginatedDesignations() {
      let filtered = this.designations;
      if (this.designationSearch) {
        filtered = filtered.filter(item =>
          item.designation.toLowerCase().includes(this.designationSearch.toLowerCase()) ||
          item.department.toLowerCase().includes(this.designationSearch.toLowerCase())
        );
      }
      return filtered.slice((this.currentPage - 1) * this.entriesPerPage, this.currentPage * this.entriesPerPage);
    },
  },
  methods: {
    openDepartmentModal() {
      this.isDepartmentModalOpen = true;
      this.newDepartmentName = '';
      this.editDepartmentIndex = null;
    },
    closeDepartmentModal() {
      this.isDepartmentModalOpen = false;
    },
    openDesignationModal() {
      this.isModalOpen = true;
      this.selectedDepartment = '';
      this.newDesignation = '';
      this.editIndex = null;
    },
    closeDesignationModal() {
      this.isModalOpen = false;
    },
    editDepartment(index) {
      this.newDepartmentName = this.departments[index].name; // Set to existing name
      this.editDepartmentIndex = index; // Set the index for editing
      this.isDepartmentModalOpen = true; // Open the modal
    },

    removeDepartment(index) {
      this.departments.splice(index, 1);
      this.saveData();
    },
    editDesignation(index) {
      this.selectedDepartment = this.designations[index].department;
      this.newDesignation = this.designations[index].designation;
      this.editIndex = index;
      this.isModalOpen = true;
    },
    removeDesignation(index) {
      this.designations.splice(index, 1);
      this.saveData();
    },
    submitDepartment() {
      if (this.editDepartmentIndex !== null) { // Edit existing department
        this.departments[this.editDepartmentIndex].name = this.newDepartmentName;
      } else { // Add new department
        this.departments.push({ name: this.newDepartmentName });
      }
      this.saveData(); // Save updated data to localStorage
      this.closeDepartmentModal(); // Close the modal
    },

    submitDesignation() {
      if (this.editIndex !== null) { // Edit existing designation
        this.designations[this.editIndex].designation = this.newDesignation;
        this.designations[this.editIndex].department = this.selectedDepartment;
      } else { // Add new designation
        this.designations.push({ department: this.selectedDepartment, designation: this.newDesignation });
      }
      this.saveData();
      this.closeDesignationModal();
    },
    saveData() {
      const data = {
        departments: this.departments,
        designations: this.designations,
      };
      localStorage.setItem('departmentDesignationData', JSON.stringify(data));
    },
    loadData() {
      const data = JSON.parse(localStorage.getItem('departmentDesignationData'));
      if (data) {
        this.departments = data.departments || [];
        this.designations = data.designations || [];
      }
    },
  },
  mounted() {
    this.loadData();
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
  width: 60px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
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
