import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const App = () => {
  // State for form inputs
  const [price, setPrice] = useState(350000);
  const [county, setCounty] = useState('');
  const [state, setState] = useState('');
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTaxYearly, setPropertyTaxYearly] = useState(3500);
  const [insuranceYearly, setInsuranceYearly] = useState(1200);

  // State for calculated values
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [principalInterest, setPrincipalInterest] = useState(0);
  const [monthlyTax, setMonthlyTax] = useState(0);
  const [monthlyInsurance, setMonthlyInsurance] = useState(0);
  const [downPaymentAmount, setDownPaymentAmount] = useState(0);

  // Effect to recalculate everything whenever inputs change
  useEffect(() => {
    // Basic validation
    if (price <= 0 || downPaymentPercent < 0 || interestRate < 0 || loanTerm <= 0) {
      setMonthlyPayment(0);
      return;
    }

    // Calculate down payment amount
    const downPayment = price * (downPaymentPercent / 100);
    setDownPaymentAmount(downPayment);

    // Calculate loan amount
    const loanAmount = price - downPayment;

    // Convert annual rate and term to monthly
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    // Calculate monthly principal and interest payment using the formula:
    // M = P [ r(1+r)^n / ((1+r)^n-1) ]
    let monthlyPI = 0;
    if (monthlyInterestRate > 0) {
      monthlyPI = loanAmount * (
        monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
      );
    } else {
      // Handle 0 interest rate case
      monthlyPI = loanAmount / numberOfPayments;
    }
    setPrincipalInterest(monthlyPI);

    // Calculate monthly property tax and insurance
    const monthlyTaxAmount = propertyTaxYearly / 12;
    const monthlyInsuranceAmount = insuranceYearly / 12;
    setMonthlyTax(monthlyTaxAmount);
    setMonthlyInsurance(monthlyInsuranceAmount);

    // Calculate total monthly payment
    const totalMonthlyPayment = monthlyPI + monthlyTaxAmount + monthlyInsuranceAmount;
    setMonthlyPayment(totalMonthlyPayment);

  }, [price, downPaymentPercent, interestRate, loanTerm, propertyTaxYearly, insuranceYearly]);

  // Data for the Doughnut chart
  const data = {
    labels: ['Principal & Interest', 'Property Tax', 'Home Insurance'],
    datasets: [{
      label: 'Payment Components',
      data: [principalInterest, monthlyTax, monthlyInsurance],
      backgroundColor: [
        '#1f78b4', // Deep Blue - Principal & Interest
        '#ff7f00', // Vibrant Orange - Property Tax
        '#33a02c', // Forest Green - Home Insurance
      ],
      borderColor: [
        '#1f78b4',
        '#ff7f00',
        '#33a02c',
      ],
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#4b5563', // gray-600
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex items-center justify-center font-sans antialiased">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Header and Logo */}
        <div className="flex flex-col items-center justify-center mb-6 lg:mb-0 lg:hidden">
          <img
            src="/company-logo.png"
            alt="HBFA Logo"
            className="mb-4 rounded-xl"
          />
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight text-center">
            Mortgage Calculator
          </h1>
          <p className="mt-2 text-gray-600 text-center max-w-md">
            Calculate your estimated monthly payment and see the breakdown.
          </p>
        </div>

        {/* Input Section */}
        <div className="flex-1 space-y-6">
          <div className="hidden lg:flex flex-col items-center mb-8">
            <img
              src="/company-logo.png"
              alt="HBFA Logo"
              className="mb-4 rounded-xl"
            />
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight text-center">
              Mortgage Calculator
            </h1>
            <p className="mt-2 text-gray-600 text-center max-w-md">
              Calculate your estimated monthly payment and see the breakdown.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl shadow-inner border border-gray-200 space-y-6">
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <h2 className="text-xl font-bold text-gray-700">Property Details</h2>
            </div>
            {/* Purchase Price Input */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Price
              </label>
              <div className="relative mt-1 rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="block w-full rounded-lg border-0 py-2 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 transition-colors duration-200"
                  placeholder="350000"
                />
              </div>
            </div>

            {/* County & State Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="county" className="block text-sm font-medium text-gray-700 mb-1">
                  County
                </label>
                <div className="relative mt-1 rounded-lg shadow-sm">
                  <input
                    type="text"
                    id="county"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="block w-full rounded-lg border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 transition-colors duration-200"
                    placeholder="Enter county"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <div className="relative mt-1 rounded-lg shadow-sm">
                  <input
                    type="text"
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="block w-full rounded-lg border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 transition-colors duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Down Payment Input & Slider */}
            <div>
              <label htmlFor="downPaymentPercent" className="block text-sm font-medium text-gray-700 mb-1">
                Down Payment: <span className="font-bold text-gray-900">{downPaymentPercent}%</span>
              </label>
              <div className="flex items-center space-x-4 mt-2">
                <input
                  type="range"
                  id="downPaymentPercent"
                  min="0"
                  max="100"
                  step="1"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb-sky-500 transition-colors duration-200"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-20 text-center rounded-lg border border-gray-300 px-2 py-1 text-gray-900 text-sm focus:ring-sky-600 transition-colors duration-200"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Amount: ${downPaymentAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>

            {/* Interest Rate, Loan Term, Tax, Insurance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (%)
                </label>
                <div className="relative mt-1 rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                  <input
                    type="number"
                    id="interestRate"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="block w-full rounded-lg border-0 py-2 pr-7 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 transition-colors duration-200"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Term (Years)
                </label>
                <div className="relative mt-1 rounded-lg shadow-sm">
                  <select
                    id="loanTerm"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="block w-full rounded-lg border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 transition-colors duration-200"
                  >
                    <option value={15}>15 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={30}>30 Years</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="propertyTax" className="block text-sm font-medium text-gray-700 mb-1">
                  Yearly Property Tax ($)
                </label>
                <div className="relative mt-1 rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="propertyTax"
                    value={propertyTaxYearly}
                    onChange={(e) => setPropertyTaxYearly(Number(e.target.value))}
                    className="block w-full rounded-lg border-0 py-2 pl-7 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 transition-colors duration-200"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="insurance" className="block text-sm font-medium text-gray-700 mb-1">
                  Yearly Insurance ($)
                </label>
                <div className="relative mt-1 rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="insurance"
                    value={insuranceYearly}
                    onChange={(e) => setInsuranceYearly(Number(e.target.value))}
                    className="block w-full rounded-lg border-0 py-2 pl-7 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 transition-colors duration-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results & Chart Section */}
        <div className="flex-1 lg:flex-none lg:w-96 p-6 rounded-2xl bg-gray-50 shadow-2xl flex flex-col items-center justify-center text-gray-800 space-y-8">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold tracking-wide text-gray-800 uppercase">
              Your Estimated Payment
            </h3>
            <div className="relative mt-2">
              <span className="text-5xl font-extrabold tracking-tight">
                ${monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
              <span className="absolute top-0 right-0 transform translate-x-full text-lg font-semibold text-gray-600 ml-2">
                /mo
              </span>
            </div>
          </div>

          <div className="w-full max-w-sm flex justify-center items-center">
            {monthlyPayment > 0 && (
              <Doughnut data={data} options={options} className="max-w-xs" />
            )}
            {monthlyPayment === 0 && (
              <div className="text-center text-gray-600 text-sm">
                Enter your loan details to see the payment breakdown.
              </div>
            )}
          </div>

          <div className="w-full text-center">
            <h4 className="text-lg font-semibold mb-2 text-gray-800">Payment Breakdown</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Principal & Interest
                </span>
                <span className="font-bold">
                  ${principalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Property Tax
                </span>
                <span className="font-bold">
                  ${monthlyTax.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M10 20v-6H4v6"/><path d="M2 10.6L12 2l10 8.6V22h-4v-6H8v6H2z"/></svg>
                  Home Insurance
                </span>
                <span className="font-bold">
                  ${monthlyInsurance.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
