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
                <h1 class="text-3xl font-bold mb-6 text-center mt-[70px] text-gray-800">Manage Categories</h1>
                <!-- Tab Navigation -->
                <div class="flex border-b mb-6">
                    <button v-for="tab in tabs" :key="tab" @click="currentTab = tab" :class="{
                        'border-b-4 border-yellow-400 text-yellow-400': currentTab === tab,
                        'text-gray-600 hover:text-gray-800': currentTab !== tab
                    }" class="px-6 py-2 transition-all duration-200">
                        {{ tab }}
                    </button>
                </div>

                <!-- Search Bar -->
                <div class="flex justify-between items-center mb-4">
                    <input v-model="searchQuery" placeholder="Search Categories..."
                        class="border rounded-lg px-4 py-2 w-1/4" />
                    <fa icon="plus" @click="showAddModal = true"
                        class="bg-green-500 text-white px-4 py-2 rounded ml-4" />
                </div>

                <!-- Categories Table -->
                <table class="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr class="bg-gray-100 text-gray-700">
                            <th class="py-2 px-4 text-left">S.No</th>
                            <th class="py-2 px-4 text-left">{{ currentTab }} Categories</th>
                            <th class="py-2 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(category, index) in filteredCategories" :key="index"
                            :class="{ 'bg-white': index % 2 === 0, 'bg-gray-100': index % 2 !== 0 }">
                            <td class="py-2 px-4 text-left">{{ index + 1 }}</td>
                            <td class="py-2 px-4 text-left">{{ category }}</td>
                            <td class="py-2 px-4 text-left">
                                <div class="tooltip-container">
                                    <fa icon="edit" @click="openEditModal(category)"
                                        class="text-blue-500 hover:text-blue-700" />
                                    <span class="tooltip">Edit</span>
                                </div>
                                <div class="tooltip-container">
                                    <fa icon="trash-can" @click="prepareDelete(category)"
                                        class="text-red-500 hover:text-red-700 ml-4" />
                                    <span class="tooltip">Delete</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Add Item Modal -->
                <div v-if="showAddModal"
                    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div class="bg-white rounded-lg mt-[50px] p-6 w-6/12">
                        <h2 class="text-xl text-center font-semibold mb-4">Add {{ currentTab }}</h2>
                        <form @submit.prevent="submitItem">
                            <div class="mb-4">
                                <label class="block text-gray-700">Category Name:</label>
                                <input v-model="newCategory" class="border rounded-lg px-4 py-2 w-full" required />
                            </div>
                            <div class="flex justify-end">
                                <button type="button" @click="showAddModal = false"
                                    class="bg-gray-300 px-4 py-2 rounded-lg mr-2">Cancel</button>
                                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg">Add
                                    Category</button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Edit Item Modal -->
                <div v-if="showEditModal"
                    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div class="bg-white rounded-lg mt-[50px] p-6 w-6/12">
                        <h2 class="text-xl text-center font-semibold mb-4">Edit {{ currentTab }}</h2>
                        <form @submit.prevent="updateCategory">
                            <div class="mb-4">
                                <label class="block text-gray-700">Category Name:</label>
                                <input v-model="editCategoryName" class="border rounded-lg px-4 py-2 w-full" required />
                            </div>
                            <div class="flex justify-end">
                                <button type="button" @click="showEditModal = false"
                                    class="bg-gray-300 px-4 py-2 rounded-lg mr-2">Cancel</button>
                                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg">Update
                                    Category</button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Confirmation Alert -->
                <div v-if="showConfirmationMessage"
                    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div class="bg-white rounded-lg mt-[50px] p-6 w-6/12 text-center">
                        <h2 class="text-xl font-semibold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete the category "{{ categoryToDelete }}"? This action cannot be
                            undone.</p>
                        <div class="flex justify-center mt-4">
                            <button @click="handleConfirmDeletion"
                                class="bg-red-500 text-white px-4 py-2 rounded-lg mr-2">Yes, Delete</button>
                            <button @click="handleCancelDeletion"
                                class="bg-gray-300 px-4 py-2 rounded-lg">Cancel</button>
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
            showAddModal: false,
            showEditModal: false,
            showConfirmationMessage: false,
            categoryBeingEdited: null,
            currentTab: 'Bonus',
            newCategory: '',
            editCategoryName: '',
            categoryToDelete: null,
            bonusCategories: [],
            deductionCategories: [],
            searchQuery: '',
            tabs: ['Bonus', 'Deductions'],
        };
    },
    computed: {
        filteredCategories() {
            const categories = this.currentTab === 'Bonus' ? this.bonusCategories : this.deductionCategories;
            return categories.filter(category => category.toLowerCase().includes(this.searchQuery.toLowerCase()));
        }
    },

    methods: {
        saveData() {
            const dataToSave = {
                BonusCategory: this.bonusCategories,
                DeductionCategory: this.deductionCategories
            };
            localStorage.setItem('Payroll', JSON.stringify(dataToSave));
        },
        submitItem() {
            if (this.newCategory) {
                if (this.currentTab === 'Bonus') {
                    this.bonusCategories.push(this.newCategory);
                } else {
                    this.deductionCategories.push(this.newCategory);
                }
                this.saveData(); // Save data to localStorage
            }
            this.newCategory = '';
            this.showAddModal = false;
        },
        prepareDelete(category) {
            this.categoryToDelete = category;
            this.showConfirmationMessage = true;
        },
        confirmDelete(category) {
            if (this.currentTab === 'Bonus') {
                this.bonusCategories = this.bonusCategories.filter(cat => cat !== category);
            } else {
                this.deductionCategories = this.deductionCategories.filter(cat => cat !== category);
            }
            this.categoryToDelete = null;
            this.saveData(); // Save data to localStorage
        },
        handleConfirmDeletion() {
            if (this.categoryToDelete) {
                this.confirmDelete(this.categoryToDelete);
                this.showConfirmationMessage = false;
            }
        },
        handleCancelDeletion() {
            this.showConfirmationMessage = false;
        },
        openEditModal(category) {
            this.editCategoryName = category;
            this.categoryBeingEdited = category;
            this.showEditModal = true;
        },
        updateCategory() {
            const type = this.currentTab === 'Bonus' ? 'Bonus' : 'Deductions';
            const categories = type === 'Bonus' ? this.bonusCategories : this.deductionCategories;

            // Store the trimmed new category name
            const newCategoryName = this.editCategoryName.trim();

            // Find index of the original category being edited
            const index = categories.findIndex(category => category.trim().toLowerCase() === this.categoryBeingEdited.trim().toLowerCase());

            console.log("Before Update:");
            console.log("Current Categories:", categories);
            console.log("Editing Category:", newCategoryName);
            console.log("Index Found:", index);

            if (index !== -1) {
                // Update the category name with the trimmed new name
                categories[index] = newCategoryName;
                console.log("Updated Category:", newCategoryName);
                console.log("Categories After Update:", categories);
                this.saveData(); // Save updated categories to localStorage
            } else {
                console.warn("Category not found for update.");
            }

            this.showEditModal = false; // Close the modal
        }

    },
    created() {
        const storedData = JSON.parse(localStorage.getItem('Payroll')) || {
            BonusCategory: [],
            DeductionCategory: []
        };
        this.bonusCategories = storedData.BonusCategory || [];
        this.deductionCategories = storedData.DeductionCategory || [];
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
