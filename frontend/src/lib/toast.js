import {
  createElement,
} from "react";

import {
  toast,
} from "sonner";

import SuccessToast from "../components/ui/SuccessToast";

export const showSuccess = (
  message,
) => {
  toast.success(
    message,
  );
};

export const showLoginSuccess = (
  message,
  name,
) => {
  toast.custom(
    () =>
      createElement(
        SuccessToast,
        {
          message,
          name,
        },
      ),
    {
      duration: 2800,
      position:
        "top-center",
    },
  );
};

export const showError = (
  message,
) => {
  toast.error(
    message,
  );
};

export const showInfo = (
  message,
) => {
  toast.info(
    message,
  );
};

export const showWarning = (
  message,
) => {
  toast.warning(
    message,
  );
};

export const showLoading = (
  message = "جاري التحميل...",
) =>
  toast.loading(
    message,
  );

export const dismissToast = (
  toastId,
) => {
  toast.dismiss(
    toastId,
  );
};