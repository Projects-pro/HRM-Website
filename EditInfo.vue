<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h2 class="text-2xl font-bold mb-4">Edit {{ section }}</h2>
      <form @submit.prevent="saveChanges">
        <div v-if="section === 'personalInfo'">
          <label>Gender:</label>
          <input v-model="editableData.gender" class="border p-2 w-full" />
          <label>Date of Birth:</label>
          <input v-model="editableData.dob" type="text" class="border p-2 w-full" placeholder="DD-MM-YYYY" />
          <label>Marital Status:</label>
          <input v-model="editableData.maritalStatus" class="border p-2 w-full" />
          <label>Nationality:</label>
          <input v-model="editableData.nationality" class="border p-2 w-full" />
        </div>

        <div v-if="section === 'emergencyContact'">
          <label>Name:</label>
          <input v-model="editableData.emergencyContactName" class="border p-2 w-full" />
          <label>Contact Number:</label>
          <input v-model="editableData.emergencyContactNumber" class="border p-2 w-full" />
          <label>Relationship:</label>
          <input v-model="editableData.relationship" class="border p-2 w-full" />
        </div>

        <div v-if="section === 'bankInfo'">
          <label>Bank Name:</label>
          <input v-model="editableData.bankName" class="border p-2 w-full" />
          <label>Account Number:</label>
          <input v-model="editableData.accountNumber" class="border p-2 w-full" />
          <label>IFSC Code:</label>
          <input v-model="editableData.ifscCode" class="border p-2 w-full" />
        </div>

        <div v-if="section === 'educationInfo'">
          <label>Institution:</label>
          <input v-model="editableData.institution" class="border p-2 w-full" />
          <label>Degree:</label>
          <input v-model="editableData.degree" class="border p-2 w-full" />
          <label>University:</label>
          <input v-model="editableData.university" class="border p-2 w-full" />
          <label>Year of Passing:</label>
          <input v-model="editableData.yearOfPassing" type="number" class="border p-2 w-full" />
        </div>

        <div v-if="section === 'experienceInfo'">
          <label>Job Title:</label>
          <input v-model="editableData.jobTitle" class="border p-2 w-full" />
          <label>Years of Experience:</label>
          <input v-model="editableData.yearsOfExperience" type="number" class="border p-2 w-full" />
          <label>Company Name:</label>
          <input v-model="editableData.companyName" class="border p-2 w-full" />
        </div>

        <div v-if="section === 'addressInfo'">
          <label>Address:</label>
          <input v-model="editableData.address" class="border p-2 w-full" />
          <label>Street:</label>
          <input v-model="editableData.street" class="border p-2 w-full" />
          <label>City:</label>
          <input v-model="editableData.city" class="border p-2 w-full" />
          <label>State:</label>
          <input v-model="editableData.state" class="border p-2 w-full" />
          <label>Postal Code:</label>
          <input v-model="editableData.postalCode" class="border p-2 w-full" />
          <label>Country:</label>
          <input v-model="editableData.country" class="border p-2 w-full" />
        </div>

        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
        <button type="button" @click="closeModal" class="ml-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: Boolean,
    section: String,
    data: Object,
  },
  data() {
    return {
      editableData: { ...this.data }, // Clone data to editableData
    };
  },
  watch: {
    data: function (newData) {
      // Directly assign newData to editableData
      this.editableData = { ...newData };
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    saveChanges() {
      this.$emit('save', this.editableData);
      this.closeModal();
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
}
</style>
