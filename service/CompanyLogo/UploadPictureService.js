const axios = require('axios');
const fs = require('fs');
const formData = require('form-data');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const accessToken = process.env.ACCESS_TOKEN;

// initialize the upload for a picture
const initializeUpload = async () => {
    try {
        // upload a picture under ../resources folder
        const response = await axios.post(
            'https://api.linkedin.com/rest/images?action=initializeUpload', {
                    "initializeUploadRequest": {
                        "owner": "urn:li:person:QMGpV_X3Ej"
                }
            }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'LinkedIn-Version': '202403'
            }
        });
        console.log("initializeUpload Response data:", response.data);

        return response.data;
    } catch (error) {
        console.error("initializeUpload error is:", error);
    }
};


// upload the picture to the uploadUrl
const uploadPicture = async (uploadUrl, imageName) => {
    try {
        let url = uploadUrl;
        let headers = {
            'Authorization': `Bearer ${accessToken}`
        }

        // use FormData to read the image file
        const filePath = path.resolve(__dirname, `../resource/company/${imageName}`);
        const form_data = new formData();
        form_data.append('file', fs.createReadStream(filePath));

        // Get the headers from the FormData instance, which includes the Content-Type with boundary
        const formHeaders = form_data.getHeaders();

        // Merge the custom headers with the form headers
        const response = await axios.post(url, form_data, {
            headers: {
                ...headers,
                ...formHeaders
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        return response;
    } catch (error) {
        console.error("uploadPicture error is:", error);
        return null;
    }
};


const fetchPicture = async (imageUrn, imageName) => {
    let url = `https://api.linkedin.com/rest/images/${imageUrn}`;
    let token = process.env.ACCESS_TOKEN;
    let version = '202403';
    let headers = {
        'Authorization': `Bearer ${token}`,
        'LinkedIn-Version': version
    }

    try {
        // try to fetch the image from LinkedIn until the response.data.status is 'AVAILABLE'
        let response = null;
        while (true) {
            response = await axios.get(url, {
                headers: headers
            });

            console.log("Fetched pic status:", response.data.status);
            if (response.data.status === 'AVAILABLE') {
                break;
            }

            // sleep for 5 seconds
            console.log("Sleep for 5 seconds...");
            await new Promise(resolve => setTimeout(resolve, 5000));
        }


        console.log("Uploaded fetched pic:", response.data);

        let downloadUrl = response.data.downloadUrl;
        let image = await axios.get(downloadUrl, {
            responseType: 'stream'
        });

        // console.log("Image data:", image.data);
        // store the image in current directory
        let filePath = path.resolve(__dirname, `../resource/downloaded/${imageName}`);
        image.data.pipe(fs.createWriteStream(filePath));
        console.log("Downloaded image is stored in:", filePath);
    } catch (error) {
        console.error("fetchPicture error is:", error);
    }
}

const performUploadPicture = async (imageName) => {
    try {
        let uploadResponse = await initializeUpload();
        let uploadUrl = uploadResponse.value.uploadUrl;
        console.log('Upload URL:', uploadUrl);
        let upload_result = await uploadPicture(uploadUrl, imageName);
        if (!upload_result) {
            console.error("Upload failed!");
            return null;
        }
        console.log("Response status code:", upload_result.status);

        // fetch the uploaded picture
        let imageUrn = uploadResponse.value.image;
        await fetchPicture(imageUrn, imageName);

        console.log("Uploaded imageUrn is:", imageUrn);
        return imageUrn;
    } catch (error) {
        console.error('Error initializing upload:', error);
    }
}

// let test_company_image_name = 'Apple.png';
// performUploadPicture(test_company_image_name);

module.exports = {
    performUploadPicture
};
