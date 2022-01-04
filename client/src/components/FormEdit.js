import React from 'react';
import PropTypes from 'prop-types';
import './formEditStyle.css';

function FormEdit({
    handleHiddenFormEdit,
    handleInputChange,
    handleSubmitFormEdit,
    handleChangeImage,
    productName,
    productPrice,
    image,
}) {
    console.log(image);
    return (
        <div className="form-edit-item">
            <div className="title">Edit Product</div>
            <div className="input-upload">
                <div className="input-container ic0">
                    <div className="avatar-upload">
                        <div className="avatar-edit">
                            <input
                                type="file"
                                id="imageUpload"
                                accept=".png, .jpg, .jpeg"
                                onChange={handleChangeImage}
                            />
                            <label htmlFor="imageUpload"></label>
                            <i className="fas fa-file-image"></i>
                        </div>
                        <div className="avatar-preview">
                            <img
                                id="imagePreview"
                                src={
                                    image.name
                                        ? URL.createObjectURL(image)
                                        : image
                                        ? image
                                        : 'http://aimory.vn/wp-content/uploads/2017/10/no-image.png'
                                }
                            ></img>
                        </div>
                    </div>
                </div>
            </div>

            <div className="input-container ic1">
                <input
                    id="productName"
                    className="input"
                    name="productName"
                    type="text"
                    value={productName}
                    placeholder=" "
                    onChange={handleInputChange}
                />
                <div className="cut"></div>
                <label htmlFor="productName" className="placeholder">
                    Product name
                </label>
            </div>
            <div className="input-container ic2">
                <input
                    id="productPrice"
                    className="input"
                    type="text"
                    value={productPrice}
                    placeholder=" "
                    name="productPrice"
                    onChange={handleInputChange}
                />
                <div className="cut"></div>
                <label htmlFor="productPrice" className="placeholder">
                    Product price
                </label>
            </div>
            <button
                type="text"
                className="cancel"
                onClick={handleHiddenFormEdit}
            >
                Cancel
            </button>
            <button
                type="text"
                className="submit"
                onClick={handleSubmitFormEdit}
            >
                Save
            </button>
        </div>
    );
}

FormEdit.propTypes = {};

export default FormEdit;
