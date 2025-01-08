const connection = require("../connection").connection;
const templates = require("../templates");
const moment = require("moment");
const momentTz = require("moment-timezone");
moment.locale('de');

module.exports.Send = ({ CreateError, translate, logger, lang }) => {
  return Object.freeze({
    signup: async ({
      to,
      salute,
      firstname,
      lastname,
      title,
      isDoctor,
      isPatient,
    }) => {
      title = checkTitle(title);
      salute = checkSalute(salute);
      const receiverName = constructName({
        salute,
        firstname,
        lastname,
        title,
      });
      const params = {
        fullname: receiverName,
        firstname: firstname,
        lastname: lastname,
        salute: salute,
        title: title,
      };

      const sendTo = [
        {
          email: to,
          name: receiverName,
        },
      ];

      let templateId = templates.signup.register;

      // const status = await connection().sendMail({
      //   to: sendTo,
      //   templateId: templateId,
      //   params: params,
      // });
    },
    otp: async ({ to, otp, salute, firstname, lastname, title }) => {
      title = checkTitle(title);
      salute = checkSalute(salute);
      const receiverName = constructName({
        salute,
        firstname,
        lastname,
        title,
      });
      const params = {
        otp: otp,
        fullname: receiverName,
        firstname: firstname,
        lastname: lastname,
        salute: salute,
        title: title,
      };

      const sendTo = [
        {
          email: to,
          name: receiverName,
        },
      ];

      let content = `<div>Hi ${receiverName || "User"}, <br/>
      Your OTP to verify email is given bellow
      <br/>
      ${otp}
      <br/>  
      </div>`;

      let subject = "Generated otp";

      connection().sendEmail({
        personalizations: [{
          to: [{ email: to }],
        }],
        content,
        subject,
      });

      // let templateId = templates.passwordReset.otp;

      // const status = await connection().sendMail({
      //   to: sendTo,
      //   templateId: templateId,
      //   params: params,
      // });
    },
    consultationCreatedToTempPatient: async ({
      to,
      firstname,
      lastname,
      preferredSchedule,
    }) => {
      const days = [
        "Sonntag, ",
        "Montag, ",
        "Dienstag, ",
        "der Mittwoch, ",
        "Donnerstag, ",
        "Freitag, ",
        "Samstag, ",
      ];

      preferredSchedule =
        days[new Date(preferredSchedule).getDay()] +
        momentTz.tz(new Date(preferredSchedule), "Europe/Berlin").format("DD.MMM yyyy, HH:mm");
      const params = {
        firstname: firstname,
        lastname: lastname,
        preferred_schedule: preferredSchedule,
      };

      const sendTo = [
        {
          email: to,
          name: `${firstname} ${lastname}`,
        },
      ];

      let templateId = templates.consultation.successToTempPatient;

      // const status = await connection().sendMail({
      //   to: sendTo,
      //   templateId: templateId,
      //   params: params,
      // });
    },
    sendVerifyEmialOtp: async ({
      to,
      otp,
    }) => {
      let content = `<div>Hi User, <br/>
      Your OTP to verify email is given bellow
      <br/>
      ${otp}
      <br/>  
      </div>`;

      let subject = "Generated otp";

      connection().sendEmail({
        personalizations: [{
          to: [{ email: to }],
        }],
        content,
        subject,
      });
    },
    generateDoctorPassword: async ({
      to,
      firstname,
      lastname,
      link,
    }) => {
      const receiverName = constructName({
        firstname,
        lastname,
      });

      let content = `<div>Hi ${receiverName || "User"}, <br/>
      Admin has approved your request. please genrate your password using below link.
      <br/> <br/> 
      <a href="${link || ""}">link</a>
      <br/> <br/> 
      Link will be expired within 2 days. 
      </div>`;

      let subject = "Generate passowrd";

      connection().sendEmail({
        personalizations: [{
          to: [{ email: to }],
        }],
        content,
        subject,
      });
    },
    consultationCreatedToPatient: async ({
      to,
      salute,
      firstname,
      lastname,
      title,
      preferredSchedule,
    }) => {
      title = checkTitle(title);
      salute = checkSalute(salute);
      const receiverName = constructName({
        salute,
        firstname,
        lastname,
        title,
      });

      const days = [
        "Sonntag, ",
        "Montag, ",
        "Dienstag, ",
        "der Mittwoch, ",
        "Donnerstag, ",
        "Freitag, ",
        "Samstag, ",
      ];

      preferredSchedule =
        days[new Date(preferredSchedule).getDay()] +
        momentTz.tz(new Date(preferredSchedule), "Europe/Berlin").format("DD.MMM yyyy, HH:mm");

      const params = {
        fullname: receiverName,
        firstname: firstname,
        lastname: lastname,
        salute: salute,
        title: title,
        preferred_schedule: preferredSchedule,
      };

      const sendTo = [
        {
          email: to,
          name: receiverName,
        },
      ];

      let templateId = templates.consultation.successToPatient;

      // const status = await connection().sendMail({
      //   to: sendTo,
      //   templateId: templateId,
      //   params: params,
      // });
    },
    consultationScheduledToTempPatient: async ({
      to,
      firstname,
      lastname,
      confirmedSchedule,
      schedule_link,
    }) => {
      confirmedSchedule =
        momentTz.tz(new Date(confirmedSchedule), "Europe/Berlin").format("DD.MMM yyyy, HH:mm");

      const params = {
        firstname: firstname,
        lastname: lastname,
        confirmed_schedule: confirmedSchedule,
        schedule_link: schedule_link,
      };

      const sendTo = [
        {
          email: to,
          name: `${firstname} ${lastname}`,
        },
      ];

      let templateId = templates.consultation.scheduledToTempPatient;

      // const status = await connection().sendMail({
      //   to: sendTo,
      //   templateId: templateId,
      //   params: params,
      // });
    },

    consultationScheduledToDoctor: async ({
      to,
      salute,
      firstname,
      lastname,
      title,
      confirmedSchedule,
      patient
    }) => {
      title = checkTitle(title);
      salute = checkSalute(salute);
      patient.title = checkTitle(patient.title);
      const receiverName = constructName({
        salute,
        firstname,
        lastname,
        title,
      });
      confirmedSchedule =
        momentTz.tz(new Date(confirmedSchedule), "Europe/Berlin").format("DD.MMM yyyy, HH:mm");

      const params = {
        fullname: receiverName,
        firstname: firstname,
        lastname: lastname,
        salute: salute,
        title: title,
        confirmed_schedule: confirmedSchedule,
        patientName: patient.title + ' ' + patient.firstname + ' ' + patient.lastname
      };

      const sendTo = [
        {
          email: to,
          name: receiverName,
        },
      ];

      let templateId = templates.consultation.scheduledToDoctor;

      // const status = await connection().sendMail({
      //   to: sendTo,
      //   templateId: templateId,
      //   params: params,
      // });
    },

    consultationScheduledToPatient: async ({
      to,
      salute,
      firstname,
      lastname,
      title,
      confirmedSchedule,
      doctor
    }) => {
      title = checkTitle(title);
      salute = checkSalute(salute);
      doctor.title = checkTitle(doctor.title);
      const receiverName = constructName({
        salute,
        firstname,
        lastname,
        title,
      });
      confirmedSchedule =
        momentTz.tz(new Date(confirmedSchedule), "Europe/Berlin").format("DD.MMM yyyy, HH:mm");

      const params = {
        fullname: receiverName,
        firstname: firstname,
        lastname: lastname,
        salute: salute,
        title: title,
        confirmed_schedule: confirmedSchedule,
        doctorName: doctor.title + ' ' + doctor.firstname + ' ' + doctor.lastname
      };

      const sendTo = [
        {
          email: to,
          name: receiverName,
        },
      ];

      let templateId = templates.consultation.scheduledToPatient;

      // const status = await connection().sendMail({
      //   to: sendTo,
      //   templateId: templateId,
      //   params: params,
      // });
    },
    consultationCancelledToPatient: async ({
      to,
      salute,
      firstname,
      lastname,
      title,
    }) => {
      title = checkTitle(title);
      salute = checkSalute(salute);
      const receiverName = constructName({
        salute,
        firstname,
        lastname,
        title,
      });
      const params = {
        fullname: receiverName,
        firstname: firstname,
        lastname: lastname,
        salute: salute,
        title: title,
      };

      const sendTo = [
        {
          email: to,
          name: receiverName,
        },
      ];

      let templateId = templates.consultation.cancelledToPatient;

      // const status = await connection().sendMail({
      //   to: sendTo,
      //   templateId: templateId,
      //   params: params,
      // });
    },
    consultationCompletedToPatient: async ({
      to,
      salute,
      firstname,
      lastname,
      title,
    }) => {
      title = checkTitle(title);
      salute = checkSalute(salute);
      const receiverName = constructName({
        salute,
        firstname,
        lastname,
        title,
      });
      const params = {
        fullname: receiverName,
        firstname: firstname,
        lastname: lastname,
        salute: salute,
        title: title,
      };

      const sendTo = [
        {
          email: to,
          name: receiverName,
        },
      ];

      let templateId = templates.consultation.completedToPatient;

      // const status = await connection().sendMail({
      //   to: sendTo,
      //   templateId: templateId,
      //   params: params,
      // });
    },

    emailVerify: async ({
      to,
      salute,
      title,
      firstname,
      lastname,
      verify_link,
    }) => {

      const receiverName = constructName({
        salute,
        firstname,
        lastname,
        title,
      });

      const params = {
        fullname: receiverName,
        firstname: firstname,
        lastname: lastname,
        salute: salute,
        title: title,
        verify_link: verify_link,
      };

      const sendTo = [
        {
          email: to,
          name: receiverName,
        },
      ];

      let templateId = templates.signup.verifyEmail;

      // const status = await connection().sendMail({
      //   to: sendTo,
      //   templateId: templateId,
      //   params: params,
      // });
    },

    adminInvite: async ({
      to,
      salute,
      title,
      firstname,
      lastname,
      invite_link,
    }) => {

      const receiverName = constructName({
        salute,
        firstname,
        lastname,
        title,
      });

      const params = {
        fullname: receiverName,
        firstname: firstname,
        lastname: lastname,
        salute: salute,
        title: title,
        invite_link: invite_link,
      };

      const sendTo = [
        {
          email: to,
          name: receiverName,
        },
      ];

      let templateId = templates.signup.verifyEmail;

      // const status = await connection().sendMail({
      //   to: sendTo,
      //   templateId: templateId,
      //   params: params,
      // });
    },
  });
};

function constructName({ firstname = "", lastname = "" }) {
  return firstname + " " + lastname;
}

function checkTitle(title) {
  return title ? title : "";
}

function checkSalute(salute) {
  if (salute == 'Mr.') {
    salute = 'Hr.';
  } else if (salute == 'Ms.' || salute == 'Mrs.') {
    salute = 'Fr.';
  }
  return salute
}