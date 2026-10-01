import {
  ImagePlus,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import StatusSwitch from "../../../components/ui/StatusSwitch";

export default function CategoryForm({
  mode = "add",
  initialData = null,
  onSubmit,
  externalErrors = {},
}) {
  const [
    name,
    setName,
  ] = useState("");

  const [
    sortOrder,
    setSortOrder,
  ] = useState("");

  const [
    isActive,
    setIsActive,
  ] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | Category Image
  |--------------------------------------------------------------------------
  */

  const [
    image,
    setImage,
  ] = useState("");

  const [
    imageFile,
    setImageFile,
  ] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Banner
  |--------------------------------------------------------------------------
  */

  const [
    bannerImage,
    setBannerImage,
  ] = useState("");

  const [
    bannerImageFile,
    setBannerImageFile,
  ] = useState(null);

  const [
    bannerTitle,
    setBannerTitle,
  ] = useState("");

  const [
    bannerSubtitle,
    setBannerSubtitle,
  ] = useState("");

  const [
    errors,
    setErrors,
  ] = useState({});

  /*
  |--------------------------------------------------------------------------
  | Initial Data
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      mode === "edit" &&
      initialData
    ) {
      setName(
        initialData.name ??
          "",
      );

      setSortOrder(
        initialData.sortOrder !=
          null
          ? String(
              initialData.sortOrder,
            )
          : "",
      );

      setIsActive(
        initialData.isActive ??
          true,
      );

      setImage(
        initialData.image ??
          "",
      );

      setImageFile(
        null,
      );

      setBannerImage(
        initialData.banner
          ?.image ?? "",
      );

      setBannerImageFile(
        null,
      );

      setBannerTitle(
        initialData.banner
          ?.title ?? "",
      );

      setBannerSubtitle(
        initialData.banner
          ?.subtitle ?? "",
      );

      setErrors({});

      return;
    }

    setName("");
    setSortOrder("");
    setIsActive(true);

    setImage("");
    setImageFile(null);

    setBannerImage("");
    setBannerImageFile(null);

    setBannerTitle("");
    setBannerSubtitle("");

    setErrors({});
  }, [
    mode,
    initialData,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Category Image
  |--------------------------------------------------------------------------
  */

  function handleImageChange(
    event,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      setErrors(
        (
          current,
        ) => ({
          ...current,
          image:
            "من فضلك اختر صورة صحيحة",
        }),
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      setImage(
        reader.result,
      );

      setImageFile(
        file,
      );

      setErrors(
        (
          current,
        ) => ({
          ...current,
          image: "",
        }),
      );
    };

    reader.readAsDataURL(
      file,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Banner Image
  |--------------------------------------------------------------------------
  */

  function handleBannerImageChange(
    event,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      setErrors(
        (
          current,
        ) => ({
          ...current,
          bannerImage:
            "من فضلك اختر صورة بانر صحيحة",
        }),
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      setBannerImage(
        reader.result,
      );

      setBannerImageFile(
        file,
      );

      setErrors(
        (
          current,
        ) => ({
          ...current,
          bannerImage:
            "",
        }),
      );
    };

    reader.readAsDataURL(
      file,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  function validate() {
    const nextErrors =
      {};

    if (
      !name.trim()
    ) {
      nextErrors.name =
        "اسم القسم مطلوب";
    }

    const parsedSortOrder =
      Number(
        sortOrder,
      );

    if (
      !sortOrder ||
      !Number.isInteger(
        parsedSortOrder,
      ) ||
      parsedSortOrder < 1
    ) {
      nextErrors.sortOrder =
        "أدخل ترتيب صحيح يبدأ من 1";
    }

    if (!image) {
      nextErrors.image =
        "صورة القسم مطلوبة";
    }

    /*
     * في الإضافة صورة البانر مطلوبة.
     *
     * في التعديل نقدر نحتفظ
     * بصورة البانر الحالية.
     */
    if (
      mode === "add" &&
      !bannerImage
    ) {
      nextErrors.bannerImage =
        "صورة البانر مطلوبة";
    }

    if (
      !bannerTitle.trim()
    ) {
      nextErrors.bannerTitle =
        "عنوان البانر مطلوب";
    }

    if (
      !bannerSubtitle.trim()
    ) {
      nextErrors.bannerSubtitle =
        "وصف البانر مطلوب";
    }

    setErrors(
      nextErrors,
    );

    return (
      Object.keys(
        nextErrors,
      ).length === 0
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  function handleSubmit(
    event,
  ) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      name:
        name.trim(),

      image,
      imageFile,

      bannerImage,
      bannerImageFile,

      sortOrder:
        Number(
          sortOrder,
        ),

      isActive,

      banner: {
        title:
          bannerTitle.trim(),

        subtitle:
          bannerSubtitle.trim(),
      },
    });
  }

  return (
    <form
      id="category-form"
      onSubmit={
        handleSubmit
      }
      className="space-y-5 p-5"
    >
      {/* Name */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          اسم القسم
        </label>

        <input
          type="text"
          value={
            name
          }
          onChange={(
            event,
          ) => {
            setName(
              event.target
                .value,
            );

            if (
              errors.name
            ) {
              setErrors(
                (
                  current,
                ) => ({
                  ...current,
                  name: "",
                }),
              );
            }
          }}
          placeholder="مثال: المشروبات"
          autoFocus
          className={[
            "h-11 w-full rounded-xl border px-4 text-sm outline-none transition",

            errors.name
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
          ].join(" ")}
        />

        {errors.name && (
          <p className="mt-1.5 text-xs text-red-600">
            {
              errors.name
            }
          </p>
        )}
      </div>

      {/* Category Image */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          صورة القسم
        </label>

        <label
          className={[
            "flex cursor-pointer items-center gap-4 rounded-xl border border-dashed p-3 transition hover:bg-slate-50",

            errors.image
              ? "border-red-300"
              : "border-slate-300",
          ].join(" ")}
        >
          {image ? (
            <img
              src={image}
              alt="معاينة صورة القسم"
              className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <ImagePlus
                size={24}
              />
            </div>
          )}

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-700">
              {image
                ? "تغيير صورة القسم"
                : "اختر صورة القسم"}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              PNG أو JPG أو
              WEBP
            </p>
          </div>

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={
              handleImageChange
            }
            className="hidden"
          />
        </label>

        {errors.image && (
          <p className="mt-1.5 text-xs text-red-600">
            {
              errors.image
            }
          </p>
        )}
      </div>

      {/* Banner Image */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          صورة البانر
        </label>

        <label
          className={[
            "flex cursor-pointer items-center gap-4 rounded-xl border border-dashed p-3 transition hover:bg-slate-50",

            errors.bannerImage
              ? "border-red-300"
              : "border-slate-300",
          ].join(" ")}
        >
          {bannerImage ? (
            <img
              src={
                bannerImage
              }
              alt="معاينة صورة البانر"
              className="h-20 w-32 shrink-0 rounded-xl border border-slate-200 object-cover sm:w-40"
            />
          ) : (
            <div className="flex h-20 w-32 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 sm:w-40">
              <ImagePlus
                size={26}
              />
            </div>
          )}

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-700">
              {bannerImage
                ? "تغيير صورة البانر"
                : "اختر صورة البانر"}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              صورة عريضة لواجهة
              القسم
            </p>
          </div>

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={
              handleBannerImageChange
            }
            className="hidden"
          />
        </label>

        {errors.bannerImage && (
          <p className="mt-1.5 text-xs text-red-600">
            {
              errors.bannerImage
            }
          </p>
        )}
      </div>

      {/* Sort Order */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          ترتيب القسم
        </label>

        <input
          type="number"
          min="1"
          step="1"
          value={
            sortOrder
          }
          onChange={(
            event,
          ) => {
            setSortOrder(
              event.target
                .value,
            );

            if (
              errors.sortOrder ||
              externalErrors.sortOrder
            ) {
              setErrors(
                (
                  current,
                ) => ({
                  ...current,
                  sortOrder:
                    "",
                }),
              );
            }
          }}
          placeholder="مثال: 1"
          className={[
            "h-11 w-full rounded-xl border px-4 text-sm outline-none transition",

            errors.sortOrder ||
            externalErrors.sortOrder
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
          ].join(" ")}
        />

        {(errors.sortOrder ||
          externalErrors.sortOrder) && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.sortOrder ||
              externalErrors.sortOrder}
          </p>
        )}
      </div>

      {/* Banner Title */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          عنوان البانر
        </label>

        <input
          type="text"
          value={
            bannerTitle
          }
          onChange={(
            event,
          ) => {
            setBannerTitle(
              event.target
                .value,
            );

            if (
              errors.bannerTitle
            ) {
              setErrors(
                (
                  current,
                ) => ({
                  ...current,
                  bannerTitle:
                    "",
                }),
              );
            }
          }}
          placeholder="مثال: أساسيات البيت"
          className={[
            "h-11 w-full rounded-xl border px-4 text-sm outline-none transition",

            errors.bannerTitle
              ? "border-red-300"
              : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
          ].join(" ")}
        />

        {errors.bannerTitle && (
          <p className="mt-1.5 text-xs text-red-600">
            {
              errors.bannerTitle
            }
          </p>
        )}
      </div>

      {/* Banner Subtitle */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          وصف البانر
        </label>

        <textarea
          value={
            bannerSubtitle
          }
          onChange={(
            event,
          ) => {
            setBannerSubtitle(
              event.target
                .value,
            );

            if (
              errors.bannerSubtitle
            ) {
              setErrors(
                (
                  current,
                ) => ({
                  ...current,
                  bannerSubtitle:
                    "",
                }),
              );
            }
          }}
          placeholder="مثال: كل اللي تحتاجه بأفضل جودة"
          rows={3}
          className={[
            "w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition",

            errors.bannerSubtitle
              ? "border-red-300"
              : "border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100",
          ].join(" ")}
        />

        {errors.bannerSubtitle && (
          <p className="mt-1.5 text-xs text-red-600">
            {
              errors.bannerSubtitle
            }
          </p>
        )}
      </div>

      {/* Status */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              حالة القسم
            </p>

            <p className="mt-1 text-xs text-slate-400">
              حدد إذا كان القسم
              ظاهرًا ونشطًا في
              المتجر
            </p>
          </div>

          <StatusSwitch
            checked={
              isActive
            }
            onChange={
              setIsActive
            }
          />
        </div>
      </div>
    </form>
  );
}