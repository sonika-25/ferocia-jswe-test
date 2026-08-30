//Monthly surplus available to repay a loan (may be negative)
async function calcMaxMonthlyRepayment(services,{income,dependents,expenses,creditLimits}) {
    const tax = await services.getTax(income);
    const netMonthlyIncome = (income- tax)/12

    const baselineHEM = await services.getHem(income,dependents)
    const totalLivingExpenses = Math.max(baselineHEM,expenses)

    const creditCardLiability = creditLimits * 0.03;
    
    return (netMonthlyIncome - totalLivingExpenses -creditCardLiability)
}

//Helper function that calculates max loan amount from max monthly repayment
function calcMaxLoan (maxMonthlyRepayment, monthlyRate,  loanTermMonths) {
    return maxMonthlyRepayment * ((1 - Math.pow(1 + monthlyRate, -loanTermMonths)) / monthlyRate);
}

function createBorrowingCalculator(services,config={}){
    const loanTermMonths = config.loanTermMonths ?? 360;
    const interestRate = config.interestRate ?? 7.0;
    const assessmentBuffer = config.assessmentBuffer ?? 3.0;

    async function calculate({income, dependents, expenses, creditLimits} ){
        if (income <0 || creditLimits <0 ||dependents<0 ||expenses <0){return { maxLoanAmount: 0, monthlyRepayment: 0 }}
        const maxMonthlyRepayment = await calcMaxMonthlyRepayment(services,{income, dependents, expenses, creditLimits});
        
        if (maxMonthlyRepayment <= 0){
            return { maxLoanAmount: 0, monthlyRepayment: 0 };
        } 
        // so that loan still works if interst rates get higher
        const annualAssessmentRate = interestRate + assessmentBuffer
        const monthlyRate = (annualAssessmentRate/100)/12

        const maxLoanAmount = calcMaxLoan(maxMonthlyRepayment, monthlyRate, loanTermMonths)

        return {
            maxLoanAmount: Number(maxLoanAmount.toFixed(2)),
            monthlyRepayment: Number(maxMonthlyRepayment.toFixed(2))
        };
    }
    return {calculate}
}

module.exports = { createBorrowingCalculator, calcMaxLoan, calcMaxMonthlyRepayment };