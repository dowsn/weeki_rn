// export const host = 'weeki-lukasmeinhart.replit.app';
export const host = 'weeki-production.up.railway.app';
export const www =
  `https://${host}/`;

export const ASSISTANT_PROFILE_PICTURE = "";

// Store URLs
export const APP_STORE_URL = 'https://apps.apple.com/app/your-app-id';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.yourcompany.weeki';

export const globalUrl = `${www}api/`;
const baseUrl = `${www}`;
const profilePictures = baseUrl + "items/uploads/images/profilepictures/";
const dbUrl = `${www}api/`;

// For colors and fonts, you can use CSS in JS
const labelStandardBackgroundColor = 'white';
const fontStandardColor = 'black';
const standardTextFont = { fontFamily: 'Apercu-Regular', fontSize: 12 };
const standardHeadlineFont = { fontFamily: 'Apercu-Bold', fontSize: 24 };