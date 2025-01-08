const express = require("express");
const router = express.Router();

const fromController = require("../controllers").consultations;
const fromLogsController = require("../controllers").callLogs;

/*
 * @desc /consultations
 */
router.get("/scheduled", fromController.getScheduledConsultations);
router.get("/open", fromController.getOpenConsultations);
router.get("/review", fromController.getReviewConsultations);
router.get("/completed", fromController.getCompletedConsultations);
router.get("/cancelled", fromController.getCancelledConsultations);
router.get(
  "/doctors/count/:year",
  fromController.getScheduledConsultationsCount
);
router.get(
  "/doctors/count/:year/:month",
  fromController.getScheduledConsultationsCount
);
router.get(
  "/doctors/count/:year/:month/:day",
  fromController.getScheduledConsultationsCount
);
router.get("/doctors/:date", fromController.getDoctorConsultations);

router.get("/:uid", fromController.getConsultation);
router.post("", fromController.createConsultation);

router.post("/:uid/doctors", fromController.assignDoctor);
router.post("/:uid/schedule", fromController.assignDoctor);
router.post("/:uid/tempschedule", fromController.assignDoctortoTempPatient);
router.patch("/:uid/reschedule", fromController.rescheduleConsultation);
router.patch("/:uid/cancel", fromController.cancelConsultation);
router.post(
  "/:uid/:doctorUID/invoice",
  fromController.createConsultationDoctorInvoice
);
router.patch(
  "/:uid/:doctorUID/completed",
  fromController.updateConsultationDoctorCompleted
);
router.patch(
  "/:uid/:doctorUID/charges",
  fromController.updateConsultationDoctorCharge
);
router.patch("/:uid/:doctorUID", fromController.updateConsultationDoctorReport);

router.get("/:uid/logs", fromLogsController.getCallLogs);
router.post("/:uid/logs", fromLogsController.createCallLog);
router.patch("/:uid/logs/:id", fromLogsController.updateCallLog);

router.get("", fromController.getConsultationsList);

module.exports = router;
