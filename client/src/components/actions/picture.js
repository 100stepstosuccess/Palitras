import { createActions, createAction } from "redux-actions";
import makeRequestToAPI from "../lib/utils/makeRequestToAPI";
import { pictureAPI } from "./api";

const reducerName = "picture";
const createDispatchAPIFlow = makeRequestToAPI(reducerName);

export const fetchImagesActionCreators = createActions({
  [reducerName]: {
    FETCH_IMAGES_REQUEST: undefined,
    FETCH_IMAGES_SUCCESS: data => ({ data }),
    FETCH_IMAGES_FAIL: err => ({ err })
  }
});

export const fetchPictureActionCreators = createActions({
  [reducerName]: {
    FETCH_PICTURE_REQUEST: undefined,
    FETCH_PICTURE_SUCCESS: data => ({ data }),
    FETCH_PICTURE_FAIL: err => ({ err })
  }
});

export const fetchFavoritesActionCreators = createActions({
  [reducerName]: {
    FETCH_FAVORITES_REQUEST: undefined,
    FETCH_FAVORITES_SUCCESS: data => ({ data }),
    FETCH_FAVORITES_FAIL: err => ({ err })
  }
});

export const uploadPictureActionCreators = createActions({
  [reducerName]: {
    UPLOAD_PICTURE_REQUEST: undefined,
    UPLOAD_PICTURE_SUCCESS: data => ({ data }),
    UPLOAD_PICTURE_FAIL: err => ({ err })
  }
});

export const addFavoriteActionCreators = createActions({
  [reducerName]: {
    ADD_FAVORITE_REQUEST: undefined,
    ADD_FAVORITE_SUCCESS: data => ({ data }),
    ADD_FAVORITE_FAIL: err => ({ err })
  }
});

export const removeFavoriteActionCreators = createActions({
  [reducerName]: {
    REMOVE_FAVORITE_REQUEST: undefined,
    REMOVE_FAVORITE_SUCCESS: data => ({ data }),
    REMOVE_FAVORITE_FAIL: err => ({ err })
  }
});

export const removePictureActionCreators = createActions({
  [reducerName]: {
    REMOVE_PICTURE_REQUEST: undefined,
    REMOVE_PICTURE_SUCCESS: data => ({ data }),
    REMOVE_PICTURE_FAIL: err => ({ err })
  }
});

export const updatePictureActionCreators = createActions({
  [reducerName]: {
    UPDATE_PICTURE_REQUEST: undefined,
    UPDATE_PICTURE_SUCCESS: data => ({ data }),
    UPDATE_PICTURE_FAIL: err => ({ err })
  }
});

export const clearCurrentPicture = createAction(
  `${reducerName}/CLEAR_CURRENT_PICTURE`
);

const uploadPictureAPI = url => data => async dispatch => {
  const { pictureFile, nameOfPicture } = data;

  const formData = new FormData();
  formData.append(
    "picture",
    new Blob([pictureFile], { type: pictureFile.type }),
    pictureFile.name
  );
  formData.append("name", nameOfPicture);

  createDispatchAPIFlow(url, dispatch, uploadPictureActionCreators, {
    method: "post",
    data: formData
  });
};

const fetchPicturesAPI = url => () => async dispatch =>
  createDispatchAPIFlow(url, dispatch, fetchImagesActionCreators);

const fetchFavoritesAPI = url => () => async dispatch =>
  createDispatchAPIFlow(url, dispatch, fetchFavoritesActionCreators);

const fetchOnePictureAPI = url => id => async dispatch =>
  createDispatchAPIFlow(url(id), dispatch, fetchPictureActionCreators);

const addFavoriteAPI = url => id => async dispatch =>
  createDispatchAPIFlow(url(id), dispatch, addFavoriteActionCreators, {
    method: "patch"
  });

const removeFavoriteAPI = url => id => async dispatch =>
  createDispatchAPIFlow(url(id), dispatch, removeFavoriteActionCreators, {
    method: "patch"
  });

const removePictureAPI = url => id => async dispatch =>
  createDispatchAPIFlow(url(id), dispatch, removePictureActionCreators, {
    method: "delete"
  });

const updatePictureAPI = url => (id, data) => async dispatch =>
  createDispatchAPIFlow(url(id), dispatch, updatePictureActionCreators, {
    method: "patch",
    data
  });

export const uploadPicture = uploadPictureAPI(pictureAPI.uploadPicture);
export const fetchPictures = fetchPicturesAPI(pictureAPI.fetchPictures);
export const fetchFavorites = fetchFavoritesAPI(pictureAPI.fetchFavorites);
export const fetchOnePicture = fetchOnePictureAPI(pictureAPI.fetchOnePicture);
export const addFavorite = addFavoriteAPI(pictureAPI.addFavorite);
export const removeFavorite = removeFavoriteAPI(pictureAPI.removeFavorite);
export const removePicture = removePictureAPI(pictureAPI.removePicture);
export const updatePicture = updatePictureAPI(pictureAPI.updatePicture);