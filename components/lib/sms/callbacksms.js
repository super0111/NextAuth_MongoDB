import { Twilio } from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new Twilio(accountSid, authToken);



function sendText(member,body) {
	return new Promise((res, rej) => {
        client.messages
        .create({
            from: twilioNumber,
            to:  member.phone,
            body: body,
        })
        .then((message) => console.log(message.sid)).catch((err) => {console.log('SMS Error', err)})
		
	});
}
function sendAlertText(member,body) {
	return new Promise((res, rej) => {
        client.messages
        .create({
            from: twilioNumber,
            to:  member.phone, // member.phone
            body: body,
        })
        .then((message) => console.log(message.sid)).catch((err) => {console.log('SMS Error', err)})
		
	});
}

export const sendCallbackText = (member,plateNum) => {
	const smsBody = `${plateNum} entered succesffully`
	return sendText(member,smsBody);
};

export const sendCallbackAlertText = (member,plateNum) => {
	const smsBody = `ALERT! ${plateNum} was prohibited from entering at ${new Date().toLocaleDateString()}.`
	return sendAlertText(member,smsBody);
};
