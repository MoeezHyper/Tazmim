import { XCircleIcon } from "@heroicons/react/20/solid";

type ErrorNotificationProps = {
  errorMessage: string;
};

/**
 * Display an error notification
 * @param {ErrorNotificationProps} props The component props
 */
export default function ErrorNotification({
  errorMessage,
}: ErrorNotificationProps) {
  return (
    <div className="mx-4 mb-10 rounded-md bg-red-50 p-4 lg:mx-6 xl:mx-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-red-800">{errorMessage}</p>
        </div>
      </div>
    </div>
  );
}
