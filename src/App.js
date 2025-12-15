import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import CalculatorView from './CalculatorView';

ChartJS.register(ArcElement, Tooltip, Legend);

const DEFAULT_TAX_RATE = 0.0125; // 1.25% generic tax rate

const App = () => {
  // Default price so the calculator works out of the box; adjust as needed.
  const [selectedUnit, setSelectedUnit] = useState({
    price: 700000,
    unit_id: '',
    plan: '',
  });

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

  const normalizeUnit = (unitData = {}) => {
    const parsedPrice = Number(unitData.price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) return null;
    return {
      price: parsedPrice,
      unit_id: unitData.unit_id || '',
      plan: unitData.plan || '',
    };
  };

  // URL param ingestion is intentionally commented out; uncomment to enable:
  /*
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const price = searchParams.get('price');
    if (!price) return;
    const unitFromUrl = normalizeUnit({
      price,
      unit_id: searchParams.get('unit_id') || searchParams.get('unitId') || '',
      plan: searchParams.get('plan') || '',
    });
    if (unitFromUrl) {
      setSelectedUnit(unitFromUrl);
    }
  }, []);
  */

  // Expose a global setter for marketing pages to inject pricing dynamically.
  useEffect(() => {
    window.setCalculatorUnit = (incoming = {}) => {
      const normalized = normalizeUnit(incoming);
      if (normalized) {
        setSelectedUnit(normalized);
      }
    };
    return () => {
      delete window.setCalculatorUnit;
    };
  }, []);

  // Effects
  useEffect(() => {
    if (selectedUnit) {
      const calculatedTax = selectedUnit.price * DEFAULT_TAX_RATE;
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
      setPrincipalInterest(0);
      setMonthlyTax(0);
      setMonthlyInsurance(insuranceYearly / 12);
      setDownPaymentAmount(0);
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
          taxRate={DEFAULT_TAX_RATE}
        />
      </div>
    </div>
  );
};

export default App;
