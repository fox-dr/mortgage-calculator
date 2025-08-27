import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// This array acts as our database of projects and units.
// We've added an 'address' and 'map_x/y' coordinates to simulate a map.
const PROJECT_UNITS = [
  {
    unit_id: 'hayward-plan-a',
    project_id: 'Hayward Heights',
    plan_type: 'Plan A',
    address: '123 Main St, Hayward, CA',
    county: 'Alameda',
    city: 'Hayward',
    state: 'California',
    price: 650000,
    tax_rate: 0.0078,
    map_x: '20%',
    map_y: '35%',
    floor_plan_image_url: "https://placehold.co/400x300/a0e0a0/000000?text=Hayward+Plan+A"
  },
  {
    unit_id: 'sunnyvale-plan-b',
    project_id: 'Sunnyvale Shores',
    plan_type: 'Plan B',
    address: '456 Tech Ave, Sunnyvale, CA',
    county: 'Santa Clara',
    city: 'Sunnyvale',
    state: 'California',
    price: 1200000,
    tax_rate: 0.0075,
    map_x: '45%',
    map_y: '60%',
    floor_plan_image_url: "https://placehold.co/400x300/e0a0a0/000000?text=Sunnyvale+Plan+B"
  },
  {
    unit_id: 'san-ramon-plan-c',
    project_id: 'San Ramon Valley',
    plan_type: 'Plan C',
    address: '789 Vista Dr, San Ramon, CA',
    county: 'Contra Costa',
    city: 'San Ramon',
    state: 'California',
    price: 950000,
    tax_rate: 0.0085,
    map_x: '75%',
    map_y: '25%',
    floor_plan_image_url: "https://placehold.co/400x300/a0a0e0/000000?text=San+Ramon+Plan+C"
  },
];

