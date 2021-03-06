import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Button from "../../buttons/Button";
import TextInput from "../../inputs/TextInput";
import useValidation from "../../hooks/useValidation";
import validatePicture from "../../utils/validatePicture";
import { updatePicture } from "../../actions/picture";

const EditPictureForm = ({ picture, children }) => {
  const [isDataValid, setDataValid] = useState(false);
  const [isEdited, setEdited] = useState(false);
  const dispatch = useDispatch();

  const initialState = {
    nameOfPicture: picture.name
  };

  const { values, errors, handleChange, handleBlur } = useValidation(
    initialState,
    validatePicture
  );

  useEffect(() => {
    const noErrors = Object.keys(errors).length === 0;

    setDataValid(noErrors);

    const { nameOfPicture } = values;
    const wasEdited = nameOfPicture !== picture.name;
    setEdited(wasEdited);
  }, [errors, values, picture.name]);

  function handleSubmit(e) {
    e.preventDefault();

    const { nameOfPicture } = values;

    const data = {
      name: nameOfPicture
    };

    dispatch(updatePicture(picture._id, data));
  }

  const submitStatus = () => {
    return !isEdited || !isDataValid;
  };

  return (
    <form className="update-picture-form" onSubmit={handleSubmit}>
      <TextInput
        name="nameOfPicture"
        title="name"
        value={values.nameOfPicture}
        onChange={handleChange}
        onBlur={handleBlur}
        errMessage={errors.nameOfPicture}
      />
      <div className="btn-group">
        <Button type="submit" disabled={submitStatus()}>
          save
        </Button>
        {children}
      </div>
    </form>
  );
};

export default EditPictureForm;
