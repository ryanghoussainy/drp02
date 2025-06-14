import fs from 'fs';

if (process.env.GOOGLE_SERVICES_JSON) {
  const googleServices = Buffer.from(process.env.GOOGLE_SERVICES_JSON, 'base64').toString();
  fs.writeFileSync('./google-services.json', googleServices);
  console.log('✅ google-services.json created successfully');
}
