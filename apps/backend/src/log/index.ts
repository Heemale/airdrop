import { formatTimestamp, getCurrentTimestampMs } from '@/utils/time';

export const consoleError = (functionName: string, message: string) => {
	console.error(
		`- ${formatTimestamp(getCurrentTimestampMs())} - ${functionName}: ${message}`,
	);
};

export const consoleLog = (functionName: string, message: string) => {
	console.log(
		`- ${formatTimestamp(getCurrentTimestampMs())} - ${functionName}: ${message}`,
	);
};