// Main App Component that manages the view state
const App = () => {
  const [view, setView] = useState('map'); // 'map' or 'calculator'
  const [selectedUnit, setSelectedUnit] = useState(null);

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
  };

  const handleCalculateClick = () => {
    if (selectedUnit) {
      setView('calculator');
    }
  };

  const handleBackToMap = () => {
    setView('map');
    setSelectedUnit(null);
  };

  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [insuranceYearly, setInsuranceYearly] = useState(1200);

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [principalInterest, setPrincipalInterest] = useState(0);
  const [monthlyTax, setMonthlyTax] = useState(0);
  const [monthlyInsurance, setMonthlyInsurance] = useState(0);
  const [downPaymentAmount, setDownPaymentAmount] = useState(0);
  const [propertyTaxYearly, setPropertyTaxYearly] = useState(0);

  useEffect(() => {
    if (selectedUnit) {
      setPropertyTaxYearly(selectedUnit.price * selectedUnit.tax_rate);
    }
  }, [selectedUnit]);

  useEffect(() => {
    if (selectedUnit?.price <= 0 || downPaymentPercent < 0 || interestRate < 0 || loanTerm <= 0) {
      setMonthlyPayment(0);
      return;
    }

    const downPayment = selectedUnit?.price * (downPaymentPercent / 100) || 0;
    setDownPaymentAmount(downPayment);
    const loanAmount = (selectedUnit?.price || 0) - downPayment;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    let monthlyPI = 0;
    if (monthlyInterestRate > 0) {
      monthlyPI = loanAmount * (
        monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
      );
    } else {
      monthlyPI = loanAmount / numberOfPayments;
    }
    setPrincipalInterest(monthlyPI);

    const monthlyTaxAmount = propertyTaxYearly / 12;
    const monthlyInsuranceAmount = insuranceYearly / 12;
    setMonthlyTax(monthlyTaxAmount);
    setMonthlyInsurance(monthlyInsuranceAmount);
    const totalMonthlyPayment = monthlyPI + monthlyTaxAmount + monthlyInsuranceAmount;
    setMonthlyPayment(totalMonthlyPayment);
  }, [selectedUnit, downPaymentPercent, interestRate, loanTerm, propertyTaxYearly, insuranceYearly]);

  const data = {
    labels: ['Principal & Interest', 'Property Tax', 'Home Insurance'],
    datasets: [{
      label: 'Payment Components',
      data: [principalInterest, monthlyTax, monthlyInsurance],
      backgroundColor: [
        '#1f78b4', 
        '#ff7f00', 
        '#33a02c', 
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
          color: '#4b5563', 
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex items-center justify-center font-sans antialiased">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-12 transition-all duration-300">
        {/* Map View */}
        {view === 'map' && (
          <div className="flex-1 space-y-6">
            <div className="flex flex-col items-center mb-8">
              <img
                src="/company-logo.png"
                alt="HBFA Logo"
                className="mb-4 rounded-xl"
              />
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight text-center">
                Project Units Map
              </h1>
              <p className="mt-2 text-gray-600 text-center max-w-md">
                Click on a unit to see its details and calculate a mortgage payment.
              </p>
            </div>
            
            <div className="relative w-full aspect-video bg-gray-200 rounded-2xl shadow-inner border border-gray-300 overflow-hidden">
              <img 
                src="https://placehold.co/1200x675/e2e8f0/0f172a?text=Subdivision+Map+Placeholder" 
                alt="Subdivision Map"
                className="w-full h-full object-cover"
              />
              {PROJECT_UNITS.map(unit => (
                <div 
                  key={unit.unit_id}
                  className={`absolute w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300
                    ${selectedUnit && selectedUnit.unit_id === unit.unit_id ? 'bg-sky-500 ring-4 ring-offset-2 ring-sky-500 z-10' : 'bg-blue-500 hover:scale-125'}`}
                  style={{ left: unit.map_x, top: unit.map_y }}
                  onClick={() => handleUnitClick(unit)}
                >
                  <span className="text-white text-xs font-bold">{unit.plan_type.slice(-1)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Map View's side panel */}
        {view === 'map' && (
          <div className={`flex-1 lg:flex-none lg:w-96 p-6 rounded-2xl bg-gray-50 shadow-2xl flex flex-col items-center justify-center space-y-6 transition-all duration-300 transform 
            ${selectedUnit ? 'opacity-100' : 'lg:opacity-0'}`}>
            
            {selectedUnit ? (
              <>
                <h3 className="text-lg font-semibold tracking-wide text-gray-800 uppercase text-center">
                  Selected Unit Details
                </h3>
                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 w-full text-center">
                  <p className="text-lg font-bold text-gray-800">{selectedUnit.plan_type}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedUnit.address}</p>
                  <img
                    src={selectedUnit.floor_plan_image_url}
                    alt={`Floor plan for ${selectedUnit.plan_type}`}
                    className="mt-4 rounded-lg w-full h-auto object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/a0a0a0/ffffff?text=Image+Not+Found" }}
                  />
                </div>
                <button 
                  onClick={handleCalculateClick}
                  className="w-full rounded-full py-3 px-6 bg-sky-600 text-white font-bold text-lg hover:bg-sky-700 transition-colors duration-200 shadow-lg"
                >
                  Calculate My Payment!
                </button>
              </>
            ) : (
              <p className="text-center text-gray-600 text-sm">
                Select a unit on the map to see its details.
              </p>
            )}
          </div>
        )}

        {/* Calculator View */}
        {view === 'calculator' && (
          <>
          {/* Input Section */}
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={handleBackToMap} 
                className="flex items-center text-sky-600 hover:text-sky-800 transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                <span className="ml-1">Back to Map</span>
              </button>
              <img src="/company-logo.png" alt="HBFA Logo" className="w-24 rounded-xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight text-center">
              Mortgage Calculator
            </h1>
            <p className="mt-2 text-gray-600 text-center max-w-md mx-auto">
              Calculating payment for <span className="font-bold">{selectedUnit.project_id} - {selectedUnit.plan_type}</span>
            </p>
            
            <div className="bg-gray-50 p-6 rounded-2xl shadow-inner border border-gray-200 space-y-6">
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  <h2 className="text-xl font-bold text-gray-700">Property Details</h2>
                </div>
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
          </>
        )}
      </div>
    </div>
  );
};

export default App;
