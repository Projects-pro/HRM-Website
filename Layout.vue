<template>
    <!-- Sidebar -->
    <div v-if="issidebar" class="bg-gray-900 text-white h-screen overflow-y-auto w-64">
        <!-- Sidebar Header -->
        <div class="h-16 w-full bg-gray-900 flex items-center px-4 justify-between">
            <h3 class="font-bold text-xl">Dashboard</h3>
        </div>

        <!-- Navigation Links -->
        <nav class="overflow-y-auto flex-grow">
            <ul class="py-4 space-y-2">
                <!-- Attendance Section -->
                <li>
                    <div @click="toggleDropdown('attendance')"
                        class="cursor-pointer flex items-center justify-between p-2 hover:bg-gray-700">
                        <div class="flex items-center">
                            <fa icon="user-clock" class="mr-2" />
                            <span>Attendance</span>
                        </div>
                        <fa :icon="dropdowns.attendance ? 'chevron-down' : 'chevron-right'" />
                    </div>
                    <ul v-show="dropdowns.attendance" class="ml-6 space-y-2">
                        <li @click="goToAtten" class="cursor-pointer hover:bg-blue-500 p-2">
                            <fa icon="user-pen" class="mr-2" />
                            <span>Mark Attendance</span>
                        </li>
                        <li @click="goTonext" class="cursor-pointer hover:bg-blue-500 p-2">
                            <fa icon="calendar-day" class="mr-2" />
                            <span>Today's Attendance</span>
                        </li>
                        <li @click="gotoMon" class="cursor-pointer hover:bg-blue-500 p-2">
                            <fa icon="file-circle-check" class="mr-2" />
                            <span>Attendance Sheet</span>
                        </li>
                        <li @click="gotoOver" class="cursor-pointer hover:bg-blue-500 p-2">
                            <fa icon="comments-dollar" class="mr-2" />
                            <span>Overtime</span>
                        </li>
                    </ul>
                </li>

                <!-- Employee Section -->
                <li>
                    <div @click="toggleDropdown('employee')"
                        class="cursor-pointer flex items-center justify-between p-2 hover:bg-blue-600">
                        <div class="flex items-center">
                            <fa icon="user-group" class="mr-2" />
                            <span>Employee</span>
                        </div>
                        <fa :icon="dropdowns.employee ? 'chevron-down' : 'chevron-right'" />
                    </div>
                    <ul v-show="dropdowns.employee" class="ml-6 space-y-2">
                        <li @click="gotoEmp" class="cursor-pointer hover:bg-blue-500 p-2">
                            <fa icon="user" class="mr-2" />
                            <span>Employee Details</span>
                        </li>
                        <li @click="gotoDeleteEmp" class="cursor-pointer hover:bg-blue-500 p-2">
                            <fa icon="user-minus" class="mr-2" />
                            <span>Delete Employee</span>
                        </li>
                    </ul>
                </li>

                <!-- Authentication Section -->
                <li>
                    <div @click="toggleDropdown('authentication')"
                        class="cursor-pointer flex items-center justify-between p-2 hover:bg-blue-600">
                        <div class="flex items-center">
                            <fa icon="user-check" class="mr-2" />
                            <span>Authentication</span>
                        </div>
                        <fa :icon="dropdowns.authentication ? 'chevron-down' : 'chevron-right'" />
                    </div>
                    <ul v-show="dropdowns.authentication" class="ml-6 space-y-2">
                        <li @click="gotoSign" class="cursor-pointer hover:bg-blue-500 p-2">
                            <fa icon="user-lock" class="mr-2" />
                            <span>Sign In</span>
                        </li>
                        <li @click="gotoSignup" class="cursor-pointer hover:bg-blue-500 p-2">
                            <fa icon="user-gear" class="mr-2" />
                            <span>Sign Up</span>
                        </li>
                    </ul>
                </li>

                <!-- Payroll Section -->
                <li>
                    <div @click="toggleDropdown('payroll')"
                        class="cursor-pointer flex items-center justify-between p-2 hover:bg-blue-600">
                        <div class="flex items-center">
                            <fa icon="money-bill" class="mr-2" />
                            <span>PayRoll</span>
                        </div>
                        <fa :icon="dropdowns.payroll ? 'chevron-down' : 'chevron-right'" />
                    </div>
                    <ul v-show="dropdowns.payroll" class="ml-6 space-y-2">
                        <li @click="goToSalary" class="cursor-pointer hover:bg-blue-500 p-2">
                            <fa icon="sack-dollar" class="mr-2" />
                            <span>Salary Details</span>
                        </li>
                        <li @click="goToPay" class="cursor-pointer hover:bg-blue-500 p-2">
                            <fa icon="money-check-dollar" class="mr-2" />
                            <span>PayRoll Items</span>
                        </li>
                    </ul>
                </li>

                <!-- Settings Section -->
                <li>
                    <div @click="toggleDropdown('settings')"
                        class="cursor-pointer flex items-center justify-between p-2 hover:bg-blue-600">
                        <div class="flex items-center">
                            <fa icon="gears" class="mr-2" />
                            <span>Settings</span>
                        </div>
                        <fa :icon="dropdowns.settings ? 'chevron-down' : 'chevron-right'" />
                    </div>
                    <ul v-show="dropdowns.settings" class="ml-6 space-y-2">
                        <li @click="goToHolidayList" class="cursor-pointer hover:bg-blue-500 p-2">
                            <fa icon="calendar-check" class="mr-2" />
                            <span>Holiday List</span>
                        </li>
                        <li @click="gotoDep" class="cursor-pointer hover:bg-blue-500 p-2">
                            <fa icon="building-user" class="mr-2" />
                            <span>Department</span>
                        </li>
                        <li @click="goToCom" class="cursor-pointer hover:bg-blue-500 p-2">
                            <fa icon="building-columns" class="mr-2" />
                            <span>Company Settings</span>
                        </li>
                        <!-- <li @click="gotoAttCat" class="cursor-pointer hover:bg-blue-500 p-2">
                            <fa icon="fingerprint" class="mr-2" />
                            <span>Attendance Category</span>
                        </li> -->
                        <li @click="goToOt" class="cursor-pointer hover:bg-blue-500 p-2">
                            <fa icon="business-time" class="mr-2" />
                            <span>OverTime Details</span>
                        </li>
                        <li @click="gotoAddCatogery" class="cursor-pointer hover:bg-blue-500 p-2">
                            <fa icon="list" class="mr-2" />
                            <span>Add Category</span>
                        </li>
                        <li @click="gotoEmpType" class="cursor-pointer hover:bg-blue-500 p-2">
                            <fa icon="list" class="mr-2" />
                            <span>Employee Type</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    </div>

    <!-- Navbar -->
    <div v-if="isheader" class="fixed top-0 left-64 right-0 h-16 bg-gray-900 shadow-md flex items-center justify-between px-4 z-10">
        <div class="relative w-1/2">
            <input type="text" placeholder="Search here" class="bg-gray-100 text-black px-4 py-2 rounded-full w-full">
            <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <fa icon="search" />
            </span>
        </div>

        <div class="relative">
            <button @click="toggleAdminDropdown" class="flex items-center text-white px-4 py-2 hover:bg-white-700">
                Admin
                <fa :icon="dropdowns.adminDropdownOpen ? 'chevron-up' : 'chevron-down'" class="ml-1" />
            </button>
            <ul v-show="dropdowns.adminDropdownOpen" class="absolute left-0 mt-2 w-48 bg-white-800 rounded shadow-lg z-0">
                <li @click="gotoUserList" class="cursor-pointer hover:bg-blue-500 p-2">
                    <span>My Profile</span>
                </li>
                <li @click="gotoAdminSettings" class="cursor-pointer hover:bg-blue-500 p-2">
                    <span>Settings</span>
                </li>
                <li @click="gotoSign" class="cursor-pointer hover:bg-blue-500 p-2">
                    <span>LogOut</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        issidebar: Boolean,
        isheader: Boolean
    },
    data() {
        return {
            dropdowns: {
                attendance: false,
                employee: false,
                holiday: false,
                details: false,
                settings: false,
                language: false,
                authentication: false,
                adminDropdownOpen: false,
            },
        };
    },
    methods: {
        toggleDropdown(section) {
            console.log(`Toggling dropdown for section: ${section}`);
            if (this.dropdowns[section]) {
                console.log(`Keeping ${section} dropdown open.`);
                // If the clicked section is already open, keep it open
                return;
            }
            // Close all other dropdowns
            Object.keys(this.dropdowns).forEach(key => {
                this.dropdowns[key] = false;
            });
            this.dropdowns[section] = true; // Open the clicked dropdown
            console.log(`Opened ${section} dropdown.`);
        },
        toggleAdminDropdown() {
            this.dropdowns.adminDropdownOpen = !this.dropdowns.adminDropdownOpen;
        },
        gotoUserList() {
            this.$router.push('/userlist');
        },
        gotoAdminSettings() {
            this.$router.push('/adminsettings');
        },
        goTonext() {
            this.$router.push('/todayattendance');
        },
        gotoMon() {
            this.$router.push('/monthlyattendance');
        },
        gotoEmp() {
            this.$router.push('/employeedetails');
        },
        goToHolidayList() {
            this.$router.push('/holidaylist');
        },
        goToAtten() {
            this.$router.push('/attendance');
        },
        gotoDeleteEmp() {
            this.$router.push('/deleteemployee');
        },
        goToSalary() {
            this.$router.push('/salary');
        },
        goToPay() {
            this.$router.push('/payrollitems');
        },
        goToOt() {
            this.$router.push('/overtimetab');
        },
        gotoDes() {
            this.$router.push('/designation');
        },
        goToCom() {
            this.$router.push('/company');
        },
        gotoAttCat() {
            this.$router.push('/attencategory');
        },
        gotoSign() {
            this.$router.push('/signin');
        },
        gotoSignup() {
            this.$router.push('/signup');
        },
        gotoDep() {
            this.$router.push('/department');
        },
        gotoOver() {
            this.$router.push('/overtime');
        },
        gotoAddCatogery() {
            this.$router.push('/addcatogery');
        },
        gotoEmpType(){
            this.$router.push('/emptype')
        }
    },
};
</script>


