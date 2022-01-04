export const imageUpload = async (image) => {
    const formData = new FormData();
    console.log(image);

    formData.append('file', image);
    formData.append('upload_preset', 'bjy8aues');
    formData.append('cloud_name', 'hoang-long');

    const res = await fetch(
        'https://api.cloudinary.com/v1_1/hoang-long/upload',
        {
            method: 'POST',
            body: formData,
        },
    );
    const data = await res.json();
    return data.secure_url;
};
