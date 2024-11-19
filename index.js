import { createRouter, createWebHistory } from 'vue-router';
import EmployeeAttendance from '../components/Pages/Attendance.vue'
import Attendance from '../components/Pages/Attendance.vue';
import TodayAttendance from '../components/Pages/TodayAttendance.vue';
import MonthlyAttendance from '../components/Pages/MonthlyAttendance.vue';
import EmployeeDetails from '../components/Pages/EmployeeDetails.vue';
import HolidayList from '../components/Pages/HolidayList.vue';
import MonthlyTable from '../components/Pages/MonthlyTable.vue';
import AddEmployee from '../components/Pages/AddEmployee.vue';
import DeleteEmployee from '../components/Pages/DeleteEmployee.vue';
import SalarDetails from '../components/Pages/SalaryDetails.vue';
import EmployeeHistory from '../components/Pages/EmployeeHistory.vue';
import Company from '../components/Pages/Company.vue';
import SignIn from '../components/Pages/SignIn.vue';
import SignUp from '../components/Pages/SignUp.vue';
import Department from '../components/Pages/Department.vue';
import PayRollItems from '../components/Pages/PayRollItems.vue';
import Overtime from '../components/Pages/Overtime.vue';
import OvertimeDetail from '../components/Pages/OvertimeDetail.vue';
import AddCatogery from '../components/Pages/AddCatogery.vue';
import CompanyProfile from '../components/Pages/CompanyProfile.vue';
import PaySlip from '../components/Pages/PaySlip.vue';
import EmployeeTypes from '../components/Pages/EmployeeTypes.vue';





const routes = [
  { path: '/', name: 'EmployeeAttendance', component: EmployeeAttendance },
  { path: '/attendance', name: 'Attendance', component: Attendance },
  { path: '/todayattendance', name: 'TodayAttendance', component: TodayAttendance },
  { path: '/monthlyattendance', name: 'Monthlyattendance', component: MonthlyAttendance },
  { path: '/employeedetails', name: 'EmployeeDetails', component: EmployeeDetails },
  { path: '/holidaylist', name: 'HolidayList', component: HolidayList },
  { path: '/monthlytable', name: 'Monthlytable', component: MonthlyTable },
  { path: '/addemployee', name: 'AddEmployee', component: AddEmployee },
  { path: '/deleteEmployee', name: 'DeleteEmployee', component: DeleteEmployee },
  { path: '/salary', name: 'SalaryDetails', component: SalarDetails },
  { path: '/employeehistory', name: 'EmployeeHistory', component: EmployeeHistory },
  { path: '/payrollitems', name: 'PayRollItems', component: PayRollItems },
  { path: '/company', name: 'Company', component: Company },
  { path: '/companyprofile', name: 'CompanyProfile', component: CompanyProfile },
  { path: '/signin', name: 'SignIn', component: SignIn },
  { path: '/signup', name: 'SignUp', component: SignUp },
  { path: '/department', name: 'Department', component: Department },
  { path: '/overtime', name: 'Overtime', component: Overtime },
  { path: '/overtimetab', name: 'Overtimetab', component: OvertimeDetail },
  { path: '/addcatogery', name: 'AddCatogery', component: AddCatogery },
  { path: '/payslip/:employeeID/:month/:year', name: 'Payslip', component: PaySlip },
  { path: '/emptype', name: 'EmpType', component: EmployeeTypes }



]

const router = createRouter({
  history: createWebHistory(),
  routes
});



export default router;
