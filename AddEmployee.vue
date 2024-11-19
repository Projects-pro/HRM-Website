<template>
    <!-- Main content -->
    <div class="flex h-screen">
        <div class="w-80 bg-white border-gray-200">
            <Layout :issidebar="true" />
        </div>
        <div class="flex-grow flex flex-col overflow-hidden">
            <div>
                <Layout :isheader="true" />
            </div>
            <div class="flex-grow overflow-y-auto p-5 sm:p-10 lg:p-14">
                <div class="flex">
                    <aside class="w-1/4 bg-white p-6 border-r border-gray-200">
                        <nav>
                            <ul class="space-y-4">
                                <li><a href="#" class="block text-blue-600 font-semibold"
                                        @click.prevent="showDetails('personal')">Personal Details</a></li>
                                <li><a href="#" class="block text-gray-600 hover:text-blue-600"
                                        @click.prevent="showDetails('contact')">Contact Details</a></li>
                                <li><a href="#" class="block text-gray-600 hover:text-blue-600"
                                        @click.prevent="showDetails('emergency')">Emergency Contacts</a></li>
                                <li><a href="#" class="block text-gray-600 hover:text-blue-600"
                                        @click.prevent="showDetails('joining')">Job Details</a></li>
                                <li><a href="#" class="block text-gray-600 hover:text-blue-600"
                                        @click.prevent="showDetails('banking')">Banking Details</a></li>
                                <li><a href="#" class="block text-gray-600 hover:text-blue-600"
                                        @click.prevent="showDetails('education')">Educational Details</a></li>
                                <li><a href="#" class="block text-gray-600 hover:text-blue-600"
                                        @click.prevent="showDetails('experience')">Experience</a></li>
                            </ul>
                        </nav>
                    </aside>

                    <main class="w-3/4 bg-white p-8">
                        <h1 class="text-2xl font-bold mb-6 text-gray-700 text-center">{{ currentSectionTitle }}</h1>
                        <div v-if="currentSection === 'personal'" class="p-6 rounded-lg shadow-lg w-full">
                            <h2 class="text-lg font-semibold mb-4">Add Employee</h2>
                            <div class="flex items-start mb-4">
                                <div
                                    class="w-32 h-32 border rounded-full flex items-center justify-center shadow-md relative mr-6">
                                    <input type="file" ref="fileInput" class="absolute inset-0 opacity-0 cursor-pointer"
                                        @change="onImageUpload" accept=".jpg, .png, .gif" />
                                    <img v-if="employeeImage" :src="employeeImage" alt="Profile Image"
                                        class="w-full h-full object-cover rounded-full" />
                                    <span @click="triggerFileUpload"
                                        class="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg cursor-pointer"
                                        style="transform: translate(5%, 5%);">+</span>
                                    <p class="text-xs text-gray-500 mt-60 mb-6">Accepts .jpg, .png, .gif up to 1MB.
                                        Recommended
                                        dimensions: 200px X 200px</p>
                                </div>

                                <div class="flex-1">

                                    <!-- First Name -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                                        <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                            v-model="firstName" @blur="validateFirstName" />
                                        <p v-if="firstNameError" class="text-red-600 text-sm">{{ firstNameError }}</p>
                                    </div>

                                    <!-- Last Name -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                                        <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                            v-model="lastName" @blur="validateLastName" />
                                        <p v-if="lastNameError" class="text-red-600 text-sm">{{ lastNameError }}</p>
                                    </div>

                                    <!-- Employee ID -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-600 mb-1">Employee ID</label>
                                        <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                            v-model="employeeID" @blur="validateEmployeeID" />
                                        <p v-if="employeeIDError" class="text-red-600 text-sm">{{ employeeIDError }}</p>
                                    </div>

                                    <div>
                                        <label class="block text-sm font-medium text-gray-600 mb-1">Nationality</label>
                                        <select class="border border-gray-300 rounded-md p-2 w-full"
                                            v-model="nationality">
                                            <option value="">-- Select --</option>
                                            <option value="India">Indian</option>
                                            <option value="USA">USA</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-600 mb-1">Marital
                                            Status</label>
                                        <select class="border border-gray-300 rounded-md p-2 w-full"
                                            v-model="maritalStatus">
                                            <option value="">-- Select --</option>
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-600 mb-1">Date of
                                            Birth</label>
                                        <input type="date" class="border border-gray-300 rounded-md p-2 w-full"
                                            v-model="dob" />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                                        <div class="flex items-center space-x-4">
                                            <label class="inline-flex items-center">
                                                <input type="radio" class="form-radio" value="Male" v-model="gender" />
                                                <span class="ml-2">Male</span>
                                            </label>
                                            <label class="inline-flex items-center">
                                                <input type="radio" class="form-radio" value="Female"
                                                    v-model="gender" />
                                                <span class="ml-2">Female</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <transition name="fade">
                                <div v-if="successMessage" class="mt-4 bg-green-100 text-green-800 p-2 rounded-md">
                                    Successfully
                                    saved</div>
                            </transition>
                        </div>

                        <div v-if="currentSection === 'contact'">
                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Email</label>
                                    <input type="email" class="border border-gray-300 rounded-md p-2 w-full"
                                        placeholder="e.g., example@domain.com" v-model="email" @blur="validateEmail" />
                                    <p v-if="emailError" class="text-red-600 text-sm">{{ emailError }}</p>
                                </div>

                                <!-- Phone Number -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        placeholder="e.g., +1234567890" v-model="phoneNumber"
                                        @blur="validatePhoneNumber" />
                                    <p v-if="phoneNumberError" class="text-red-600 text-sm">{{ phoneNumberError }}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Address</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="address" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Street Address</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="street" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">City</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="city" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">State</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="state" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Postal Code</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="postalCode" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Country</label>
                                    <select class="border border-gray-300 rounded-md p-2 w-full" v-model="country">
                                        <option value="">-- Select Country --</option>
                                        <option value="India">India</option>
                                        <option value="USA">USA</option>
                                        <option value="Canada">Canada</option>
                                        <option value="UK">United Kingdom</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div v-if="currentSection === 'emergency'">
                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Emergency Contact
                                        Name</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="emergencyContactName" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Emergency Contact
                                        Number</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="emergencyContactNumber" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Relationship</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="relationship" />
                                </div>
                            </div>
                        </div>

                        <div v-if="currentSection === 'joining'">
                            <div class="grid grid-cols-2 gap-6">
                                <!-- Joining Date -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Joining Date</label>
                                    <input type="date" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="joiningDate" @blur="validateJoiningDate" />
                                    <p v-if="joiningDateError" class="text-red-600 text-sm">{{ joiningDateError }}</p>
                                </div>

                                <!-- Salary -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Salary</label>
                                    <input type="number" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="salary" @blur="validateSalary" />
                                    <p v-if="salaryError" class="text-red-600 text-sm">{{ salaryError }}</p>
                                </div>

                                <!-- Toggle Button for Active/Inactive Status -->
                                <div class="mb-6">
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Employee Status</label>
                                    <div @click="toggleStatus" class="flex items-center cursor-pointer">
                                        <div class="relative w-16 h-8 rounded-full transition-all duration-300"
                                            :class="isActive ? 'bg-green-500' : 'bg-gray-300'">
                                            <div class="absolute w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300"
                                                :style="isActive ? 'transform: translateX(100%);' : ''"></div>
                                        </div>
                                        <span class="ml-2 text-gray-600">{{ isActive ? 'Active' : 'Inactive' }}</span>
                                    </div>
                                </div>

                                <!-- Employee Type (Daily, Monthly, Hourly) -->
                                <div class="mb-6">
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Employee Type</label>
                                    <select v-model="employeeType" class="border border-gray-300 rounded-md p-2 w-full">
                                        <option value="" disabled>Select Employee Type</option>
                                        <option v-for="type in employeeTypes" :key="type" :value="type">
                                            {{ type }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Job Details - Company, Department, Designation -->
                                <div class="grid grid-cols-3 gap-6">
                                    <!-- Select Company -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-600 mb-1">Select
                                            Company:</label>
                                        <select v-model="selectedCompany"
                                            class="border border-gray-300 rounded-md p-2 w-full">
                                            <option value="">-- Select Company --</option>
                                            <option v-for="company in companies" :key="company.companyName"
                                                :value="company.companyName">
                                                {{ company.companyName }}
                                            </option>
                                        </select>
                                    </div>

                                    <!-- Select Department -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-600 mb-1">Select
                                            Department:</label>
                                        <select v-model="selectedDepartment" @change="updateDesignations"
                                            class="border border-gray-300 rounded-md p-2 w-full">
                                            <option value="">-- Select Department --</option>
                                            <option v-for="department in departments" :key="department.name"
                                                :value="department.name">
                                                {{ department.name }}
                                            </option>
                                        </select>
                                    </div>

                                    <!-- Select Designation -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-600 mb-1">Select
                                            Designation:</label>
                                        <select v-model="selectedDesignation"
                                            class="border border-gray-300 rounded-md p-2 w-full">
                                            <option value="">-- Select Designation --</option>
                                            <option v-for="designation in availableDesignations" :key="designation"
                                                :value="designation">
                                                {{ designation }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="currentSection === 'banking'">
                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Bank Name</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="bankName" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Account Number</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="accountNumber" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">IFSC Code</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="ifscCode" />
                                </div>
                            </div>
                        </div>

                        <div v-if="currentSection === 'education'">
                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Degree</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="degree" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Institution</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="institution" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">University</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="university" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Year of Passing</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="yearOfPassing" />
                                </div>
                            </div>
                        </div>

                        <div v-if="currentSection === 'experience'">
                            <div class="grid grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Company Name</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="companyName" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Job Title</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="jobTitle" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-600 mb-1">Years of
                                        Experience</label>
                                    <input type="text" class="border border-gray-300 rounded-md p-2 w-full"
                                        v-model="yearsOfExperience" />
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 flex justify-center">
                            <button @click="saveDetails" class="bg-blue-600 text-white px-4 py-2 rounded-md">Save &
                                Next</button>
                            <button @click="cancel"
                                class="bg-red-600 text-white px-4 py-2 rounded-md ml-4">Cancel</button>
                        </div>
                    </main>
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
            currentSection: 'personal',
            currentSectionTitle: 'Personal Details',
            employeeImage: null,
            firstName: '',
            middleName: '',
            lastName: '',
            employeeID: '',
            nationality: '',
            maritalStatus: '',
            dob: '',
            gender: '',
            email: '',
            phoneNumber: '',
            address: '',
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
            emergencyContactName: '',
            emergencyContactNumber: '',
            relationship: '',
            departments: [],
            designations: [],
            availableDesignations: [],
            selectedDepartment: '',
            selectedDesignation: '',
            companies: [],
            selectedCompany: '',
            joiningDate: '',
            salary: '',
            bankName: '',
            accountNumber: '',
            ifscCode: '',
            degree: '',
            institution: '',
            university: '',
            yearOfPassing: '',
            companyName: '',
            jobTitle: '',
            yearsOfExperience: '',
            successMessage: false,
            // employees: JSON.parse(localStorage.getItem('employees')) || {},
            isActive: "Active",
            firstNameError: '',
            lastNameError: '',
            employeeIDError: '',
            emailError: '',
            phoneNumberError: '',
            joiningDateError: '',
            salaryError: '',
            employeeTypes: [], // Initialize as empty array
            employeeType: '',
        };
    },
    created() {
        this.loadEmployeeTypes();
    },
    methods: {
        triggerFileUpload() {
            this.$refs.fileInput.click();
        },
        onImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.employeeImage = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },
        formatDate(date) {
            if (!date) return '';
            const parts = date.split('-');
            return `${parts[2]}-${parts[1]}-${parts[0]}`; // Convert to dd-mm-yyyy
        },
        fetchCompanies() {
            const companyProfile = JSON.parse(localStorage.getItem('companyProfile'));
            if (companyProfile) {
                this.companies = [companyProfile]; // Wrap in an array
            } else {
                this.companies = [];
            }
        },
        updateDesignations() {
            // Assuming designations is an array of objects with department and designation properties
            this.availableDesignations = this.designations
                .filter(item => item.department === this.selectedDepartment)
                .map(item => item.designation); // Extract only the designation names
            this.selectedDesignation = ''; // Reset the selected designation when department changes
        },
        validateFirstName() {
            this.firstNameError = this.firstName ? '' : 'First Name is required.';
        },
        validateLastName() {
            this.lastNameError = this.lastName ? '' : 'Last Name is required.';
        },
        validateEmployeeID() {
            this.employeeIDError = this.employeeID ? '' : 'Employee ID is required.';
        },
        validateEmail() {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!this.email) {
                this.emailError = 'Email is required.';
            } else if (!emailPattern.test(this.email)) {
                this.emailError = 'Enter a valid email (e.g., example@domain.com).';
            } else {
                this.emailError = '';
            }
        },
        validatePhoneNumber() {
            const phonePattern = /^[0-9]{10}$/; // Only allows exactly 10 digits
            if (!this.phoneNumber) {
                this.phoneNumberError = 'Phone Number is required.';
            } else if (!phonePattern.test(this.phoneNumber)) {
                this.phoneNumberError = 'Enter a valid phone number (10 digits only).';
            } else {
                this.phoneNumberError = '';
            }
        },
        validateJoiningDate() {
            this.joiningDateError = this.joiningDate ? '' : 'Joining Date is required.';
        },
        validateSalary() {
            this.salaryError = this.salary > 0 ? '' : 'Salary must be a positive number.';
        },
        loadEmployeeTypes() {
            const storedEmployeeTypes = localStorage.getItem('employeeTypes');
            if (storedEmployeeTypes) {
                this.employeeTypes = JSON.parse(storedEmployeeTypes);
            } else {
                this.employeeTypes = []; // Set to empty array if nothing is found in local storage
            }
        },
        saveDetails() {
            if (this.validateInput()) {
                const employee = {
                    name: [this.firstName, this.middleName, this.lastName].filter(Boolean).join(' '),
                    firstName: this.firstName || undefined,
                    lastName: this.lastName || undefined,
                    middleName: this.middleName || undefined,
                    employeeID: this.employeeID || undefined,
                    nationality: this.nationality || undefined,
                    maritalStatus: this.maritalStatus || undefined,
                    dob: this.formatDate(this.dob) || undefined,
                    gender: this.gender || undefined,
                    email: this.email || undefined,
                    phoneNumber: this.phoneNumber || undefined,
                    address: this.address || undefined,
                    street: this.street || undefined,
                    city: this.city || undefined,
                    state: this.state || undefined,
                    postalCode: this.postalCode || undefined,
                    country: this.country || undefined,
                    emergencyContactName: this.emergencyContactName || undefined,
                    emergencyContactNumber: this.emergencyContactNumber || undefined,
                    relationship: this.relationship || undefined,
                    joiningDate: this.formatDate(this.joiningDate) || undefined,
                    salary: this.salary || undefined,
                    department: this.selectedDepartment || undefined,
                    designation: this.selectedDesignation || undefined,
                    bankName: this.bankName || undefined,
                    accountNumber: this.accountNumber || undefined,
                    ifscCode: this.ifscCode || undefined,
                    degree: this.degree || undefined,
                    institution: this.institution || undefined,
                    university: this.university || undefined,
                    yearOfPassing: this.yearOfPassing || undefined,
                    companyName: this.companyName || undefined,
                    jobTitle: this.jobTitle || undefined,
                    yearsOfExperience: this.yearsOfExperience || undefined,
                    employeeImage: this.employeeImage || undefined,
                    isActive: this.isActive,
                    employeeType: this.employeeType || undefined
                };

                // Remove properties with undefined values
                Object.keys(employee).forEach(key => employee[key] === undefined && delete employee[key]);

                // Retrieve existing employees from localStorage and ensure it's an array
                let employees = JSON.parse(localStorage.getItem('employees')) || [];

                // If 'employees' is not an array, convert it
                if (typeof employees === 'object' && !Array.isArray(employees)) {
                    console.warn('Expected employees to be an array, but found an object. Converting to an array.');
                    employees = Object.values(employees);  // Convert object to an array
                }

                // Find if the employee already exists
                const employeeIndex = employees.findIndex(emp => emp.employeeID === this.employeeID);

                if (employeeIndex > -1) {
                    // Update existing employee
                    employees[employeeIndex] = employee;
                } else {
                    // Add new employee
                    employees.push(employee);
                }

                // Save updated employees array back to localStorage
                console.log('Saving employees:', employees); // Optional log
                localStorage.setItem('employees', JSON.stringify(employees));

                this.successMessage = true;
                this.moveToNextSection();
            }
        },
        moveToNextSection() {
            const sections = [
                'personal', 'contact', 'emergency', 'joining',
                'banking', 'education', 'experience'
            ];
            const currentIndex = sections.indexOf(this.currentSection);

            if (currentIndex < sections.length - 1) {
                this.currentSection = sections[currentIndex + 1];
                this.showDetails(this.currentSection);
            } else {
                this.notificationMessage = "All sections completed!"; // Set the message
                this.showNotification = true; // Flag to show the notification

                // Hide the notification and reset to the first section after 3 seconds
                setTimeout(() => {
                    this.showNotification = false;
                    this.notificationMessage = '';
                    this.currentSection = sections[0];
                    this.showDetails(this.currentSection);
                }, 3000); // Duration to display the message
            }
        },
        clearFields() {
            this.firstName = '';
            this.middleName = '';
            this.lastName = '';
            this.employeeID = '';
            this.nationality = '';
            this.maritalStatus = '';
            this.dob = '';
            this.gender = '';
            this.email = '';
            this.phoneNumber = '';
            this.address = '';
            this.street = '';
            this.city = '';
            this.state = '';
            this.postalCode = '';
            this.country = '';
            this.emergencyContactName = '';
            this.emergencyContactNumber = '';
            this.relationship = '';
            this.joiningDate = '';
            this.salary = '';
            this.bankName = '';
            this.accountNumber = '';
            this.ifscCode = '';
            this.degree = '';
            this.institution = '';
            this.university = '';
            this.yearOfPassing = '';
            this.companyName = '';
            this.jobTitle = '';
            this.yearsOfExperience = '';
            this.employeeImage = null;
        },
        validateInput() {
            if (!this.firstName || !this.lastName) {
                alert('First and Last Name are required!');
                return false;
            }
            // Additional validations can be added here
            return true;
        },
        showDetails(section) {
            this.currentSection = section;
            switch (section) {
                case 'personal':
                    this.currentSectionTitle = 'Personal Details';
                    break;
                case 'contact':
                    this.currentSectionTitle = 'Contact Details';
                    break;
                case 'emergency':
                    this.currentSectionTitle = 'Emergency Contacts';
                    break;
                case 'joining':
                    this.currentSectionTitle = 'Job Details';
                    break;
                case 'banking':
                    this.currentSectionTitle = 'Banking Details';
                    break;
                case 'education':
                    this.currentSectionTitle = 'Educational Details';
                    break;
                case 'experience':
                    this.currentSectionTitle = 'Experience';
                    break;
            }
        },
        cancel() {
            this.clearFields();
            this.showDetails('personal');
        },
    },
    mounted() {
        this.fetchCompanies();
        const departmentData = JSON.parse(localStorage.getItem('departmentDesignationData'));
        if (departmentData) {
            this.departments = departmentData.departments; // Assuming it's an array of department names
            this.designations = departmentData.designations; // Assuming an array of designations related to departments
        }
    },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0;
}
</style>
