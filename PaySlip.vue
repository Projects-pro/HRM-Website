<template>
  <div class="flex justify-center items-center w-screen">
    <div>
      <Layout :issidebar="true" />
    </div>
    <div class="w-full flex-col h-screen overflow-y-auto">
      <div>
        <Layout :isheader="true" />
      </div>

      <div class="max-w-full m-5 sm:m-10 lg:m-14 2xl:m-14">
        <!-- Buttons for Download and Print positioned to the right -->
        <div class="flex justify-end mb-4">
          <button @click="downloadPDF" class="icon-btn">
            <fa icon="file-pdf" /> PDF
          </button>
          <button @click="downloadExcel" class="icon-btn">
            <fa icon="file-excel" /> Excel
          </button>
          <button @click="printPage" class="icon-btn">
            <fa icon="print" /> Print
          </button>
        </div>

        <!-- Company Profile -->
        <div v-if="companyProfile" class="mb-10">
          <p class="text-center text-lg font-semibold mb-2 mt-28">PaySlip For {{ monthName }} {{ selectedYear }}</p>
          <h2 class="text-3xl font-bold text-gray-800">Company Profile</h2>
          <p><strong>Company Name:</strong> {{ companyProfile.companyName }}</p>
          <p><strong>Contact Person:</strong> {{ companyProfile.contactPerson }}</p>
          <p><strong>Address:</strong> {{ companyProfile.fullAddress }}</p>
          <p><strong>Email:</strong> {{ companyProfile.email }}</p>
          <p><strong>Phone Number:</strong> {{ companyProfile.phoneNumber }}</p>
          <p><strong>Website:</strong> <a :href="'http://' + companyProfile.website" target="_blank">{{
            companyProfile.website }}</a></p>
        </div>

        <h2 class="text-3xl font-bold mb-6 text-center mt-[30px] text-gray-800">Payslip for {{ employee.name }}</h2>

        <div v-if="payslipData">
          <p><strong>Employee ID:</strong> {{ employee.employeeID }}</p>
          <p><strong>Month:</strong> {{ monthName }}</p>
          <p><strong>Year:</strong> {{ selectedYear }}</p>
          <p><strong>Salary:</strong> {{ payslipData.salary }}</p>
          <p><strong>Status:</strong> {{ payslipData.paidStatus }}</p>
        </div>
        <div v-else>
          <p>Loading payslip data...</p>
        </div>

        <!-- Bonuses and Deductions Tables -->
        <div class="flex justify-between mt-4">
          <!-- Bonuses Table -->
          <div class="w-1/2 mr-2">
            <h3 class="font-semibold">Bonuses</h3>
            <table class="min-w-full border mb-6">
              <thead>
                <tr>
                  <th class="border px-4 py-2">Category</th>
                  <th class="border px-4 py-2">Amount</th>
                  <th class="border px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="bonus in bonuses" :key="bonus.category">
                  <td class="border px-4 py-2">{{ bonus.category }}</td>
                  <td class="border px-4 py-2">{{ bonus.amount }}</td>
                  <td class="border px-4 py-2">{{ bonus.description }}</td>
                </tr>
                <tr v-if="bonuses.length === 0">
                  <td colspan="3" class="border px-4 py-2 text-center">No Bonuses Recorded</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Deductions Table -->
          <div class="w-1/2 ml-2">
            <h3 class="font-semibold">Deductions</h3>
            <table class="min-w-full border mb-6">
              <thead>
                <tr>
                  <th class="border px-4 py-2">Category</th>
                  <th class="border px-4 py-2">Amount</th>
                  <th class="border px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="deduction in deductions" :key="deduction.category">
                  <td class="border px-4 py-2">{{ deduction.category }}</td>
                  <td class="border px-4 py-2">{{ deduction.amount }}</td>
                  <td class="border px-4 py-2">{{ deduction.description }}</td>
                </tr>
                <tr v-if="deductions.length === 0">
                  <td colspan="3" class="border px-4 py-2 text-center">No Deductions Recorded</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Net Salary Calculation -->
        <div class="text-xl font-bold mt-4">
          <p><strong>Net Salary:</strong> {{ netSalary }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Layout from './Layout.vue';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default {
  components: {
    Layout
  },
  data() {
    return {
      employee: {},
      payslipData: null,
      companyProfile: null,
      selectedMonth: null,
      selectedYear: null,
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      bonuses: [],
      deductions: [],
      totalBonuses: 0,
      totalDeductions: 0,
    };
  },
  computed: {
    monthName() {
      return this.monthNames[this.selectedMonth - 1];
    },
    netSalary() {
      const baseSalary = this.payslipData ? this.payslipData.salary : 0;
      return baseSalary + this.totalBonuses - this.totalDeductions;
    }
  },
  methods: {
    fetchPayslipData() {
      const employeeID = this.$route.params.employeeID;
      this.selectedMonth = parseInt(this.$route.params.month, 10);
      this.selectedYear = parseInt(this.$route.params.year, 10);

      const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
      this.employee = storedEmployees.find(emp => emp.employeeID === employeeID) || {};

      const salaryDetails = JSON.parse(localStorage.getItem('salaryDetails')) || {};
      this.payslipData = salaryDetails[employeeID]?.salaries[`${this.monthName}-${this.selectedYear}`] || null;

      const storedCompanyProfile = JSON.parse(localStorage.getItem('companyProfile')) || {};
      this.companyProfile = storedCompanyProfile;

      const payrollData = JSON.parse(localStorage.getItem('Payroll')) || { Bonuses: [], Deductions: [] };

      // Check if Bonuses and Deductions arrays exist, otherwise set them to empty arrays
      this.bonuses = (payrollData.Bonuses || []).filter(bonus => {
        const employeeIdList = bonus.employeeIds.split(',').map(id => id.trim());
        return employeeIdList.includes(employeeID) &&
          bonus.month === this.monthName &&
          parseInt(bonus.year, 10) === this.selectedYear;
      });

      this.deductions = (payrollData.Deductions || []).filter(deduction => {
        const employeeIdList = deduction.employeeIds.split(',').map(id => id.trim());
        return employeeIdList.includes(employeeID) &&
          deduction.month === this.monthName &&
          parseInt(deduction.year, 10) === this.selectedYear;
      });

      this.totalBonuses = this.bonuses.reduce((acc, bonus) => acc + bonus.amount, 0);
      this.totalDeductions = this.deductions.reduce((acc, deduction) => acc + deduction.amount, 0);
    },
    downloadPDF() {
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.setFont("Helvetica", "bold");
      doc.text('Company Profile', 20, 20);

      doc.setFont("Helvetica", "normal");
      const companyDetails = `
      Company Name: ${this.companyProfile.companyName}
      Contact Person: ${this.companyProfile.contactPerson}
      Address: ${this.companyProfile.fullAddress}
      Email: ${this.companyProfile.email}
      Phone Number: ${this.companyProfile.phoneNumber}
      Website: ${this.companyProfile.website}`;
      doc.setFontSize(12);
      doc.text(companyDetails, 20, 30);

      doc.line(20, 70, 190, 70);

      doc.setFontSize(14);
      doc.setFont("Helvetica", "bold");
      doc.text('Employee Details', 20, 75);

      const employeeDetails = `
      Employee ID: ${this.employee.employeeID}
      Name: ${this.employee.name}
      Salary: ${this.payslipData.salary}
      Net Salary: ${this.netSalary}`;
      doc.setFontSize(12);
      doc.text(employeeDetails, 20, 85);

      doc.autoTable({ head: [['Category', 'Amount', 'Description']], body: this.bonuses.map(b => [b.category, b.amount, b.description]), startY: 100 });
      doc.autoTable({ head: [['Category', 'Amount', 'Description']], body: this.deductions.map(d => [d.category, d.amount, d.description]), startY: doc.lastAutoTable.finalY + 10 });

      doc.text(`Net Salary: ${this.netSalary}`, 20, doc.lastAutoTable.finalY + 20);

      const downloadName = `Payslip-${this.employee.employeeID}-${this.employee.name}-${this.monthName}-${this.selectedYear}.pdf`;
      doc.save(downloadName);
    },

    downloadExcel() {
      const data = [
        ['Employee ID', this.employee.employeeID],
        ['Name', this.employee.name],
        ['Month', this.monthName],
        ['Year', this.selectedYear],
        ['Salary', this.payslipData.salary],
        ['Net Salary', this.netSalary],
      ];

      this.bonuses.forEach(bonus => {
        data.push(['Bonus', bonus.category, bonus.amount, bonus.description]);
      });

      this.deductions.forEach(deduction => {
        data.push(['Deduction', deduction.category, deduction.amount, deduction.description]);
      });

      data.push(['Net Salary', '', this.netSalary, '']);

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Payslip');
      XLSX.writeFile(wb, `Payslip-${this.employee.employeeID}-${this.employee.name}-${this.monthName}-${this.selectedYear}.xlsx`);
    },

    printPage() {
      window.print();
    }
  },
  created() {
    this.fetchPayslipData();
  }
};
</script>

<style>
.icon-btn {
  background-color: #007BFF;
  color: white;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon-btn:hover {
  background-color: #0056b3;
}
</style>
