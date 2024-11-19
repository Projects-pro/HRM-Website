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
      <!-- Full Width Background Color -->
      <div class="max-w-full m-5 sm:m-10 lg:m-14 2xl:m-14">
        <h1 class="text-3xl font-bold mb-6 text-center mt-[70px] text-gray-800">Holiday Management</h1>

        <div class="flex justify-between mb-4 ml-40">
          <input v-model="searchQuery" type="text" placeholder="Search Holidays"
          class="border border-gray-300 rounded-md py-2 px-4 w-1/4" />
          <button type="submit" @click="openAddPopup" class="bg-orange-500 text-white px-4 py-2 rounded mx-40">
            <fa icon="plus" />Add Holiday
          </button>
        </div>

        <!-- Holiday Table -->
        <table class="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th @click="toggleSortOrder"
                class="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase border text-center">
                Date &nbsp;
                <fa icon="arrow-up"
                  :class="{ 'text-yellow-300': sortOrder === 'asc', 'text-white': sortOrder !== 'asc' }" />
                <fa icon="arrow-down"
                  :class="{ 'text-yellow-300': sortOrder === 'desc', 'text-white': sortOrder !== 'desc' }" />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium  uppercase border  text-center">
                Holiday Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase border text-center">
                Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(holiday, index) in filteredHolidays" :key="holiday.date"  :class="{ 'bg-white': index % 2 === 0, 'bg-gray-100': index % 2 !== 0 }">
              <td class="px-6 py-4 text-sm text-gray-900 border">{{ formatDate(holiday.date) }}</td>
              <td class="px-6 py-4 text-sm text-gray-500 border">{{ holiday.name }}</td>
              <td class="px-6 py-4 text-sm border justify-center">
                <div class="tooltip-container">
                  <fa icon="pen-to-square" @click="openEditPopup(index)" class="text-blue-500 hover:text-blue-700" />
                  <span class="tooltip">Edit</span>
                </div>
                <div class="tooltip-container">
                  <fa icon="trash-can" @click="deleteHoliday(index)" class="text-red-500 hover:text-red-700 ml-4" />
                  <span class="tooltip">Delete</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Add Holiday Popup -->
        <div v-if="isAddPopupOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div class="bg-white rounded-lg w-4/12 p-6">
            <h2 class="text-xl font-bold mb-4">Add New Holiday</h2>
            <label for="newDate" class="block mb-2">Holiday Date:</label>
            <input v-model="newHoliday.date" type="date" id="newDate" class="border px-4 py-2 w-full mb-4" required />

            <label for="newName" class="block mb-2">Holiday Name:</label>
            <input v-model="newHoliday.name" type="text" id="newName" class="border px-4 py-2 w-full mb-4" required />
            <div class="flex justify-center">
              <button @click="addHoliday" class="bg-green-500 text-white px-4 py-2 rounded">Add Holiday</button>
              <button @click="closeAddPopup" class="bg-red-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
            </div>
          </div>
        </div>

        <!-- Edit Popup -->
        <div v-if="isEditPopupOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div class="bg-white rounded-lg w-4/12 p-6">
            <h2 class="text-xl font-bold mb-4">Edit Holiday</h2>
            <label for="holidayDate" class="block mb-2">Date:</label>
            <input v-model="editHoliday.date" type="date" id="holidayDate" class="border px-4 py-2 w-full mb-4" />

            <label for="holidayName" class="block mb-2">Holiday Name:</label>
            <input v-model="editHoliday.name" type="text" id="holidayName" class="border px-4 py-2 w-full mb-4" />
            <div class="flex justify-center">
              <button @click="saveEdit" class="bg-green-500 text-white px-4 py-2 rounded">Save</button>
              <button @click="closeEditPopup" class="bg-red-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
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
      newHoliday: { date: '', name: '' },
      holidays: JSON.parse(localStorage.getItem('holidays')) || [],
      isAddPopupOpen: false,
      isEditPopupOpen: false,
      editHoliday: { date: '', name: '' },
      editIndex: null,
      searchQuery: '',
      sortOrder: 'asc', // New property for sort order
    };
  },
  computed: {
    filteredHolidays() {
      const sortedHolidays = [...this.holidays].sort((a, b) => {
        const dateA = new Date(a.date.split('-').reverse().join('-'));
        const dateB = new Date(b.date.split('-').reverse().join('-'));
        return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });

      return sortedHolidays.filter(holiday =>
        holiday.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    formatDateForStorage(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    },
    formatDate(date) {
      const parts = date.split('-');
      return `${parts[0]}-${parts[1]}-${parts[2]}`; // Display in dd-mm-yyyy format
    },
    openAddPopup() {
      this.isAddPopupOpen = true;
    },
    closeAddPopup() {
      this.isAddPopupOpen = false;
      this.newHoliday = { date: '', name: '' }; // Reset the form
    },
    addHoliday() {
      if (!this.newHoliday.date || !this.newHoliday.name) return; // Simple validation
      const formattedDate = this.formatDateForStorage(this.newHoliday.date);

      this.holidays.push({ date: formattedDate, name: this.newHoliday.name });
      localStorage.setItem('holidays', JSON.stringify(this.holidays));
      this.closeAddPopup();
    },
    deleteHoliday(index) {
      this.holidays.splice(index, 1);
      localStorage.setItem('holidays', JSON.stringify(this.holidays));
    },
    openEditPopup(index) {
      this.editIndex = index;
      this.editHoliday = { ...this.holidays[index] }; // Copy the holiday to be edited
      this.isEditPopupOpen = true;
    },
    closeEditPopup() {
      this.isEditPopupOpen = false;
    },
    saveEdit() {
      this.holidays[this.editIndex] = this.editHoliday;
      localStorage.setItem('holidays', JSON.stringify(this.holidays));
      this.closeEditPopup();
    },
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    },
  },
};
</script>

<style scoped>
.fixed {
  position: fixed;
}

.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  left: 50%;
  bottom: 125%;
  transform: translateX(-50%);
  background-color: black;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.875rem;
  transition: visibility 0s, opacity 0.2s ease-in-out;
  white-space: nowrap;
}

.tooltip-container:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

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


td {
  border: none;
}
</style>
