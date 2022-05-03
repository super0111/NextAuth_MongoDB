import mailgunFactory from 'mailgun-js';

const mg_apiKey = process.env.MAILGUN_API_KEY;
const mg_domain = process.env.MAILGUN_DOMAIN;

const mailgun = mailgunFactory({
	apiKey: mg_apiKey,
	domain: mg_domain
});

function sendEmail(message) {
	return new Promise((res, rej) => {
		mailgun.messages().send(message, (error, body) => {
			if (error) {
				rej(error);
				console.log(error, mg_apiKey);
			} else {
				console.log(body);
			}
		});
	});
}


// export const sendConfirmationEmail = function ({ toUser, hash }) {
// 	const message = {
// 		from: 'app@cocoonproject.org',
// 		to: toUser.email ,// in production uncomment this
// 		// to: 'gabrielajram@gmail.com',
// 		subject: 'Cocoon Project - Activate Account',
// 		html: `
//       <h3> Hello ${toUser.fName} </h3>
//       <p>Thank you for registering into our Application. Much Appreciated! Just one last step is laying ahead of you...</p>
//       <p>To activate your account please follow this link: <a target="_" href="${process.env.DOMAIN}/api/activate/user/${hash}">${process.env.DOMAIN}/activate </a></p>
//       <p>Cheers</p>
//       <p>Cocoon Project Team</p>
//     `
// 	};

// 	return sendEmail(message);
// };

export const sendResetPasswordEmail = ({ toUser, hash }) => {
	const message = {
		from: 'app@cocoonproject.org',
		to: toUser.email , // in production uncomment this
		// to: 'gabrielajram@gmail.com',
		subject: 'Smart Building - Reset Password',
		html: `
      <h3>Hello ${toUser.fName} </h3>
      <p>To reset your password please follow this link: <a target="_" href="${process.env.APP_URL}/auth/reset-password/${hash}">Reset Password Link</a></p>
      <p>Cheers,</p>
      <p>Clinton Park Smart Security</p>
    `
	};

	return sendEmail(message);
};
