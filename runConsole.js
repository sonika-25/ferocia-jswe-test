/**
 * Borrowing Power Calculator
 *
 * Gen's incomplete prototype.
 * This currently calculates what a user can borrow over 30 years.
 * Currently this code uses placeholder methods for Tax and HEM values.
 *
 * TODO: Refactor the code to pull Tax and HEM values from an API call.
 * A server.js has been provided to supply these values.
 */

// Global constant for mortgage simulation

const services = require('./services');
const { createBorrowingCalculator } = require('./borrowing');

const INTEREST_RATE = 7.0; // 7.0% baseline interest rate

const calculator = createBorrowingCalculator(services, {
    interestRate: INTEREST_RATE
});

function runConsoleMode() {
    const readline = require('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    console.log("Mortgage Borrowing Power Calculator");
    console.log("===================================");

    rl.question("Gross Annual Income: $", (income) => {
        rl.question("Number of Dependents: ", (dependents) => {
            rl.question("Declared Monthly Expenses: $", (expenses) => {
                rl.question("Total Credit Card Limits: $", async(creditLimits) => {

                    const result = await calculator.calculate({
                        income: parseFloat(income),
                        dependents: parseInt(dependents),
                        expenses: parseFloat(expenses),
                        creditLimits: parseFloat(creditLimits)
                    });

                    console.log("\n--- Calculation Summary ---");
                    console.log(`Maximum Borrowing Power at ${INTEREST_RATE}%: $${result.maxLoanAmount.toLocaleString()}`);
                    console.log(`Assumed Monthly Mortgage Repayment: $${result.monthlyRepayment.toLocaleString()} over 30 years`);

                    rl.close();
                });
            });
        }); 
    });
}

if (require.main === module) {
    runConsoleMode();
}

module.exports = { runConsoleMode };
