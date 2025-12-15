import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const CalculatorView = ({
  selectedUnit,
  downPaymentPercent,
  setDownPaymentPercent,
  interestRate,
  setInterestRate,
  loanTerm,
  setLoanTerm,
  insuranceYearly,
  setInsuranceYearly,
  monthlyPayment,
  principalInterest,
  monthlyTax,
  monthlyInsurance,
  downPaymentAmount,
  propertyTaxYearly,
  data,
  options,
  taxRate,
}) => {
  const hasPrice = selectedUnit && selectedUnit.price > 0;
  const unitLabel = selectedUnit
    ? [selectedUnit.unit_id, selectedUnit.plan].filter(Boolean).join(' • ')
    : '';

  if (!hasPrice) {
    return (
      <div className="w-full text-center text-gray-700 space-y-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
          Mortgage Calculator
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Waiting for a home price. Pass a price via URL (e.g. <code>?price=650000</code>) or call{' '}
          <code>window.setCalculatorUnit(&#123; price: 650000, unit_id: 'Lot-12', plan: 'Plan-A' &#125;)</code> once the page loads.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Left side: input form */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center mb-6">
          {/* Uncomment to offer a visible selector trigger */}
          {/*
          <button
            onClick={() => {}}
            className="flex items-center text-sky-600 hover:text-sky-800 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="ml-1">Choose Another Home</span>
          </button>
          */}
          <img src="/company-logo.png" alt="HBFA Logo" className="w-24 rounded-xl" />
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight text-center">
          Mortgage Calculator
        </h1>
        <p className="mt-2 text-gray-600 text-center max-w-md mx-auto">
          Selected Home: <span className="font-bold">{unitLabel || 'Not specified'}</span>
        </p>

        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner border border-gray-200 space-y-6">
          {/* Purchase Price Display */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price
            </label>
            <div className="relative mt-1 rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="text"
                id="price"
                value={selectedUnit.price.toLocaleString('en-US')}
                readOnly
                className="block w-full rounded-lg border-0 py-2 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 transition-colors duration-200 bg-gray-200"
              />
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
                  readOnly
                  className="block w-full rounded-lg border-0 py-2 pl-7 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 transition-colors duration-200 bg-gray-200"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Property tax estimated at {(taxRate * 100).toFixed(2)}%. Please verify with your county/municipality.
              </p>
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

      {/* Right side: results panel */}
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
          {monthlyPayment > 0 ? (
            <Doughnut data={data} options={options} className="max-w-xs" />
          ) : (
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
    </>
  );
};

export default CalculatorView;
