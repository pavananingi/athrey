const fromCreatePlans = require("./create-plans");
const fromDeletePlan = require("./delete-plan");
const fromGetPlans = require("./get-plans");

exports.plansUseCases = {
  createPlans: fromCreatePlans.createPlans,
  deletePlan: fromDeletePlan.deletePlan,
  getPlans: fromGetPlans.getPlans,
};
