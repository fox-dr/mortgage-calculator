import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import MapView from './MapView';
import CalculatorView from './CalculatorView';

ChartJS.register(ArcElement, Tooltip, Legend);

// Fake dataset (same as before, still hard-coded)
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

const App = () => {
  // view state
  const [view, setView] = useState('map'); // 'map' or 'calculator'
  const [selectedUnit, setSelectedUnit] = useState(null);

  // user inputs
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(7.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [insuranceYearly, setInsuranceYearly] = useState(1200);

  // calculated values
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [principalInterest, setPrincipalInterest] = useState(0);
  const [monthlyTax, setMonthlyTax] = useState(0);
  const [monthlyInsurance, setMonthlyInsurance] = useState(0);
  const [downPaymentAmount, setDownPaymentAmount] = useState(0);
  const [propertyTaxYearly, setPropertyTaxYearly] = useState(0);

  // Handlers
  const handleUnitClick = (unit) => setSelectedUnit(unit);
  const handleCalculateClick = () => selectedUnit && setView('calculator');
  const handleBackToMap = () => {
    setView('map');
    setSelectedUnit(null);
  };

  // Effects
  useEffect(() => {
    if (selectedUnit) {
      const calculatedTax = selectedUnit.price * selectedUnit.tax_rate;
      setPropertyTaxYearly(Math.round(calculatedTax));
    }
  }, [selectedUnit]);

  useEffect(() => {
    if (
      !selectedUnit ||
      selectedUnit.price <= 0 ||
      downPaymentPercent < 0 ||
      interestRate < 0 ||
      loanTerm <= 0
    ) {
      setMonthlyPayment(0);
      return;
    }

    const downPayment = selectedUnit.price * (downPaymentPercent / 100);
    setDownPaymentAmount(downPayment);
    const loanAmount = selectedUnit.price - downPayment;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    let monthlyPI = 0;
    if (monthlyInterestRate > 0) {
      monthlyPI =
        loanAmount *
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    } else {
      monthlyPI = loanAmount / numberOfPayments;
    }
    setPrincipalInterest(monthlyPI);

    const monthlyTaxAmount = Math.round(propertyTaxYearly / 12);
    const monthlyInsuranceAmount = insuranceYearly / 12;
    setMonthlyTax(monthlyTaxAmount);
    setMonthlyInsurance(monthlyInsuranceAmount);
    setMonthlyPayment(monthlyPI + monthlyTaxAmount + monthlyInsuranceAmount);
  }, [selectedUnit, downPaymentPercent, interestRate, loanTerm, propertyTaxYearly, insuranceYearly]);

  // Chart setup
  const data = {
    labels: ['Principal & Interest', 'Property Tax', 'Home Insurance'],
    datasets: [
      {
        label: 'Payment Components',
        data: [principalInterest, monthlyTax, monthlyInsurance],
        backgroundColor: ['#1f78b4', '#ff7f00', '#33a02c'],
        borderColor: ['#1f78b4', '#ff7f00', '#33a02c'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#4b5563',
          font: { size: 14 },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex items-center justify-center font-sans antialiased">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-12 transition-all duration-300">
        {view === 'map' && (
          <MapView
            units={PROJECT_UNITS}
            selectedUnit={selectedUnit}
            onUnitClick={handleUnitClick}
            onCalculateClick={handleCalculateClick}
          />
        )}
        {view === 'calculator' && (
          <CalculatorView
            selectedUnit={selectedUnit}
            downPaymentPercent={downPaymentPercent}
            setDownPaymentPercent={setDownPaymentPercent}
            interestRate={interestRate}
            setInterestRate={setInterestRate}
            loanTerm={loanTerm}
            setLoanTerm={setLoanTerm}
            insuranceYearly={insuranceYearly}
            setInsuranceYearly={setInsuranceYearly}
            monthlyPayment={monthlyPayment}
            principalInterest={principalInterest}
            monthlyTax={monthlyTax}
            monthlyInsurance={monthlyInsurance}
            downPaymentAmount={downPaymentAmount}
            propertyTaxYearly={propertyTaxYearly}
            data={data}
            options={options}
            onBack={handleBackToMap}
          />
        )}
      </div>
    </div>
  );
};

export default App;
