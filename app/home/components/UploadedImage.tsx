import { FaTrashAlt } from "react-icons/fa";
import clsx from "clsx";

type UploadedImageProps = {
  image: File;
  removeImage(): void;
  file: {
    name: string;
    size: string;
  };
};

/**
 * Display the uploaded image
 * @param {UploadedImageProps} props The component props
 */
export default function UploadedImage({
  file,
  image,
  removeImage,
}: UploadedImageProps) {
  return (
    <section className="relative h-[300px] w-full overflow-hidden rounded-lg border border-gray-300 bg-white">
      <div className="relative block h-full w-full bg-gray-100 text-center">
        <img
          src={URL.createObjectURL(image)}
          alt={image.name}
          className="h-full w-full object-contain"
        />
      </div>
      <button
        className="group absolute right-1 top-1 bg-red-500 p-2 text-white hover:bg-red-600"
        onClick={removeImage}
      >
        <FaTrashAlt className="h-4 w-4 duration-300 group-hover:scale-110" />
      </button>
      <div className="absolute left-0 top-0 bg-black bg-opacity-50 p-2 pl-3.5 text-sm text-white">
        {file.name} ({file.size})
      </div>
    </section>
  );
}
