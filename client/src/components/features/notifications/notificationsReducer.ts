import { handleActions } from "redux-actions";
import {
  USERS_NOTIFICATIONS_TYPES,
  MARK_AS_READ_TYPES,
  MARK_AS_UNREAD_TYPES
} from "./notificationsActions";

import { combineAPIActions } from "../../utils";

interface NotificationsState {
  notifications: {
    ofType: {
      all: [];
      read: [];
      unread: [];
    };
    amount: number;
    readAmount: number;
    unreadAmount: number;
  };
}

interface GetNotificationsSuccess {
  payload: {
    notifications: [];
    read: [];
    unread: [];
    amount: number;
    readAmount: number;
    unreadAmount: number;
  };
}

const initialState = {
  ofType: {
    all: [],
    read: [],
    unread: []
  },
  amount: 0,
  readAmount: 0,
  unreadAmount: 0,
  message: null
};

export const notificationsReducer = handleActions(
  {
    ...combineAPIActions(
      [
        USERS_NOTIFICATIONS_TYPES[0],
        MARK_AS_READ_TYPES[0],
        MARK_AS_UNREAD_TYPES[0]
      ],
      (state: NotificationsState) => ({
        ...state,
        isLoading: true
      })
    ),

    ...combineAPIActions(
      [
        USERS_NOTIFICATIONS_TYPES[0],
        MARK_AS_READ_TYPES[0],
        MARK_AS_UNREAD_TYPES[0]
      ],
      (
        state: NotificationsState,
        action: { payload: { message: string } }
      ) => ({
        ...state,
        message: action.payload,
        isLoading: false
      })
    ),

    notifications: {
      USERS_NOTIFICATIONS_SUCCESS: (
        state,
        { payload }: GetNotificationsSuccess
      ) => ({
        ...state,
        ofType: {
          ...state.ofType,
          all: payload.notifications,
          read: payload.read,
          unread: payload.unread
        },
        amount: payload.amount,
        readAmount: payload.readAmount,
        unreadAmount: payload.unreadAmount
      }),

      MARK_AS_READ_SUCCESS: (
        state,
        {
          payload: { notification, message }
        }: { payload: { message: string; notification: { _id: string } } }
      ) => {
        const { ofType } = state;

        return {
          ...state,
          message,
          readAmount: state.readAmount + 1,
          unreadAmount: state.unreadAmount - 1,
          ofType: {
            ...ofType,
            read: [...ofType.read, notification],
            unread: ofType.unread.filter((ntf: { _id: string }) => {
              return ntf._id !== notification._id;
            })
          }
        };
      },

      MARK_AS_UNREAD_SUCCESS: (
        state,
        {
          payload: { notification, message }
        }: { payload: { message: string; notification: { _id: string } } }
      ) => {
        const { ofType } = state;

        return {
          ...state,
          message,
          readAmount: state.readAmount - 1,
          unreadAmount: state.unreadAmount + 1,
          ofType: {
            ...ofType,
            unread: [...ofType.unread, notification],
            read: ofType.read.filter((ntf: { _id: string }) => {
              return ntf._id !== notification._id;
            })
          }
        };
      }
    }
  },
  initialState
);
