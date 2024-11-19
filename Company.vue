<template>
  <div class="flex justify-center items-center w-screen">
    <Layout :issidebar="true" />

    <div class="w-full h-screen overflow-y-auto">
      <Layout :isheader="true" />

      <div class="max-w-full mx-auto p-5 sm:p-10 lg:p-14">
        <h1 class="text-3xl font-bold mb-6 text-center mt-8 text-gray-800">Company Profile</h1>

        <div class="flex justify-between items-center mb-8">
          <div class="w-full max-w-md">
            <input v-model="searchQuery" type="text" placeholder="Search Company..." class="input-text" />
          </div>
          <button @click="navigateToAddCompany"
            class="bg-green-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <fa icon="plus" /> Add Company
          </button>
        </div>

        <div class="flex justify-center">
          <div class="card">
            <div class="flex justify-between mb-4">
              <div></div> <!-- Empty div for spacing -->
              <div class="flex gap-4">
                <fa icon="pen-to-square" class="cursor-pointer text-gray-600 hover:text-blue-600"
                  @click="openEditModal" />
                <fa icon="trash-can" class="cursor-pointer text-gray-600 hover:text-red-600" @click="deleteCompany" />
              </div>
            </div>

            <div class="flex flex-col items-center mb-6">
              <div
                class="w-24 h-24 border rounded-full flex items-center justify-center bg-gray-100 shadow-md relative">
                <input type="file" ref="fileInput" class="absolute inset-0 opacity-0 cursor-pointer"
                  @change="onImageUpload" accept=".jpg, .png, .gif" />
              </div>
              <h1 v-if="companyName" class="text-2xl font-bold mt-4">{{ companyName }}</h1>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="flex items-center">
                <p class="text-gray-500 font-medium mr-2">Contact Person:</p>
                <p class="text-orange-500">{{ contactPerson }}</p>
              </div>
              <div class="flex items-center">
                <p class="text-gray-500 font-medium mr-2">Phone:</p>
                <p class="text-orange-500">{{ phone }}</p>
              </div>
              <div class="flex items-center">
                <p class="text-gray-500 font-medium mr-2">Email:</p>
                <p class="text-orange-500">{{ email }}</p>
              </div>
              <div class="flex items-center">
                <p class="text-gray-500 font-medium mr-2">Website URL:</p>
                <p class="text-orange-500"><a :href="website" target="_blank" class="hover:underline">{{ website }}</a>
                </p>
              </div>
              <div class="col-span-2 flex items-center">
                <p class="text-gray-500 font-medium mr-2">Address:</p>
                <p class="text-orange-500">{{ address }}</p>
              </div>
              <div class="flex items-center">
                <p class="text-gray-500 font-medium mr-2">Country:</p>
                <p class="text-orange-500">{{ country }}</p>
              </div>
              <div class="flex items-center">
                <p class="text-gray-500 font-medium mr-2">City:</p>
                <p class="text-orange-500">{{ city }}</p>
              </div>
              <div class="flex items-center">
                <p class="text-gray-500 font-medium mr-2">State/Province:</p>
                <p class="text-orange-500">{{ state }}</p>
              </div>
              <div class="flex items-center">
                <p class="text-gray-500 font-medium mr-2">Postal Code:</p>
                <p class="text-orange-500">{{ postalCode }}</p>
              </div>
            </div>
          </div>
        </div>

        <EditCompanyModal :isOpen="isEditModalOpen" :companyData="companyProfile" @close="closeEditModal"
          @save="updateCompanyProfile" />
      </div>
    </div>
  </div>
</template>


<script>
import Layout from './Layout.vue';
import EditCompanyModal from './EditCompanyModal.vue';
export default {
  components: {
    Layout,
    EditCompanyModal,
  },
  data() {
    const companyProfile = JSON.parse(localStorage.getItem('companyProfile')) || {};
    // console.log(companyProfile);
    return {
      searchQuery: '',
      companyProfile,
      isEditModalOpen: false,
    };
  },
  computed: {
    companyLogo() {
      return this.companyProfile.logo || '';
    },
    companyName() {
      return this.companyProfile.companyName || 'Company Name';  // Updated key
    },
    contactPerson() {
      return this.companyProfile.contactPerson || 'N/A';
    },
    phone() {
      return this.companyProfile.phoneNumber || 'N/A';  // Updated key
    },
    email() {
      return this.companyProfile.email || 'N/A';
    },
    website() {
      return this.companyProfile.website || 'N/A';
    },
    address() {
      return this.companyProfile.address || 'N/A';
    },
    country() {
      return this.companyProfile.country || 'N/A';
    },
    city() {
      return this.companyProfile.city || 'N/A';
    },
    state() {
      return this.companyProfile.state || 'N/A';
    },
    postalCode() {
      return this.companyProfile.postalCode || 'N/A';
    },
  },
  methods: {
    navigateToAddCompany() {
      this.$router.push({ name: 'CompanyProfile' });
    },
    openEditModal() {
      this.isEditModalOpen = true;
    },
    closeEditModal() {
      this.isEditModalOpen = false;
    },
    updateCompanyProfile(updatedData) {
      this.companyProfile = { ...this.companyProfile, ...updatedData };
      localStorage.setItem('companyProfile', JSON.stringify(this.companyProfile));
      this.closeEditModal();
    },
    deleteCompany() {
      // Logic to delete the company
      if (confirm("Are you sure you want to delete this company?")) {
        localStorage.removeItem('companyProfile');
        this.companyProfile = {}; // Reset the profile
        alert("Company deleted successfully.");
      }
    },
  }
};
</script>

<style scoped>
.input-text {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.input-text:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}

.card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 600px;
  /* Fixed width for card */
  width: 100%;
  /* Responsive width */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flex-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fa {
  font-size: 1.5rem;
}
</style>
